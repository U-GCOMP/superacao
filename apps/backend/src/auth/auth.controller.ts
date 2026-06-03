import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmCodeRequestSchema,
  ConfirmCodeResponseDTO,
  LoginRequestSchema,
  LoginResponseDTO,
  RedefinePasswordEmailRequestSchema,
  RedefinePasswordEmailResponseDTO,
  RedefinePasswordRequestSchema,
  RedefinePasswordResponseDTO,
} from '@project/shared';
import { RegisterRequestSchema, RegisterResponseDTO } from '@project/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('recoverPassword')
  async recoverPassword(
    @Body() body: unknown,
  ): Promise<RedefinePasswordEmailResponseDTO> {
    const validBody = RedefinePasswordEmailRequestSchema.parse(body);

    await this.authService.recoverPassword(validBody.email);

    return { token: 'oi' };
  }

  @Post('confirmCode')
  async confirmCode(@Body() body: unknown): Promise<ConfirmCodeResponseDTO> {
    const validBody = ConfirmCodeRequestSchema.parse(body);

    const token = await this.authService.confirmCode(validBody.code);

    return { token };
  }

  @Post('redefinePassword')
  async redefinePassword(
    @Headers('authorization') authorization: string,
    @Body() body: unknown,
  ): Promise<RedefinePasswordResponseDTO> {
    if (!authorization) {
      throw new UnauthorizedException('Token não informado');
    }

    const [type, resetToken] = authorization.split(' ');

    if (type !== 'Bearer' || !resetToken) {
      throw new UnauthorizedException('Token inválido');
    }

    const validBody = RedefinePasswordRequestSchema.parse(body);

    const token = await this.authService.redefinePassword(
      resetToken,
      validBody.newPassword,
    );

    return { token };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: unknown): Promise<LoginResponseDTO> {
    const validBody = LoginRequestSchema.parse(body);
    const token = await this.authService.login(
      validBody.email,
      validBody.password,
    );
    return { token };
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: unknown): Promise<RegisterResponseDTO> {
    const validBody = RegisterRequestSchema.parse(body);
    const token = await this.authService.register(
      validBody.username,
      validBody.email,
      validBody.password,
    );
    return { token };
  }
}
