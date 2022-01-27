import { AxiosInstance } from 'axios';
import { createAxiosClient } from '../axios'

export class useTwitter {
  axios: AxiosInstance;
  constructor() {
    this.axios = createAxiosClient();
  }
  async getUserTimeLine(payload: { userName: string; maxId: string | undefined }) {
    const { data } = await this.axios.get(
      "/api/proxy/1.1/statuses/user_timeline.json",
      {
        params: {
          screen_name: payload.userName,
          exclude_replies: true,
          include_rts: false,
          trim_user: true,
          max_id: payload.maxId,
          count: 200,
        },
      }
    );
    return data
  }

  async seachUserTweets(payload: { userName: string }) {
    return this.axios.get("/api/proxy/1.1/search/tweets.json", {
      params: {
        q: `from:${payload.userName}`,
        count: 100,
      },
    });
  }
}