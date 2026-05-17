import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../../auth/entities/user.entity';

import { EventRatings } from '../../eventRatings/entities/event-rating.entity';

const EventStatus = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @ManyToOne(() => Users, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  owner!: Users;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.SCHEDULED })
  status!: EventStatus;

  @Column({ type: 'timestamp' })
  volunteers_subscription_deadline_date!: Date;

  @Column({ type: 'int', default: 0 })
  volunteers_max!: number;

  @Column({ type: 'int', default: 0 })
  volunteers_count!: number;

  @Column({ type: 'int', default: 0 })
  rating_sum!: number;

  @Column({ type: 'int', default: 0 })
  rating_count!: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToMany(() => EventRatings, (rating) => rating.event)
  ratings!: EventRatings[];
}
