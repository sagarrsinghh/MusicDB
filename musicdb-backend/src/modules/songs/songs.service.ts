import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Song } from '../../database/entities/song.entity';
import { Artist } from '../../database/entities/artist.entity';
import { SpotifyService } from '../../spotify/spotify.service';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,

    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,

    private spotifyService: SpotifyService,
    private artistsService: ArtistsService,
  ) {}

  /* ===============================
        MEMORY CACHES
  =============================== */

  private searchCache = new Map<string, { data: Song[]; timestamp: number }>();
  private genreCache = new Map<string, { data: Song[]; timestamp: number }>();

  private readonly SEARCH_TTL = 5 * 60 * 1000; // 5 min
  private readonly GENRE_TTL = 60 * 60 * 1000; // 1 hour

  /* ===============================
        SEARCH SONG
  =============================== */

  async search(query: string): Promise<Song[]> {
    const key = query.toLowerCase().trim();

    // 1️⃣ Cache check
    const cached = this.searchCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.SEARCH_TTL) {
      this.logger.log(`Search cache hit: ${query}`);
      return cached.data;
    }

    // 2️⃣ Genre detection
    if (key.startsWith('genre:')) {
      const genre = key.split(':')[1]?.trim();
      if (genre) return this.findByGenre(genre);
    }

    // 3️⃣ Local DB first
    const localSongs = await this.songsRepository.find({
      where: { title: Like(`%${query}%`) },
      relations: ['artist'],
      take: 15,
    });

    // 4️⃣ If Spotify cooling down OR enough local results
    if (this.spotifyService.isCoolingDown() || localSongs.length >= 10) {
      this.searchCache.set(key, {
        data: localSongs,
        timestamp: Date.now(),
      });
      return localSongs;
    }

    // 5️⃣ Fetch from Spotify
    try {
      this.logger.log(`Fetching from Spotify: ${query}`);
      const spotifyTracks = await this.spotifyService.searchTracks(query, 20);

      const results: Song[] = [...localSongs];

      for (const track of spotifyTracks) {
        if (results.some((s) => s.spotify_id === track.id)) continue;

        const saved = await this.saveSpotifyTrack(track);
        if (saved) results.push(saved);
      }

      this.searchCache.set(key, {
        data: results,
        timestamp: Date.now(),
      });

      return results;
    } catch (error) {
      this.logger.error(`Spotify search failed: ${error.message}`);
      return localSongs;
    }
  }

  /* ===============================
        SAVE SPOTIFY TRACK
  =============================== */

  private async saveSpotifyTrack(track: any): Promise<Song | null> {
    try {
      // Prevent duplicate save
      const existing = await this.songsRepository.findOne({
        where: { spotify_id: track.id },
        relations: ['artist'],
      });

      if (existing) return existing;

      const artistData = track.artists[0];

      let artist = await this.artistsService.findOneBySpotifyId(artistData.id);

      // Create minimal artist (NO enrichment here)
      if (!artist) {
        // PROACTIVE: Fetch full artist to get image
        let imageUrl: string | undefined = undefined;
        try {
          const fullArtist = await this.spotifyService.getArtist(artistData.id);
          if (fullArtist && fullArtist.images?.[0]?.url) {
            imageUrl = fullArtist.images[0].url;
          }
        } catch (e) {}

        artist = await this.artistsService.create({
          spotify_id: artistData.id,
          name: artistData.name,
          image_url: imageUrl,
          genres: [],
          popularity: 50,
        });
      }

      const song = this.songsRepository.create({
        spotify_id: track.id,
        title: track.name,
        album_name: track.album.name,
        album_image: track.album.images?.[0]?.url,
        duration_ms: track.duration_ms,
        release_date: track.album.release_date,
        popularity: track.popularity,
        preview_url: track.preview_url,
        spotify_url: track.external_urls?.spotify,
        artist,
      });

      return await this.songsRepository.save(song);
    } catch (error) {
      this.logger.error('Failed to save track', error);
      return null;
    }
  }

  /* ===============================
        FIND BY GENRE
  =============================== */

  async findByGenre(genre: string): Promise<Song[]> {
    const key = genre.toLowerCase();

    // 1️⃣ Cache
    const cached = this.genreCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.GENRE_TTL) {
      return cached.data;
    }

    // 2️⃣ Local DB first
    const local = await this.songsRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.artist', 'artist')
      .where('artist.genres LIKE :genre', { genre: `%${genre}%` })
      .take(15)
      .getMany();

    if (local.length >= 5 || this.spotifyService.isCoolingDown()) {
      this.genreCache.set(key, {
        data: local,
        timestamp: Date.now(),
      });
      return local;
    }

    // 3️⃣ Spotify (single call only)
    try {
      this.logger.log(`Fetching genre from Spotify: ${genre}`);

      const spotifyTracks = await this.spotifyService.searchTracks(
        `genre:"${genre}"`,
        10,
      );

      const results: Song[] = [];

      for (const track of spotifyTracks) {
        const saved = await this.saveSpotifyTrack(track);
        if (saved) results.push(saved);
      }

      this.genreCache.set(key, {
        data: results,
        timestamp: Date.now(),
      });

      return results;
    } catch (error) {
      this.logger.error(`Genre fetch failed: ${error.message}`);

      this.genreCache.set(key, {
        data: local,
        timestamp: Date.now(),
      });

      return local;
    }
  }

  /* ===============================
        OTHER METHODS
  =============================== */

  async findOne(id: number): Promise<Song | null> {
    const song = await this.songsRepository.findOne({
      where: { id },
      relations: ['artist', 'reviews', 'reviews.user', 'ratings'],
    });

    // Proactive Repair: If preview_url is missing, try to fetch it from Spotify
    if (song && !song.preview_url && !this.spotifyService.isCoolingDown()) {
      try {
        this.logger.log(
          `Attempting to repair missing preview_url for song: ${song.title}`,
        );
        const spotifyTrack = await this.spotifyService.getTrack(
          song.spotify_id,
        );
        if (spotifyTrack && spotifyTrack.preview_url) {
          song.preview_url = spotifyTrack.preview_url;
          await this.songsRepository.save(song);
          this.logger.log(
            `Successfully repaired preview_url for: ${song.title}`,
          );
        }
      } catch (error) {
        this.logger.error(`Failed to repair preview_url: ${error.message}`);
      }
    }

    return song;
  }

  async findAll(): Promise<Song[]> {
    return this.songsRepository.find({
      relations: ['artist'],
      order: { created_at: 'DESC' },
    });
  }

  async findAllTopRated(): Promise<Song[]> {
    return this.songsRepository.find({
      order: { average_rating: 'DESC' },
      take: 10,
      relations: ['artist'],
    });
  }

  async getTop50(): Promise<Song[]> {
    return this.songsRepository.find({
      order: { average_rating: 'DESC', rating_count: 'DESC' },
      take: 50,
      relations: ['artist'],
    });
  }

  async getTrending(): Promise<Song[]> {
    const songs = await this.songsRepository.find({
      relations: ['artist', 'reviews', 'ratings'],
    });

    return songs
      .map((song) => {
        const reviewCount = song.reviews?.length || 0;
        const ratingCount = song.rating_count || 0;
        const avg = Number(song.average_rating) || 0;

        const score = avg * 10 + reviewCount * 5 + ratingCount * 2;
        return { ...song, trendingScore: score };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);
  }

  async findPlayable(): Promise<Song[]> {
    return this.songsRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.artist', 'artist')
      .where('song.preview_url IS NOT NULL')
      .andWhere('song.preview_url != :empty', { empty: '' })
      .getMany();
  }
}
