import { Body, Controller, HttpCode, Patch } from '@nestjs/common';
import { UpdateService } from './update.service';
import {
  type UpdateRequestDTO,
  UpdateRequestSchema,
  UpdateResponseDTO,
} from '@project/shared';

@Controller('update')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Patch()
  @HttpCode(200)
  register(@Body() body: UpdateRequestDTO) {
    const validBody = UpdateRequestSchema.parse(body);

    const token = this.updateService.update(
      validBody.username,
      validBody.email,
    );

    const response: UpdateResponseDTO = { token };

    return response;
  }
}
