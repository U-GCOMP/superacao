import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, LessThanOrEqual } from 'typeorm';
import { Event } from './entities/event.entity';
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

  async eventExists(eventId: string): Promise<boolean> {
    const count = await this.ormRepository.count({
      where: { id: eventId, deleted_at: IsNull() },
    });
    return count > 0;
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
      relations: [
        'owner',
        'ratings',
        'ratings.author',
        'volunteers',
        'volunteers.user',
      ],
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

  async getEventsByUserId(userId: number): Promise<Event[] | null> {
    const events = await this.ormRepository.find({
      where: {
        owner: { id: userId },
      },
    });

    return events.length > 0 ? events : null;
  }

  async decrementVolunteersCount(eventId: string): Promise<void> {
    await this.ormRepository.decrement({ id: eventId }, 'volunteers_count', 1);
  }

  async checkIfVolunteerParticipatedInCompletedEvent(
    organizerId: number,
    volunteerId: number,
  ): Promise<boolean> {
    const count = await this.ormRepository
      .createQueryBuilder('event')
      .innerJoin('event.owner', 'owner')
      .innerJoin('event.volunteers', 'eventVolunteer')
      .where('owner.id = :organizerId', { organizerId })
      .andWhere('event.status = :status', { status: 'COMPLETED' })
      .andWhere('eventVolunteer.user_id = :volunteerId', { volunteerId })
      .getCount();

    return count > 0;
  }

  async isUserParticipant(eventId: string, userId: number): Promise<boolean> {
    const count = await this.ormRepository
      .createQueryBuilder('event')
      .innerJoin('event.volunteers', 'volunteer')
      .where('event.id = :eventId', { eventId })
      .andWhere('volunteer.user_id = :userId', { userId })
      .getCount();

    return count > 0;
  }

  async getExpiredEvents(): Promise<Event[] | null> {
    const expiredEvents = await this.ormRepository.find({
      where: {
        status: 'SCHEDULED',
        volunteers_subscription_deadline_date: LessThanOrEqual(new Date()),
      },
    });

    return expiredEvents;
  }
}
