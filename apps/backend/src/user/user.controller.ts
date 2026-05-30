import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Get,
  Post,
  UseGuards,
  Param,
  UsePipes,
  Request,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
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

import {
  type RegisterUserRatingRequestDTO,
  RegisterUserRatingRequestSchema,
  RegisterUserRatingResponseDTO,
} from '@project/shared/src/dtos/user/register-user-rating.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import z from 'zod';

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
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Body() body: UpdateImageRequestDTO,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.sub);

    const validation = UpdateImageRequestSchema.safeParse({
      ...body,
      image: file,
      id: userId,
    });

    if (!validation.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: z.treeifyError(validation.error),
      });
    }

    const savedFileName = await this.userService.updateImage(file, userId);

    const response: UpdateImageResponseDTO = {
      imageUrl: `http://localhost:3000/users/image/${savedFileName}`,
      id: userId,
    };

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

  @Post(':targetId/rate')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(RegisterUserRatingRequestSchema))
  async createUserRating(
    @Param('targetId', ParseIntPipe) targetId: number,
    @Body() { rating, comment }: RegisterUserRatingRequestDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<RegisterUserRatingResponseDTO> {
    const authorId = Number(req.user.sub);

    const response = await this.userService.createUserRating(
      authorId,
      targetId,
      rating,
      comment ?? undefined,
    );

    return response;
  }
}
