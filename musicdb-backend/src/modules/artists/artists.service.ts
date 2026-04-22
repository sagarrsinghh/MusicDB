import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../../database/entities/artist.entity';
import { SpotifyService } from '../../spotify/spotify.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    private spotifyService: SpotifyService,
  ) {}

  async findOneBySpotifyId(spotifyId: string): Promise<Artist | null> {
    return this.artistsRepository.findOne({
      where: { spotify_id: spotifyId },
      relations: ['songs'],
    });
  }

  async findOne(id: number): Promise<Artist | null> {
    return this.artistsRepository.findOne({
      where: { id },
      relations: ['songs'],
    });
  }

  async findAll(): Promise<Artist[]> {
    const artists = await this.artistsRepository.find({
      order: { popularity: 'DESC', name: 'ASC' },
    });

    // Trigger background repair for missing/broken data
    this.repairArtists(artists).catch((err) => {
      console.error('[ArtistsService] Background repair failed:', err.message);
    });

    return artists;
  }

  private async repairArtists(artists: Artist[]) {
    // Selection criteria: missing photo OR obviously broken/fake Spotify ID
    const broken = artists
      .filter(
        (a) =>
          !a.image_url ||
          a.image_url.trim() === '' ||
          a.spotify_id.length < 15 ||
          a.spotify_id.includes('...') ||
          a.spotify_id.includes('99S96'), // Catch those repetitive fake IDs
      )
      .slice(0, 10);

    if (broken.length === 0) return;

    console.log(
      `[ArtistsService] Repairing ${broken.length} artists: ${broken.map((a) => a.name).join(', ')}`,
    );

    for (const artist of broken) {
      try {
        console.log(`[ArtistsService] Searching Spotify for: ${artist.name}`);
        const searchResults = await this.spotifyService.searchArtists(
          artist.name,
          1,
        );

        if (searchResults && searchResults.length > 0) {
          const sa = searchResults[0];
          const updateData: any = {
            spotify_id: sa.id,
            genres: sa.genres,
            popularity: sa.popularity,
          };

          if (sa.images?.[0]?.url) {
            updateData.image_url = sa.images[0].url;
          }

          await this.artistsRepository.update(artist.id, updateData);
          console.log(
            `[ArtistsService] Successfully repaired ${artist.name} (New ID: ${sa.id})`,
          );
        } else {
          console.warn(
            `[ArtistsService] No Spotify results found for ${artist.name}`,
          );
        }

        // Small delay to be nice to Spotify
        await new Promise((r) => setTimeout(r, 200));
      } catch (error) {
        console.error(
          `[ArtistsService] Failed to repair ${artist.name}:`,
          error.message,
        );
      }
    }
  }

  async getFullProfile(idOrSpotifyId: string | number) {
    let artist: Artist | null;
    if (typeof idOrSpotifyId === 'number' || !isNaN(Number(idOrSpotifyId))) {
      artist = await this.findOne(+idOrSpotifyId);
    } else {
      artist = await this.findOneBySpotifyId(idOrSpotifyId);
    }

    if (!artist) return null;

    // Fetch additional data from Spotify to make the page "alive"
    const [related, albums, topTracks, fullArtist] = await Promise.all([
      this.spotifyService.getRelatedArtists(artist.spotify_id),
      this.spotifyService.getArtistAlbums(artist.spotify_id),
      this.spotifyService.getArtistTopTracks(artist.spotify_id),
      this.spotifyService.getArtist(artist.spotify_id),
    ]);

    // Proactive: Update artist image if missing or invalid
    const needsImageUpdate =
      !artist.image_url || artist.image_url.trim() === '';
    if (fullArtist && fullArtist.images?.[0]?.url && needsImageUpdate) {
      artist.image_url = fullArtist.images[0].url;
      await this.artistsRepository.update(artist.id, {
        image_url: artist.image_url,
      });
    }

    // Map Spotify top tracks to a consistent format for the frontend
    const spotifySongs =
      topTracks?.map((track) => ({
        id: `spotify-${track.id}`, // Temporary ID for frontend
        title: track.name,
        album_name: track.album.name,
        album_image: track.album.images?.[0]?.url,
        duration_ms: track.duration_ms,
        release_date: track.album.release_date,
        popularity: track.popularity,
        preview_url: track.preview_url,
        spotify_url: track.external_urls?.spotify,
        is_spotify_only: true,
      })) || [];

    // Merge local songs with spotify songs, avoiding duplicates based on titles (simple heuristic)
    const localSongs = artist.songs || [];
    const filteredSpotifySongs = spotifySongs.filter(
      (s) =>
        !localSongs.some(
          (ls) => ls.title.toLowerCase() === s.title.toLowerCase(),
        ),
    );

    return {
      ...artist,
      relatedArtists: related,
      albums: albums,
      songs: [...localSongs, ...filteredSpotifySongs].slice(0, 200), // Limit to 200
    };
  }

  async create(artistData: Partial<Artist>): Promise<Artist> {
    const newArtist = this.artistsRepository.create(artistData);
    return this.artistsRepository.save(newArtist);
  }
}
