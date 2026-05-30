import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

import { UserRatings } from '../../user/entities/user-ratings.entity';
import { Event } from '../../event/entities/event.entity';
import { EventVolunteers } from '../../event/entities/event-volunteers.entity';
import { EventRatings } from '../../event/entities/event-rating.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  bio?: string;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  @Column({ type: 'real', default: 0 })
  rating_sum!: number;

  @Column({ default: 0 })
  rating_count!: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @OneToMany(() => Event, (event) => event.owner)
  events_organized!: Event[];

  @OneToMany(() => EventVolunteers, (volunteer) => volunteer.user)
  events_participated!: EventVolunteers[];

  @OneToMany(() => EventRatings, (rating) => rating.author)
  event_ratings_authored!: EventRatings[];

  @OneToMany(() => UserRatings, (rating) => rating.author)
  ratings_authored!: UserRatings[];

  @OneToMany(() => UserRatings, (rating) => rating.target)
  ratings_received!: UserRatings[];
}
