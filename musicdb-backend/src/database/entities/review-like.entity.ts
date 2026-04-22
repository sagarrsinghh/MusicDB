import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Review } from './review.entity';

@Entity()
@Unique(['user', 'review'])
export class ReviewLike {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Review)
  review: Review;
}
