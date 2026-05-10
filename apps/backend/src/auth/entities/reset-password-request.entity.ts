import { Users } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('password_reset_requests')
export class PasswordResetRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Users, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: Users;

  @Column({ length: 6 })
  code!: string;

  @Column({
    type: 'timestamp',
  })
  expires_at!: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  used_at!: Date | null;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at!: Date;
}
