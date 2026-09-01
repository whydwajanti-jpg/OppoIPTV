import type { Provider, Channel, VodItem, Series, Program } from '@types/index';
import { networkService } from './networkService';

interface XtreamLiveCategory {
  category_id: string;
  category_name: string;
}

interface XtreamStream {
  num: number;
  name: string;
  stream_icon: string;
  stream_id: string;
  epg_channel_id: string;
}

interface XtreamVodCategory {
  category_id: string;
  category_name: string;
}

interface XtreamVodStream {
  name: string;
  stream_id: string;
  stream_icon: string;
  rating: string;
  year: number;
  duration: string;
}

export class ProviderService {
  async validateXtreamProvider(
    baseUrl: string,
    username: string,
    password: string
  ): Promise<boolean> {
    try {
      const response = await networkService.get(
        `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_categories`
      );
      return Array.isArray(response);
    } catch (error) {
      return false;
    }
  }

  async getXtreamLiveCategories(
    baseUrl: string,
    username: string,
    password: string
  ): Promise<XtreamLiveCategory[]> {
    return networkService.get(
      `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_categories`
    );
  }

  async getXtreamLiveStreams(
    baseUrl: string,
    username: string,
    password: string,
    categoryId: string
  ): Promise<XtreamStream[]> {
    return networkService.get(
      `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_streams&category_id=${categoryId}`
    );
  }

  async getXtreamVodCategories(
    baseUrl: string,
    username: string,
    password: string
  ): Promise<XtreamVodCategory[]> {
    return networkService.get(
      `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_vod_categories`
    );
  }

  async getXtreamVodStreams(
    baseUrl: string,
    username: string,
    password: string,
    categoryId: string
  ): Promise<XtreamVodStream[]> {
    return networkService.get(
      `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_vod_streams&category_id=${categoryId}`
    );
  }

  async getXtreamPlaybackUrl(
    baseUrl: string,
    username: string,
    password: string,
    streamId: string
  ): Promise<string> {
    return `${baseUrl}/movie/${username}/${password}/${streamId}.mkv`;
  }

  parseM3UPlaylist(content: string): Channel[] {
    const lines = content.split('\n');
    const channels: Channel[] = [];
    let currentChannel: Partial<Channel> | null = null;

    for (const line of lines) {
      if (line.startsWith('#EXTINF:')) {
        const nameMatch = line.match(/,(.+)$/);
        const logoMatch = line.match(/tvg-logo="([^"]*)/)
        const groupMatch = line.match(/group-title="([^"]*)/)
        const epgMatch = line.match(/tvg-id="([^"]*)/)
        
        currentChannel = {
          id: Math.random().toString(36).substr(2, 9),
          name: nameMatch ? nameMatch[1] : 'Unknown',
          logo: logoMatch ? logoMatch[1] : undefined,
          group: groupMatch ? groupMatch[1] : undefined,
          epgId: epgMatch ? epgMatch[1] : undefined,
          isFavorite: false,
        };
      } else if (line.trim() && currentChannel && !line.startsWith('#')) {
        currentChannel.streamUrl = line.trim();
        channels.push(currentChannel as Channel);
        currentChannel = null;
      }
    }

    return channels;
  }

  async fetchM3UPlaylist(url: string): Promise<Channel[]> {
    try {
      const content = await networkService.get<string>(url);
      return this.parseM3UPlaylist(content);
    } catch (error) {
      console.error('Failed to fetch M3U playlist:', error);
      return [];
    }
  }
}

export const providerService = new ProviderService();
