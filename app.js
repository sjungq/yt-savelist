//EXTERNAL IMPORTS
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const axios = require("axios");
require("dotenv").config();

//INTERNAL IMPORTS
const YTApi = require("./yt-api");

const api = new YTApi();
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

const playlistId = "PLYY39e2HWVnNHb58Z8zE8oSZsHC1uH5fI";

//ROUTES
app.get("/playlist", async (req, res) => {
  try {
    const playlistData = await api.getPlaylistItems(playlistId);
    res.render("index", { playlistData });
  } catch (e) {
    console.log(e);
  }
});

app.get("/playlist/:playlistId", async (req, res) => {
  try {
    const playlistData = await api.getPlaylistItems(req.params.playlistId);
    res.render("index", { playlistData });
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
