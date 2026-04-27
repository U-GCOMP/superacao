import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import {
  type RegisterRequestDTO,
  RegisterRequestSchema,
  RegisterResponseDTO,
} from '@project/shared';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @HttpCode(201)
  register(@Body() body: RegisterRequestDTO) {
    const validBody = RegisterRequestSchema.parse(body);

    const token = this.registerService.register(
      validBody.username,
      validBody.email,
      validBody.password,
    );

    const response: RegisterResponseDTO = { token };

    return response;
  }
}
