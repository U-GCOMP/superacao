import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { EventService } from './event.service';
import {
  FetchEventListQueryParametersDTO,
  FetchEventListQueryParametersSchema,
} from '@project/shared';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import {
  FetchEventDetailsRequestDTO,
  FetchEventDetailsRequestSchema,
} from '@project/shared/src/dtos/event/fetch-event-details.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

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
}
