import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../event/entities/event.entity';

@Entity('event_ratings')
export class EventRatings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  event_id!: string;

  @Column()
  author_id!: string;

  @Column()
  category_id!: number;

  @Column()
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
