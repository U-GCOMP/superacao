import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity'; // Ajuste o path conforme seu projeto
import { FetchEventListQueryParametersDTO } from '@project/shared';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly ormRepository: Repository<Event>,
  ) {}

  async findEvents(params: FetchEventListQueryParametersDTO): Promise<Event[]> {
    const {
      page = 1,
      pageSize = 10,
      search,
      date,
      isDescending = false,
    } = params;

    const query = this.ormRepository.createQueryBuilder('event');

    if (search) {
      query.andWhere(
        '(event.title ILIKE :search OR event.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (date) {
      query.andWhere('DATE(event.date) = DATE(:date)', { date });
    }

    query.orderBy('event.date', isDescending ? 'DESC' : 'ASC');

    const skip = (page - 1) * pageSize;
    query.skip(skip).take(pageSize);

    return query.getMany();
  }

  async findEventByIdWithOrganizerData(eventId: string): Promise<Event | null> {
    return this.ormRepository.findOne({
      where: { id: eventId },
      relations: ['owner'],
    });
  }
}
