import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Song } from './song.entity';

@Entity()
@Unique(['user', 'song'])
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  value: number; // 1-5

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Song, (song) => song.ratings)
  song: Song;
}
