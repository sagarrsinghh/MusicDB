import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Favorite } from './favorite.entity';
// import { Rating } from './rating.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'longtext', nullable: true })
  profile_image: string;

  @Column({ default: false })
  favorites_is_public: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @ManyToMany(() => Artist, (artist) => artist.followers)
  @JoinTable({
    name: 'user_follows_artist',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'artist_id', referencedColumnName: 'id' },
  })
  followed_artists: Artist[];
}
