/**
 * 1) 요청객체 request를 불러오고 authorization header로부터 토큰을 가져온다.
 *
 * 2) authService.extracTokenFromHeader를 사용 토큰 추출
 *
 * 3) authService.decodeBasicToken을 실행, email/password 추출
 *
 * 4) email, password를 이용해서 사용자를 정보를 가져온다.
 *
 * 5) 사용자 정보를 request 에 추가해준다. (req.user = user)
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }
    const token = this.authService.extracTokenFromHeader(rawToken, false);
    const { email, password } = this.authService.decodeBasicToken(token);
    const user = await this.authService.authenticateWithEmailAndPassword({
      email,
      password,
    });
    req.user = user;

    return true;
  }
}
