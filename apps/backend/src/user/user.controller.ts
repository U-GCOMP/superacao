import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';

import {
  type UpdateUsernameRequestDTO,
  UpdateUsernameRequestSchema,
  UpdateUsernameResponseDTO,
} from '@project/shared/src/dtos/user/update-username.dto';

import {
  type UpdateImageRequestDTO,
  UpdateImageRequestSchema,
  UpdateImageResponseDTO,
} from '@project/shared/src/dtos/user/update-image.dto';

import {
  type UpdateBioRequestDTO,
  UpdateBioRequestSchema,
  UpdateBioResponseDTO,
} from '@project/shared/src/dtos/user/update-bio.dto';

import {
  type DisableUserRequestDTO,
  DisableUserRequestSchema,
  DisableUserResponseDTO,
} from '@project/shared/src/dtos/user/disable-user.dto';

import {
  type FetchUserProfileRequestDTO,
  FetchUserProfileRequestSchema,
  FetchUserProfileResponseDTO,
} from '@project/shared/src/dtos/user/fetch-user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update-username')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(UpdateUsernameRequestSchema))
  async updateUsername(@Body() { username, id }: UpdateUsernameRequestDTO) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.userService.updateUsername(username, id);

    const response: UpdateUsernameResponseDTO = { username, id };

    return response;
  }

  @Patch('update-image')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(UpdateImageRequestSchema))
  async updateImage(@Body() { imageURL, id }: UpdateImageRequestDTO) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.userService.updateImage(imageURL, id);

    const response: UpdateImageResponseDTO = { imageURL, id };

    return response;
  }

  @Patch('update-bio')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(UpdateBioRequestSchema))
  async updateBio(@Body() { bio, id }: UpdateBioRequestDTO) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.userService.updateBio(bio, id);

    const response: UpdateBioResponseDTO = { bio, id };

    return response;
  }

  @Patch('disable')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(DisableUserRequestSchema))
  async disableUser(@Body() body: DisableUserRequestDTO) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = await this.userService.disable(body.id);

    const response: DisableUserResponseDTO = { token };

    return response;
  }

  @Get('profile')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(FetchUserProfileRequestSchema))
  async fetchUserProfile(
    @Query() query: FetchUserProfileRequestDTO,
  ): Promise<FetchUserProfileResponseDTO> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.userService.fetchUserProfile(query.id);
  }
}
