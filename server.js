var express = require("express");
var request = require("request");
var crypto = require("crypto");
var cors = require("cors");
const bodyParser = require("body-parser");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
const axios = require("axios");
// const fetch = require('node-fetch'); // Import the 'node-fetch' library
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
var app = express();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// Enable CORS for all routes
app.use(cors());

// Your other server setup and routes go here
// console.log("Welcome");
app.get("/download", async function (req, res) {
  // console.log("Received POST request for download:", req.query);
  //Pro gamers api
  const apiKey = "AIzaSyDBmT-r8hgSkQG5iAwus4sciPELF6JQ5SI"; // Replace with your actual YouTube API key

  const { playlistName, songName } = req.query;
  console.log("Records name: ", playlistName, songName);
  const query = songName;

  try {
    // Accessing YouTube API to find the URL of the song on YouTube
    const responseYouTube = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: 10,
          q: query,
          type: "video",
          key: apiKey,
        },
      }
    );

    // Extract the video ID from the first result
    const videoId = responseYouTube.data.items[0].id.videoId;

    // Construct the YouTube video link
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    console.log("YouTube Video Link:", videoLink);

    // Replace 'output.mp3' with the desired name for the output MP3 file
    // const outputFilePath = `./${playlistName}/${songName}.mp3`;
    
    const sanitizeFileName = (fileName) => {
      // Extract the part before the opening bracket and remove extra spaces
      const sanitizedName = fileName.split("(")[0].trim().replace(/\s+/g, ' ');
      // Replace invalid characters with underscores
      return sanitizedName.replace(/[<>:"/\\|?*]/g, "_");
    };
    
    // Replace 'output.mp3' with the desired name for the output MP3 file
    const outputFileName = sanitizeFileName(songName) + ".mp3";
    const outputFilePath = `Downloads/${playlistName}/${outputFileName}`;
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(`Downloads/${playlistName}`)) {
      fs.mkdirSync(`Downloads/${playlistName}`, { recursive: true });
    }
    

    // Download YouTube video
    const videoStream = ytdl(videoLink, {
      quality: "highestaudio",
    });

    // Convert video to MP3
    ffmpeg()
      .input(videoStream)
      .audioCodec("libmp3lame")
      .toFormat("mp3")
      .on("end", () => {
        console.log("Conversion finished!");
        // res.json({ success: true, message: "Download completed successfully" });
      })
      .on("error", (err) => {
        console.error("Error:", err);
        fs.unlinkSync(outputFilePath); // Delete the partially converted file
        // res.status(500).json({ success: false, message: "Download failed" });
      })
      .save(outputFilePath);
    // You can also listen for download progress
    // videoStream.on('progress', (chunkLength, downloaded, total) => {
    //   const percent = (downloaded / total) * 100;
    //   console.log(`Downloaded ${percent.toFixed(2)}%`);
    // });
  } catch (error) {
    console.error(
      "Error fetching YouTube data:",
      error.response ? error.response.data : error.message
    );
    // res.status(500).json({ success: false, message: "Download failed" });
  }
});

app.get("/download/wholePlaylist", async function (req, res) {
  // console.log("Received POST request for download:", req.query);
  //Pro gamers api
  const apiKey = "AIzaSyDBmT-r8hgSkQG5iAwus4sciPELF6JQ5SI"; // Replace with your actual YouTube API key

  const { playlistName, playlistId, access_token } = req.query;
  const playlist_id = playlistId;

  const apiUrlSongsTotal = `https://api.spotify.com/v1/playlists/${playlist_id}`;

  try {
    const responseNumberofSongs = await axios({
      method: "get",
      url: apiUrlSongsTotal,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    TotalSongs = responseNumberofSongs.data.tracks.total;
    console.log("Total songs: ", TotalSongs);
  } catch (error) {
    console.log(
      "Error while getting total number of songs in a playlist: ",
      error
    );
  }

  const apiUrl = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;

  try {
    const responseSpotify = await axios({
      method: "get",
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    for (var i = 0; i < TotalSongs; i++) {
      const songId = responseSpotify.data.items[i].track.id;
      const songName = responseSpotify.data.items[i].track.name;

      console.log("Response Data -> ", songId, songName);

      const query = songName;

      // accessing youtube api to find the url of the song on youtube
      try {
        const responseYouTube = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              maxResults: 10,
              q: query,
              type: "video",
              key: apiKey,
            },
          }
        );

        // Extract the video ID from the first result
        const videoId = responseYouTube.data.items[0].id.videoId;

        // Construct the YouTube video link
        const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
        console.log("YouTube Video Link:", videoLink);

        // Replace 'YOUR_YOUTUBE_VIDEO_URL' with the actual YouTube video URL
        const youtubeVideoUrl = videoLink;

        // Replace 'output.mp3' with the desired name for the output MP3 file
        // const outputFilePath = `Downloads/${playlistName}/${songName}.mp3`;

        const sanitizeFileName = (fileName) => {
          // Extract the part before the opening bracket and remove extra spaces
          const sanitizedName = fileName.split("(")[0].trim().replace(/\s+/g, ' ');
          // Replace invalid characters with underscores
          return sanitizedName.replace(/[<>:"/\\|?*]/g, "_");
        };
        
        // Replace 'output.mp3' with the desired name for the output MP3 file
        const outputFileName = sanitizeFileName(songName) + ".mp3";
        const outputFilePath = `Downloads/${playlistName}/${outputFileName}`;
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(`Downloads/${playlistName}`)) {
          fs.mkdirSync(`Downloads/${playlistName}`, { recursive: true });
        }

        // Download YouTube video
        const videoStream = ytdl(youtubeVideoUrl, {
          quality: "highestaudio",
        });

        // Convert video to MP3
        ffmpeg()
          .input(videoStream)
          .audioCodec("libmp3lame")
          .toFormat("mp3")
          .on("end", () => {
            console.log("Conversion finished!");
          })
          .on("error", (err) => {
            console.error("Error:", err);
          })
          .save(outputFilePath);

        // You can also listen for download progress
        // videoStream.on('progress', (chunkLength, downloaded, total) => {
        //   const percent = (downloaded / total) * 100;
        //   console.log(`Downloaded ${percent.toFixed(2)}%`);
        // });
      } catch (error) {
        console.error(
          "Error fetching YouTube data:",
          error.response ? error.response.data : error.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Error fetching Spotify data:",
      error.response ? error.response.data : error.message
    );
  }
});

puppeteer.use(StealthPlugin());
const {executablePath} = require('puppeteer');

app.get("/addUser", async function (req, res) {
  const { name, email, url } = req.query; // Retrieve parameters from req.query
  console.log(name, email, url);
  try {
    puppeteer.launch({ headless: false, executablePath: executablePath() }).then(async browser =>{
      console.log('Running tests..')
      const page = await browser.newPage()
    await page.goto(url)
    await page.setViewport({ width: 1080, height: 1024 })

    // Wait for the button with the specified class to load
    // await page.waitForSelector("button[class='Button-sc-1dqy6lx-0.joTmzL']")

    // Click on the button automatically
    // await page.click("button[class='Button-sc-1dqy6lx-0.joTmzL']")

    // await page.waitForSelector("input[name='name']")
    await page.type("#login-username",'u8991632@gmail.com')
    await page.type("#login-password",'Akt@_user_')
    // await page.focus("input[name='email']")
    // await page.keyboard.type(email)
    await page.click("#login-button")
    // await page.goto("https://developer.spotify.com/dashboard/9424d54fe5fb44b3b02c5b0790335fa3/users")
    // await page.click("button[class='sc-23e7fae3-1']")
    // await page.keyboard.press("Enter")
    // await page.waitForTimeout(5000)
    // await page.waitForNavigation({ waitUntil: "networkidle2" })
    await page.screenshot({ path: 'testresult.png', fullPage: true })
    // await browser.close()
    console.log(`All done, check the screenshot. ✨`)
    });
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
