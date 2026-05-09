import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestSchema, LoginResponseDTO } from '@project/shared';
import { RegisterRequestSchema, RegisterResponseDTO } from '@project/shared';
import { AuthGuard } from './auth.guard';
import type { AuthenticatedRequest } from './interfaces/authenticated-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //REMOVE: Example
  @Get('hello')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  sayHello(@Request() req: AuthenticatedRequest) {
    console.log(req['user'].email);
    return this.authService.sayHello();
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
