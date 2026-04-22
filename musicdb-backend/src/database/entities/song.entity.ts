import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import type { Review } from './review.entity';
import type { Rating } from './rating.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  spotify_id: string;

  @Column()
  title: string;

  @Column()
  album_name: string;

  @Column({ nullable: true })
  album_image: string;

  @Column({ nullable: true })
  preview_url: string;

  @Column({ nullable: true })
  spotify_url: string;

  @Column({ type: 'int' })
  duration_ms: number;

  @Column()
  release_date: string;

  @Column({ type: 'int', default: 0 })
  popularity: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  average_rating: number;

  @Column({ type: 'int', default: 0 })
  rating_count: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Artist, (artist) => artist.songs)
  artist: Artist;

  @OneToMany('Review', (review: any) => review.song)
  reviews: Review[];

  @OneToMany('Rating', (rating: any) => rating.song)
  ratings: Rating[];
}
