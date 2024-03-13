import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './const/auth.const';

@Injectable()
export class AuthService {
  /**
     * 1. registerWithEmail
        - email, nickname, password
        - 생성이 완료되면 accessToken, refreshToken 반환

     * 2. loginwithEmail
        - email, password 를 이력하면 사용자 검증을 진행한다.
        - 검증이 완료되면 accessToken, refreshToken 반환

     * 3. loginUser
        - 1, 2에서 필요한 accessToken, refreshToken 반환

     * 4. signToken
        - 3에서 필요한 accessToken과 refreshToken을 singn 하는 로직

     * 5. authenticateWithEmailAndPassword
        - 2에서 로그인을 진행할 때 필요한 기본 검증
            - 사용자가 존재하는지 확인
            - 비밀번호가 맞는지 확인
            - 모두 통과되면 찾은 사용자 정보 반환
            - loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
     */
  constructor(private readonly jwtService: JwtService) {}

  // #4
  /**
   * Payload에 들어갈 정보
   * 1) email
   * 2) sub -> id
   * 3) type : 'access', 'refresh'
   */
  //   signToken(user: Pick<UserModel, 'email' | id>, isRefreshToken: boolean) {
  signToken(user: { email: string; id: string }, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      // seconds
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  // #3
  loginUser(user: { email: string; id: string }) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  // #5
  async authenticateWithEmailAndPassword(user: {
    email: string;
    password: string;
  }) {
    return {};
  }
}
