import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  OneToMany, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn 
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column('uuid')
  owner_id!: string;

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

  // Missing relation (OneToMany)
}