import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  Request,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Res,
  StreamableFile,
  BadRequestException,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  FetchEventListQueryParametersDTO,
  FetchEventListQueryParametersSchema,
  RegisterEventRequestDTO,
  RegisterEventRequestSchema,
  RegisterEventResponseDTO,
} from '@project/shared';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import {
  FetchEventDetailsRequestDTO,
  FetchEventDetailsRequestSchema,
} from '@project/shared/src/dtos/event/fetch-event-details.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { AuthRepository } from '../auth/auth.repository';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, createReadStream } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { lookup } from 'mime-types';

import z from 'zod';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventsService: EventService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UsePipes(new ZodValidationPipe(FetchEventListQueryParametersSchema))
  async fetchEvents(@Query() query: FetchEventListQueryParametersDTO) {
    return this.eventsService.fetchEvents(query);
  }

  @Get(':eventId')
  @UsePipes(new ZodValidationPipe(FetchEventDetailsRequestSchema))
  async fetchEventDetails(@Param() params: FetchEventDetailsRequestDTO) {
    return this.eventsService.fetchEventDetails(params);
  }

  @Get('image/:name')
  getEventImage(
    @Param('name') name: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const imagesPath = this.configService.get<string>('IMAGES_PATH');

    if (!imagesPath) {
      throw new Error('IMAGES_PATH is not defined');
    }

    const fullPath = join(imagesPath, name);

    if (!existsSync(fullPath)) {
      throw new NotFoundException('Image not found');
    }

    const file = createReadStream(fullPath);

    const mimeType = lookup(fullPath) || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);

    return new StreamableFile(file);
  }
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async registerEvent(
    @Request() req: AuthenticatedRequest,
    @Body() body: RegisterEventRequestDTO,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<RegisterEventResponseDTO> {
    // Always validating without the image, since Zod expects a File instance rather than an Express.Multer.File
    const validation = RegisterEventRequestSchema.safeParse({
      ...body,
      image: undefined,
    });

    if (!validation.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: z.treeifyError(validation.error),
      });
    }

    const owner = await this.authRepository.getUserByEmail(req['user'].email);

    if (!owner) {
      throw new ForbiddenException('User not found');
    }

    const id = await this.eventsService.registerEvent(body, owner, image);

    return {
      token: id,
    };
  }
}
