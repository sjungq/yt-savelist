//EXTERNAL IMPORTS
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const axios = require("axios");
require("dotenv").config();

//INTERNAL IMPORTS
const YTApi = require("./yt-api");
const { returnBackupFile } = require("./public/scripts/backup");

const api = new YTApi();
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const playlistId = "PLYY39e2HWVnNHb58Z8zE8oSZsHC1uH5fI";

//ROUTES
app.get("/backup", (req, res) => {
  res.render("backup/search");
});

app.post("/backup", async (req, res) => {
  //req.body.playlistUrl
  //parse this out - recognize if it is a full Youtube link or just the ID
  //for now, always submit full YT link

  try {
    const { playlistId, playlistName } = await api.returnPlaylistId(
      req.body.playlistUrl
    );
    res.redirect(`playlist/${playlistId}/?playlistName=${playlistName}`);
  } catch (e) {
    //Display error -- shouldn't redirect
    console.log(e);
    res.redirect("backup");
  }
});

app.get("/playlist", async (req, res) => {
  try {
    const playlistData = await api.getPlaylistItems(playlistId);
    res.render("playlist", { playlistData });
  } catch (e) {
    console.log(e);
  }
});

app.get("/playlist/:playlistId", async (req, res) => {
  let playlistName = "";
  try {
    if (req.query.playlistName) {
      playlistName = req.query.playlistName;
    }
    const playlistData = await api.getPlaylistItems(req.params.playlistId);
    res.render("backup/playlist", { playlistData, playlistName });
  } catch (e) {
    console.log(e);
  }
});

app.post("/playlist/:playlistId", async (req, res) => {
  try {
    const playlistData = await api.getPlaylistItems(req.params.playlistId);
    let responseFile;
    let cleanedData = returnBackupFile(playlistData, req.body.fileType);
    if (req.body.fileType === "TXT") {
      res.setHeader("Content-Type", "text/plain");
    } else if (req.body.fileType === "JSON") {
      res.setHeader("Content-Type", "application/json");
    }
    res.send(cleanedData);
  } catch (e) {
    console.log(e);
    res.send("Error");
  }
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
