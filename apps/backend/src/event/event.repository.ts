import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity'; // Ajuste o path conforme seu projeto
import {
  FetchEventListQueryParametersDTO,
  RegisterEventRequestDTO,
} from '@project/shared';
import { Users } from '../auth/entities/user.entity';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly ormRepository: Repository<Event>,
  ) {}

  async registerEvent(
    params: RegisterEventRequestDTO,
    owner: Users,
    imageUrl: string,
  ): Promise<Event> {
    const date = new Date(params.startDate);
    const [hours, minutes] = params.startTime.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);

    // TODO: Evaluate whether 'place' should become a dedicated entity attribute
    const event = this.ormRepository.create({
      owner: owner,
      title: params.title,
      description: params.description,
      place: params.place,
      volunteers_max: params.maxSlots,
      date: date,
      volunteers_subscription_deadline_date: params.endDate,
      imageUrl: imageUrl,
    });
    const saved = await this.ormRepository.save(event);

    return saved;
  }

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
      relations: ['owner', 'ratings', 'ratings.author'],
    });
  }

  async getEventById(eventId: string): Promise<Event | null> {
    const event = this.ormRepository.findOne({
      where: { id: eventId },
    });
    return event;
  }

  async getEventByIdWithOwnerInfo(eventId: string): Promise<Event | null> {
    const event = await this.ormRepository.findOne({
      where: { id: eventId },
      relations: ['owner'],
    });

    return event;
  }

  async saveEvent(eventData: Partial<Event>): Promise<Event> {
    const event = this.ormRepository.create(eventData);
    return this.ormRepository.save(event);
  }
}
