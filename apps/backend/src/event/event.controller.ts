import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { EventService } from './event.service';
import { FetchEventQueryParametersSchema } from '@project/shared'

@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Get()
  async fetchEvents(@Query() rawQuery: any) {
    const validation = FetchEventQueryParametersSchema.safeParse(rawQuery);

    if (!validation.success) {
      throw new BadRequestException(validation.error.format());
    }

    return this.eventsService.fetchEvents(validation.data);
  }
}