import { Body, Controller, HttpCode, Post, Patch } from '@nestjs/common';
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
import {
  type UpdateUserRequestDTO,
  UpdateUserRequestSchema,
  UpdateUserResponseDTO,
} from '@project/shared/src/dtos/update-user.dto';

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

  @Patch('update')
  @HttpCode(200)
  update(@Body() body: UpdateUserRequestDTO) {
    const validBody = UpdateUserRequestSchema.parse(body);

    const token = this.authService.update(validBody.username, validBody.email);

    const response: UpdateUserResponseDTO = { token };

    return response;
  }
}
