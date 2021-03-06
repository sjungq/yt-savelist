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

//ROUTES

app.get("/backup", (req, res) => {
  res.render("backup/search");
});

app.post("/backup", async (req, res) => {
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

app.listen(process.env.PORT, () => {
  console.log(`Serving on port ${process.env.PORT}`);
});
