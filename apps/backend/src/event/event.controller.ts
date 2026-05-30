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
  NotFoundException,
  Res,
  StreamableFile,
  BadRequestException,
  Patch
  UploadedFile,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  FetchEventListQueryParametersDTO,
  FetchEventListQueryParametersSchema,
  RegisterEventRequestDTO,
  RegisterEventRequestSchema,
  RegisterEventResponseDTO,
  FetchEventRatingsEventRequestDTO,
  FetchEventRatingsEventRequestSchema,
  FetchEventRatingsEventResponseDTO,
  SubscribeToEventRequestSchema,
  SubscribeToEventResponseDTO,
  DeactivateEventParamDTO,
  DeactivateEventParamSchema
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
    const imagesPath = this.configService.get<string>('IMAGES_PATH_EVENTS');

    if (!imagesPath) {
      throw new Error('IMAGES_PATH_EVENTS is not defined');
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
  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async registerEvent(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: RegisterEventRequestDTO,
  ): Promise<RegisterEventResponseDTO> {
    const validation = RegisterEventRequestSchema.safeParse({
      ...body,
      image: file,
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

    const id = await this.eventsService.registerEvent(validation.data, owner);

    return {
      token: id,
    };
  }

  @Get()
  async fetch(
    @Query() query: FetchEventRatingsEventRequestDTO,
  ): Promise<FetchEventRatingsEventResponseDTO[]> {
    const validQuery = FetchEventRatingsEventRequestSchema.parse(query);

    return await this.eventsService.fetchEventRatings(validQuery.eventId);
  }

  @Post('subscribe')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(SubscribeToEventRequestSchema))
  async subscribeToEvent(
    @Request() req: AuthenticatedRequest,
    @Body() { eventId }: { eventId: string },
  ): Promise<SubscribeToEventResponseDTO> {
    const userId = Number(req.user.sub);

    const response = await this.eventsService.subscribeEvent(eventId, userId);

    return response;
  }

  @Patch(':eventId/deactivate')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(DeactivateEventParamSchema))
  async deactivateEvent(
    @Request() req: AuthenticatedRequest,
    @Param() params: DeactivateEventParamDTO, 
  ) {
    const userId = Number(req.user.sub);

    await this.eventsService.deactivateEvent(params.eventId, userId);

    return {
      success: true,
      message: 'Evento desativado com sucesso.',
    };
  }
}
