import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestSchema, LoginResponseDTO } from '@project/shared';
import { RegisterRequestSchema, RegisterResponseDTO } from '@project/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: unknown): Promise<LoginResponseDTO> {
    const validBody = LoginRequestSchema.parse(body);
    const token = await this.authService.login(validBody.email, validBody.password);
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