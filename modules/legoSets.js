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

// ✅ Load JSON statically using require() for Vercel compatibility
const setData = require("../data/setData.json");
const themeData = require("../data/themeData.json");

class LegoData {
  constructor() {
    this.sets = [];
    this.themes = [];
  }

  async initialize() {
    // ✅ Remove fs.readFile – use preloaded data
    this.sets = [...setData];
    this.themes = [...themeData];
    return Promise.resolve();
  }

  getAllThemes() {
    return Promise.resolve(this.themes);
  }

  getThemeById(id) {
    return new Promise((resolve, reject) => {
      const theme = this.themes.find(t => t.id == id);
      theme ? resolve(theme) : reject("unable to find requested theme");
    });
  }

  getAllSets() {
    return new Promise((resolve, reject) => {
      this.sets.length > 0
        ? resolve(this.sets)
        : reject("sets not available.");
    });
  }

  getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const foundSet = this.sets.find(set => set.set_num === setNum);
      foundSet ? resolve(foundSet) : reject("Set not found: " + setNum);
    });
  }

  getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      const filteredSets = this.sets.filter(set =>
        set.theme.toLowerCase().includes(theme.toLowerCase())
      );

      filteredSets.length > 0
        ? resolve(filteredSets)
        : reject(`No sets found with theme including: '${theme}'`);
    });
  }

  addSet(newSet) {
    return new Promise((resolve, reject) => {
      const exists = this.sets.find(set => set.set_num === newSet.set_num);
      if (exists) {
        reject("Set already exists");
      } else {
        this.sets.push(newSet);
        resolve();
      }
    });
  }

  deleteSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const index = this.sets.findIndex(s => s.set_num === setNum);
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
