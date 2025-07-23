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

const setData = require("../data/setData");
const themeData = require("../data/themeData");

class LegoData {
  constructor() {
    this.sets = [];
    this.themes = [];   // <-- Added: new property to store themes
  }

  initialize() {
    return new Promise((resolve, reject) => {
      try {
        this.sets = [];

        // Initialize sets with theme names (existing code)
        setData.forEach((set) => {
          const foundtheme = themeData.find((theme) => theme.id === set.theme_id);

          const setWithTheme = {
            ...set,
            theme: foundtheme ? foundtheme.name : "Unknown"
          };

          this.sets.push(setWithTheme);
        });

        this.themes = [...themeData];  // <-- Added: load all themes from themeData

        resolve();
      } catch (err) {
        reject("Failed to initialize data: " + err);
      }
    });
  }

  getAllSets() {
    return new Promise((resolve, reject) => {
      if (this.sets.length === 0) {
        reject("sets not available.");
      } else {
        resolve(this.sets);
      }
    });
  }

  getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const foundSet = this.sets.find((set) => set.set_num === setNum);

      if (foundSet) {
        resolve(foundSet);
      } else {
        reject("Set not found: " + setNum);
      }
    });
  }

  getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      const filteredSets = this.sets.filter((set) =>
        set.theme.toLowerCase().includes(theme.toLowerCase())
      );

      if (filteredSets.length > 0) {
        resolve(filteredSets);
      } else {
        reject(`No sets found with theme including: '${theme}'`);
      }
    });
  }

  addSet(newSet) {
    return new Promise((resolve, reject) => {
      // Check if set_num already exists in this.sets
      const exists = this.sets.some((set) => set.set_num === newSet.set_num);
      if (exists) {
        reject("Set already exists");
      } else {
        // If theme_id provided, try to add theme name property
        const foundTheme = themeData.find((theme) => theme.id === newSet.theme_id);
        const setWithTheme = {
          ...newSet,
          theme: foundTheme ? foundTheme.name : "Unknown"
        };

        this.sets.push(setWithTheme);
        resolve();
      }
    });
  }

  // <-- Added new method: getAllThemes()
  getAllThemes() {
    return new Promise((resolve, reject) => {
      if (this.themes.length === 0) {
        reject("Themes not available.");
      } else {
        resolve(this.themes);
      }
    });
  }

  // <-- Added new method: getThemeById(id)
  getThemeById(id) {
    return new Promise((resolve, reject) => {
      const foundTheme = this.themes.find((theme) => theme.id === id);

      if (foundTheme) {
        resolve(foundTheme);
      } else {
        reject("unable to find requested theme");
      }
    });
  }

  // <-- Added new method: deleteSetByNum(setNum)
  deleteSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const index = this.sets.findIndex(set => set.set_num === setNum);
      if (index !== -1) {
        this.sets.splice(index, 1);
        resolve();
      } else {
        reject("Set not found");
      }
    });
  }
}

module.exports = LegoData;