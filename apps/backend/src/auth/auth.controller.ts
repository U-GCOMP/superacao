import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  type LoginRequestDTO,
  LoginRequestSchema,
  LoginResponseDTO,
} from '@project/shared';
import {
  type RegisterRequestDTO,
  RegisterRequestSchema,
  RegisterResponseDTO,
} from '@project/shared/src/dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginRequestDTO) {
    const validBody = LoginRequestSchema.parse(body);

    const token = this.authService.login(validBody.email, validBody.password);

    const response: LoginResponseDTO = { token };

    return response;
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() body: RegisterRequestDTO) {
    const validBody = RegisterRequestSchema.parse(body);

    const token = this.authService.register(
      validBody.username,
      validBody.email,
      validBody.password,
    );

    const response: RegisterResponseDTO = { token };

    return response;
  }
}
