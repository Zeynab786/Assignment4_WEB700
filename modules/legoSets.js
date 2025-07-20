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

const fs = require("fs/promises");
const setData = require("../data/setData");
const themeData = require("../data/themeData");

class LegoData {
  constructor() {
    this.sets = [];
    this.themes = [];
  }

  async initialize() {
    const setData = JSON.parse(await fs.readFile("./data/setData.json"));
    const themeData = JSON.parse(await fs.readFile("./data/themeData.json"));

    this.sets = [...setData];
    this.themes = [...themeData];
    return Promise.resolve();
  }

  getAllThemes() {
    return new Promise((resolve) => resolve(this.themes));
  }

  getThemeById(id) {
    return new Promise((resolve, reject) => {
      const theme = this.themes.find(t => t.id == id);
      if (theme) resolve(theme);
      else reject("unable to find requested theme");
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
      const foundSet = this.sets.find(set => set.set_num === setNum);
      if (foundSet) {
        resolve(foundSet);
      } else {
        reject("Set not found: " + setNum);
      }
    });
  }

  getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      const filteredSets = this.sets.filter(set =>
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
