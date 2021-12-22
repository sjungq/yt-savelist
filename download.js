/* Quick script for downloading Youtube links as MP3 files; possibly later integrate
  into Savelist
 */

const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
//let url = `https://www.youtube.com/watch?v=UXuBk5rvrBc`;
let url = `https://www.youtube.com/watch?v=1cJPrcGmUFY`;
let title = `hydaelyn`;
const download = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });

//const writeStream = fs.createWriteStream('ew.mp3');
//download.pipe(writeStream);

ffmpeg(download).audioBitrate('128k').save(`${title}.mp3`);
