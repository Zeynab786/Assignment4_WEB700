/********************************************************************************
*  WEB700 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Zeinab Mohamed      Student ID: 123970246      Date: 14th June 2025
*
*  Published URL: https://assignment3-l1a5p5n31-zeynab786s-projects.vercel.app 
*
********************************************************************************/

const express = require("express");
const path = require("path");
const LegoData = require("./modules/legoSets");

const app = express();
const legoData = new LegoData();
const HTTP_PORT = process.env.PORT || 8080;

// Serve static files from /public
app.use(express.static(__dirname + "/public"));

// ROUTES
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme;
    if (theme) {
      const sets = await legoData.getSetsByTheme(theme);
      res.json(sets);
    } else {
      const sets = await legoData.getAllSets();
      res.json(sets);
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const setNum = req.params.set_num;
    const set = await legoData.getSetByNum(setNum);
    res.json(set);
  } catch (err) {
    res.status(404).json({ error: err });
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
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.status(422).send(err);
    });
});

// 404 Route (Must be last)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Start server
legoData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });