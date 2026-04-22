import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Song } from './song.entity';
import { User } from './user.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  spotify_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'json', nullable: true })
  genres: string[];

  @Column({ type: 'int', default: 0 })
  popularity: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Song, (song) => song.artist)
  songs: Song[];

  @ManyToMany(() => User, (user) => user.followed_artists)
  followers: User[];
}
