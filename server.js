/********************************************************************************
*  WEB700 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  Name: Zeinab Mohamed      Student ID: 123970246      Date: 6th July 2025
*
*  Published URL: https://your-deployed-vercel-url.vercel.app
*
********************************************************************************/

const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render("addSet", { themes });
  } catch {
    res.status(500).send("Error loading themes");
  }
});

app.post("/lego/addSet", async (req, res) => {
  try {
    const foundTheme = await legoData.getThemeById(req.body.theme_id);
    req.body.theme = foundTheme.name;
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/lego/sets", async (req, res) => {
  try {
    const sets = await legoData.getAllSets();
    res.render("sets", { sets });
  } catch {
    res.status(500).send("Error loading Lego sets");
  }
});

app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.set_num);
    res.render("set", { set });
  } catch {
    res.status(404).render("404", { page: "" });
  }
});

app.get("/lego/deleteSet/:set_num", async (req, res) => {
  try {
    await legoData.deleteSetByNum(req.params.set_num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/lego/add-test", (req, res) => {
  const testSet = {
    set_num: "123",
    name: "testSet name",
    year: "2024",
    theme_id: "366",
    num_parts: "123",
    img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
  };

  legoData.addSet(testSet)
    .then(() => res.redirect("/lego/sets"))
    .catch(err => res.status(422).send(err));
});

app.use((req, res) => {
  res.status(404).render("404", { page: "" });
});

// Initialize data before handling requests
let isInitialized = false;
app.use(async (req, res, next) => {
  if (!isInitialized) {
    try {
      await legoData.initialize();
      isInitialized = true;
      next();
    } catch (err) {
      res.status(500).send("Failed to initialize Lego data.");
    }
  } else {
    next();
  }
});

// 👇 Export handler for Vercel
module.exports = serverless(app);
