import { Body, Controller, HttpCode, Patch } from '@nestjs/common';
import { UserService } from './user.service';

import {
  type UpdateUserRequestDTO,
  UpdateUserRequestSchema,
  UpdateUserResponseDTO,
} from '@project/shared/src/dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update')
  @HttpCode(200)
  update(@Body() body: UpdateUserRequestDTO) {
    const validBody = UpdateUserRequestSchema.parse(body);

    const token = this.userService.update(validBody.username, validBody.email);

    const response: UpdateUserResponseDTO = { token };

    return response;
  }
}
