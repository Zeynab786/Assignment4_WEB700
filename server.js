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

app.set('views', __dirname + "/views")

// Serve static files from 'public' folder
app.use(express.static(__dirname + "/public"));

// Route: Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

// Route: About
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Route: Get all Lego sets
app.get("/lego/sets", (req, res) => {
  if (req.query.name) {
    legoData.getSetsByTheme(req.query.name)
      .then(data => res.json(data))
      .catch(err => res.status(404).json({ error: err }));
  } else {
    legoData.getAllSets()
      .then(data => res.json(data))
      .catch(err => res.status(404).json({ error: err }));
  }
});

// Route: Get specific Lego set by number
app.get("/lego/sets/:num", (req, res) => {
  legoData.getSetByNum(req.params.num)
    .then(data => res.json(data))
    .catch(err => res.status(404).json({ error: err }));
});

// Route: Add a new test Lego set
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

// Route: 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// Initialize and start the server
legoData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize Lego data:", err);
  });
