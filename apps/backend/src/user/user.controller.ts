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
  async updateUsername(@Body() body: UpdateUsernameRequestDTO) {
    const token = await this.userService.updateUsername(
      body.username,
      body.email,
    );

    const response: UpdateUsernameResponseDTO = { token };

    return response;
  }

  @Patch('update-image')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(UpdateImageRequestSchema))
  async updateImage(@Body() body: UpdateImageRequestDTO) {
    const token = await this.userService.updateImage(body.imageURL, body.email);

    const response: UpdateImageResponseDTO = { token };

    return response;
  }

  @Patch('update-bio')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(UpdateBioRequestSchema))
  async updateBio(@Body() body: UpdateBioRequestDTO) {
    const token = await this.userService.updateBio(body.bio, body.email);

    const response: UpdateBioResponseDTO = { token };

    return response;
  }

  @Patch('disable')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(DisableUserRequestSchema))
  async disableUser(@Body() body: DisableUserRequestDTO) {
    const token = await this.userService.disable(body.email);

    const response: DisableUserResponseDTO = { token };

    return response;
  }

  @Get('profile')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(FetchUserProfileRequestSchema))
  async fetchUserProfile(
    @Query() query: FetchUserProfileRequestDTO,
  ): Promise<FetchUserProfileResponseDTO> {
    return this.userService.fetchUserProfile(query.email);
  }
}
