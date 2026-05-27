import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Get,
  Param,
  UsePipes,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

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
  DisableUserRequestSchema,
  DisableUserResponseDTO,
} from '@project/shared/src/dtos/user/disable-user.dto';

import { type FetchUserProfileResponseDTO } from '@project/shared/src/dtos/user/fetch-user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update-username')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(UpdateUsernameRequestSchema))
  async updateUsername(
    @Body() { username }: UpdateUsernameRequestDTO,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.sub);

    await this.userService.updateUsername(username, userId);

    const response: UpdateUsernameResponseDTO = { username, id: userId };

    return response;
  }

  @Patch('update-image')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(UpdateImageRequestSchema))
  async updateImage(
    @Body() { imageURL }: UpdateImageRequestDTO,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.sub);

    await this.userService.updateImage(imageURL, userId);

    const response: UpdateImageResponseDTO = { imageURL, id: userId };

    return response;
  }

  @Patch('update-bio')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(UpdateBioRequestSchema))
  async updateBio(
    @Body() { bio }: UpdateBioRequestDTO,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.sub);

    await this.userService.updateBio(bio, userId);

    const response: UpdateBioResponseDTO = { bio, id: userId };

    return response;
  }

  @Patch('disable')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(DisableUserRequestSchema))
  async disableUser(@Request() req: AuthenticatedRequest) {
    const userId = Number(req.user.sub);

    const token = await this.userService.disable(userId);

    const response: DisableUserResponseDTO = { token };

    return response;
  }

  @Get(':id/profile')
  @HttpCode(200)
  async fetchUserProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FetchUserProfileResponseDTO> {
    return this.userService.fetchUserProfile(id);
  }
}
