import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Users } from '../../auth/entities/user.entity';

@Entity()
export class UserRatings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  target_id!: number;

  @Column()
  author_id!: number;

  @Column({ nullable: false, type: 'real' })
  rating!: number;

  @Column({ nullable: true })
  comment?: string;

  @ManyToOne(() => Users, (user) => user.ratings_authored, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'id',
  })
  author!: Users;

  @ManyToOne(() => Users, (user) => user.ratings_received, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'target_id',
    referencedColumnName: 'id',
  })
  target!: Users;
}
