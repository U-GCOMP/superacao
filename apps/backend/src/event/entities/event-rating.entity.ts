import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Users } from '../../auth/entities/user.entity';

@Entity('event_ratings')
export class EventRatings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  event_id!: string;

  @Column()
  author_id!: number;

  @ManyToOne(() => Users, (user) => user.event_ratings_authored, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'id',
  })
  author!: Users;

  @Column()
  category_id!: number;

  @Column({ type: 'real' })
  rating!: number;

  @Column({ nullable: true })
  comment?: string;

  @ManyToOne(() => Event, (event) => event.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'event_id',
    referencedColumnName: 'id',
  })
  event!: Event;
}
