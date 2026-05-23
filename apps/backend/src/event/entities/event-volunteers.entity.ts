import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Users } from '../../auth/entities/user.entity';
import { Event } from '../../event/entities/event.entity';

@Entity()
export class EventVolunteers {
  @PrimaryColumn('uuid')
  event_id!: string;

  @PrimaryColumn('int')
  user_id!: number;

  @ManyToOne(() => Event, (event) => event.volunteers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @ManyToOne(() => Users, (user) => user.events_participated, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: Users;
}
