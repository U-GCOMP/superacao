import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  type LoginRequestDTO,
  LoginRequestSchema,
  LoginResponseDTO,
} from '@project/shared';

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
}
