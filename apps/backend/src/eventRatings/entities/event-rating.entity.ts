import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class EventRatings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  event_id!: number;

  @Column()
  author_id!: string;

  @Column()
  category_id!: number;

  @Column()
  rating!: number;

  @Column()
  comment?: string;
}
