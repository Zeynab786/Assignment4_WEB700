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

// Set the view engine to EJS
app.set("view engine", "ejs");
// Set the views folder path
app.set("views", path.join(__dirname, "views"));

// Middleware to serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON body in POST requests
app.use(express.json());
// Middleware to parse URL-encoded form data (needed for POST form submissions)
app.use(express.urlencoded({ extended: true }));

// Home page - render home.ejs instead of sending static html
app.get("/", (req, res) => {
  res.render("home", { page: "home" }); // pass page for navbar highlighting
});

// About page - render about.ejs instead of sending static html
app.get("/about", (req, res) => {
  res.render("about", { page: "about" }); // pass page for navbar highlighting
});

// GET route to render addSet.ejs with dynamic themes
app.get("/lego/addSet", (req, res) => {
  legoData.getAllThemes()
    .then(themes => {
      res.render("addSet", { themes, page: "add" });  // pass page for navbar highlighting
    })
    .catch(err => {
      res.status(500).send("Error loading themes: " + err);
    });
});

// POST route to handle form submission from addSet page — UPDATED to set theme name
app.post("/lego/addSet", async (req, res) => {
  try {
    let foundTheme = await legoData.getThemeById(req.body.theme_id);
    req.body.theme = foundTheme.name;  // add theme name to req.body

    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(400).send("Error adding set: " + err);
  }
});

// Updated GET route for Lego sets - renders sets.ejs instead of JSON
app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme;
    let sets;

    if (theme) {
      sets = await legoData.getSetsByTheme(theme);
    } else {
      sets = await legoData.getAllSets();
    }

    res.render("sets", { sets, page: "/lego/sets" });

  } catch (err) {
    res.status(500).render("404", { title: "Error", page: "" });
  }
});

// GET route to fetch single set by set_num and render set.ejs with title passed
app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const setNum = req.params.set_num;
    const set = await legoData.getSetByNum(setNum);
    res.render("set", { set, title: set.name || "Lego Set Details" });
  } catch (err) {
    res.status(404).render("404", { title: "Set Not Found", page: "" });
  }
});

// Route to delete a Lego set by set_num
app.get("/lego/deleteSet/:set_num", async (req, res) => {
  try {
    const setNum = req.params.set_num;
    await legoData.deleteSetByNum(setNum); // Make sure this method exists in legoSets.js
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).render("404", { title: "Delete Failed", page: "" });
  }
});

// POST route to add a Lego set (API)
app.post("/lego/sets", async (req, res) => {
  try {
    const newSet = req.body;
    await legoData.addSet(newSet);
    res.status(201).json({ message: "Set added successfully" });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// 404 handler for any other routes
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Not Found", page: "" });
});

// Initialize data and start server
legoData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });