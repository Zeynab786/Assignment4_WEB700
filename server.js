/********************************************************************************
*  WEB700 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Zeinab Mohamed      Student ID: 123970246      Date: 6th July 2025
*
*  Published URL: https://your-deployed-vercel-url.vercel.app
*
********************************************************************************/

const express = require("express");
const path = require("path");

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware for static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set up EJS templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes

// Home page (renders EJS)
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

// About page (renders EJS)
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// Show Add Set form (GET)
app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render("addSet", { themes });
  } catch (err) {
    res.status(500).send("Error loading themes");
  }
});

// Add a new Lego set (POST)
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

// List all Lego sets (renders EJS)
app.get("/lego/sets", async (req, res) => {
  try {
    const sets = await legoData.getAllSets();
    res.render("sets", { sets });
  } catch (err) {
    res.status(500).send("Error loading Lego sets");
  }
});

// Show specific Lego set details (renders EJS)
app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.set_num);
    res.render("set", { set });
  } catch (err) {
    res.status(404).render("404", { page: "" });
  }
});

// Add a test Lego set (redirects)
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

// 404 fallback
app.use((req, res) => {
  res.status(404).render("404", { page: "" });
});

// Initialize legoData and start server
legoData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize Lego data:", err);
  });

app.set('view engine', 'ejs');

app.get("/lego/deleteSet/:set_num", async (req, res) => {
  try {
    await legoData.deleteSetByNum(req.params.set_num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(404).send(err);
  }
});
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');