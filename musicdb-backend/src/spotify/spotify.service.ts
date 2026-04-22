import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'querystring';

@Injectable()
export class SpotifyService {
  private readonly authUrl = 'https://accounts.spotify.com/api/token';
  private readonly baseUrl = 'https://api.spotify.com/v1';
  private accessToken: string;
  private tokenExpiresAt: number;

  // Global Stability Controls
  private static requestMutex: Promise<void> = Promise.resolve();
  private static cooldownUntil: number = 0;

  private async acquireLock(): Promise<() => void> {
    let release: () => void;
    const wait = new Promise<void>((resolve) => {
      release = resolve;
    });
    const current = SpotifyService.requestMutex;
    SpotifyService.requestMutex = current.then(() => wait);
    await current;
    return release!;
  }

  private checkCooldown() {
    if (Date.now() < SpotifyService.cooldownUntil) {
      console.warn(
        `[Spotify Service] API Cooldown active until ${new Date(
          SpotifyService.cooldownUntil,
        ).toLocaleTimeString()}`,
      );
      return true;
    }
    return false;
  }

  private triggerCooldown(seconds: number = 30) {
    const safeSeconds = Math.min(seconds, 300);
    SpotifyService.cooldownUntil = Date.now() + safeSeconds * 1000;
    console.error(
      `[Spotify Service] Triggering ${safeSeconds}s cooldown (Requested: ${seconds}s) due to rate limits.`,
    );
  }

  public isCoolingDown(): boolean {
    return Date.now() < SpotifyService.cooldownUntil;
  }

  private async getAccessToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        this.authUrl,
        qs.stringify({ grant_type: 'client_credentials' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
              'Basic ' +
              Buffer.from(
                process.env.SPOTIFY_CLIENT_ID +
                  ':' +
                  process.env.SPOTIFY_CLIENT_SECRET,
              ).toString('base64'),
          },
          timeout: 5000,
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

      return this.accessToken;
    } catch (error) {
      console.error(
        'Failed to authenticate with Spotify:',
        error.response?.data || error.message,
      );
      return null;
    }
  }

  async searchArtists(query: string, limit: number = 5) {
    if (this.checkCooldown()) return [];
    const release = await this.acquireLock();
    try {
      const token = await this.getAccessToken();
      if (!token) return [];
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: { q: query, type: 'artist', limit: limit },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      return response.data.artists.items;
    } catch (error) {
      if (error.response?.status === 429) this.triggerCooldown(60);
      console.error(
        `Spotify Artist Search Failed for "${query}":`,
        error.message,
      );
      return [];
    } finally {
      await new Promise((r) => setTimeout(r, 100));
      release();
    }
  }

  async searchTracks(query: string, limit: number = 10) {
    if (this.checkCooldown()) return [];

    const release = await this.acquireLock();

    try {
      const token = await this.getAccessToken();
      if (!token) return [];

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: { q: query, type: 'track', limit: limit, market: 'US' }, // Added market for previews
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      return response.data.tracks.items;
    } catch (error) {
      if (error.response?.status === 429) {
        this.triggerCooldown(
          parseInt(error.response.headers['retry-after']) || 60,
        );
      }

      const errorData = error.response?.data || error.message;
      console.error(
        `Spotify Search Failed for "${query}":`,
        JSON.stringify(errorData),
      );
      return [];
    } finally {
      await new Promise((r) => setTimeout(r, 100));
      release();
    }
  }

  async getTrack(id: string) {
    if (this.checkCooldown()) return null;

    const release = await this.acquireLock();

    try {
      const token = await this.getAccessToken();
      if (!token) return null;

      const response = await axios.get(`${this.baseUrl}/tracks/${id}`, {
        params: { market: 'US' },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        this.triggerCooldown(60);
      }

      console.error(
        'Spotify Get Track Failed:',
        error.response?.data || error.message,
      );
      return null;
    } finally {
      await new Promise((r) => setTimeout(r, 100));
      release();
    }
  }

  async getArtist(id: string) {
    if (this.checkCooldown()) return null;

    const release = await this.acquireLock();

    try {
      const token = await this.getAccessToken();
      if (!token) return null;

      const response = await axios.get(`${this.baseUrl}/artists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        this.triggerCooldown(60);
      }

      console.error(
        'Spotify Get Artist Failed:',
        JSON.stringify(error.response?.data || error.message),
      );
      return null;
    } finally {
      await new Promise((r) => setTimeout(r, 100));
      release();
    }
  }

  async getRelatedArtists(id: string) {
    if (this.checkCooldown()) return [];
    const release = await this.acquireLock();
    try {
      const token = await this.getAccessToken();
      if (!token) return [];
      const response = await axios.get(
        `${this.baseUrl}/artists/${id}/related-artists`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        },
      );
      return response.data.artists;
    } catch (error) {
      if (error.response?.status === 429) this.triggerCooldown(60);
      console.error('Spotify Related Artists Failed:', error.message);
      return [];
    } finally {
      await new Promise((r) => setTimeout(r, 100));
      release();
    }
  }

  async getArtistAlbums(id: string) {
    if (this.isCoolingDown()) return [];
    const release = await this.acquireLock();
    try {
      const token = await this.getAccessToken();
      if (!token) return [];
      const response = await axios.get(`${this.baseUrl}/artists/${id}/albums`, {
        params: { include_groups: 'album,single', limit: 12 },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      return response.data.items;
    } catch (error) {
      if (error.response?.status === 429) this.triggerCooldown(60);
      console.error('Spotify Artist Albums Failed:', error.message);
      return [];
    } finally {
      await new Promise((r) => setTimeout(r, 100));
      release();
    }
  }

  async getArtistTopTracks(id: string) {
    if (this.isCoolingDown()) return [];
    const release = await this.acquireLock();
    try {
      const token = await this.getAccessToken();
      if (!token) return [];
      const response = await axios.get(
        `${this.baseUrl}/artists/${id}/top-tracks`,
        {
          params: { market: 'US' },
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        },
      );
      return response.data.tracks;
    } catch (error) {
      if (error.response?.status === 429) this.triggerCooldown(60);
      console.error('Spotify Artist Top Tracks Failed:', error.message);
      return [];
    } finally {
      await new Promise((r) => setTimeout(r, 100));
      release();
    }
  }

  async getArtists(ids: string[]) {
    if (this.isCoolingDown() || !ids.length) return [];
    const release = await this.acquireLock();
    try {
      const token = await this.getAccessToken();
      if (!token) return [];
      const response = await axios.get(`${this.baseUrl}/artists`, {
        params: { ids: ids.join(',') },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      return response.data.artists;
    } catch (error) {
      if (error.response?.status === 429) this.triggerCooldown(60);
      console.error('Spotify Batch Artists Failed:', error.message);
      return [];
    } finally {
      await new Promise((r) => setTimeout(r, 100));
      release();
    }
  }
}
