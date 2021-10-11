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
        part: "id,snippet,contentDetails",
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

  async returnPlaylistId(link) {
    //will check and return playlist ID from URL string, or just return if valid playlist ID
    //probably a bad idea to do multiple things but figure that out later
    const path = "/playlists";
    const urlSearchParams = new URLSearchParams(link);
    const params = urlSearchParams.get("https://www.youtube.com/playlist?list");
    let testLink = link;
    if (params) {
      testLink = params;
    }

    try {
      const config = {
        ...this.base_config,
        params: {
          ...this.base_config.params,
          part: "snippet",
          id: testLink,
          maxResults: 1,
        },
      };
      const response = await this.makeApiRequest(path, config);

      if (response.items.length != 0) {
        return {
          playlistId: testLink,
          playlistName: response.items[0].snippet.title,
        };
      } else {
        throw "Invalid Youtube Link";
      }
    } catch (e) {
      console.log(testLink);
      throw "Invalid Youtube Link";
      //handle this in express
      //console.log(e);
    }
  }
}

module.exports = YTApi;
