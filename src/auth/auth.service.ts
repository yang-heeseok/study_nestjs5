import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * 1) registerQithEmail
   * - email, nickname, password 입력받고, 사용자 생성
   * - accessToken, refreshToken을 반환
   *
   * 2) loginWithEmail
   * - email, password 를 입력, 사용자 검증
   * - 검증이 완료되면 accessToken, refreshToken 을 반환
   *
   * 3). loginUser
   * - 1), 2)에서 필요한 accessToken, refreshToken 을 반환하는 로직
   *
   * 4) singToken
   * - 3)에서 필요한 accessToken, refreshToken을 sign하는 로직
   *
   * 5) authenticateWithEmailAndPassword
   * - 2)에서 로그인을 진행할때 필요한 기본적인 검증 진행
   *    1. 사용자가 존재하는지 확인 (email)
   *    2. 비밀번호가 맞는지 확인
   *    3. 모두 통과되면 찾은 사용자 정보봔환
   *    4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   *
   * Q : accessToken expire 되지 않았다면, 2번과정은 생략되는 건가?
   * Q : loginUser 반환값이 2종류의 token 을 cookie 로 반환하지 않는건가?
   * Q :
   */

  /** 4) */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  /** 3) */
  async loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  /** 5) */
  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const passOk = await bcrypt.compare(user.password, existingUser.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }

  /** 2) */
  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(existingUser);
  }

  /** 1) */
  async registerWithEmail(user: RegisterUserDto) {
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);
    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });
    return this.loginUser(newUser);
  }

  /**
   * 1) 사용자가 로그인 or 회원가입을 진행하면 accessToken, refreshToken 을 발급
   *
   * 2) 로그인 할 때, Basic 토큰과 함께 요청
   *    BasicToken 은 email:password 을 Base64 로 인코딩 한다.
   *    예) {authorization: 'Basic {token}'}
   *
   * 3) 아무나 접근할 수 없는 정보(private route)를 접근할 때에는
   *    accessToken 을 Header에 추가해서 요청과 함께 보낸다.
   *    예) {authorization: 'Bearer {token}'}
   *
   * 4) token 과 request를 함께 받은 서버는 token 검증을 통해, user 가 누구인지 알 수 있다.
   *    token 이 없는 사용자는 데이터에 접근하지 못한다.
   *
   * 5) 만료된 토큰은 재발급 받아야 한다. jwService.verify()의 인증에서 통과되지 못한다.
   *    access : auth/token/access
   *    refresh : auth/token/refresh
   *
   * 6) 각각 엔드포인트에서 token을 재발급 받는다.
   */

  extracTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다.!');
    }
    const token = splitToken[1];
    return token;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const split = decoded.split(':');
    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }
    return {
      email: split[0],
      password: split[1],
    };
    // codefactory11@gmail.com:123123
    // Basic Y29kZWZhY3RvcnkxMUBnbWFpbC5jb206MTIzMTIz
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: JWT_SECRET });
    } catch (error) {
      throw new UnauthorizedException('만료되었거나 잘못된 토큰입니다.');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 refresh token으로만 가능합니다.',
      );
    }
    return this.signToken({ ...decoded }, isRefreshToken);
  }
}
