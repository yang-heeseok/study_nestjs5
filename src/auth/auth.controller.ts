import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  MaxLengthPipe,
  MinLengthPipe,
  PasswordPipe,
} from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const accessToken = this.authService.rotateToken(token, false);
    return {
      accessToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const refreshToken = this.authService.rotateToken(token, true);
    return {
      refreshToken,
    };
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);
    return this.authService.loginwithEmail(credentials); //
  }
  /* 
  @Post('login/email')
  loginEmail(
    // @Body('email') email: string,
    // @Body('password') password: string
    @Headers()
  ) {
    return this.authService.loginwithEmail({
      email,
      password,
    });
  } */

  @Post('register/email')
  postRegisgerEmail(
    @Body('email') email: string,
    @Body('password', PasswordPipe) password: string,
    // @Body(
    //   'password',
    //   new MaxLengthPipe(8, '비번밀번호'),
    //   new MinLengthPipe(3, '비번밀번호'),
    // )
    // password: string,
    @Body('nickname') nickname: string,
  ) {
    return this.authService.registerWithEmail({
      email,
      password,
      nickname,
    });
  }
}
