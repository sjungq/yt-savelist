const axios = require("axios");
require("dotenv").config();

class YTApi {
  constructor() {
    this.baseUrl = "https://youtube.googleapis.com/youtube/v3";
    this.key = process.env.YT_KEY;
    this.base_config = {
      params: {
        key: this.key,
      },
    };
  }

  async makeApiRequest(path, config) {
    const response = await axios.get(`${this.baseUrl}${path}`, config);
    return response.data;
  }

  async getPlaylistItems(playlistId, maxResults = 50) {
    const path = "/playlistItems";
    const playlistItems = [];
    const config = {
      ...this.base_config,
      params: {
        ...this.base_config.params,
        part: "id,snippet",
        playlistId: playlistId,
        maxResults: maxResults,
      },
    };
    try {
      const response = await this.makeApiRequest(path, config);
      playlistItems.push(...response["items"]);
      try {
        let nextPageToken = response["nextPageToken"];
        while (nextPageToken) {
          const newReq = await this.makeApiRequest(path, {
            ...config,
            params: {
              ...config.params,
              pageToken: nextPageToken,
            },
          });
          playlistItems.push(...newReq["items"]);
          try {
            nextPageToken = newReq["nextPageToken"];
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {}

      return {
        data: { ...response, items: 0 },
        playlistItems: playlistItems,
      };
    } catch (e) {
      //console.log(e);
    }
  }
}

module.exports = YTApi;
