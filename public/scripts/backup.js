function parseTxtItem(item) {
  let returnStr = `Title: ${item.snippet.title}
Uploader: ${item.snippet.videoOwnerChannelTitle}
Added: ${item.snippet.publishedAt}
Published: ${item.contentDetails.videoPublishedAt}
Video ID: ${item.contentDetails.videoId}
Index: ${item.snippet.position}
`;
  return returnStr;
}

module.exports = {
  returnBackupFile: function (data, format) {
    finalFile = "";
    if (format === "TXT") {
      let playlistItems = data.playlistItems.map((item) => parseTxtItem(item));
      finalFile = playlistItems.join("\r\n");
    } else if (format === "JSON") {
      finalFile = JSON.stringify(data);
    }

    return finalFile;
  },
};
