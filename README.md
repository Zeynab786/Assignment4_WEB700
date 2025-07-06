
# WEB700 Assignment 4

## Overview

A Lego collection web app with a custom CSS theme, showcasing HTML elements on the About page and allowing new Lego sets to be added.

## Features

* Custom styled theme (`theme.css`) applied site-wide
* About page demonstrates tables, lists, images, audio, and video elements
* Express server (`server.js`) serving pages and static files
* `addSet()` method to add new Lego sets without duplicates
* `/lego/add-test` route to test adding a new Lego set

## Run

1. Install Node.js
2. Run `node server.js`
3. Visit:

   * Home: `http://localhost:3000`
   * About: `http://localhost:3000/about.html`
   * Add test set: `http://localhost:3000/lego/add-test`

## Structure

* `/public/css/theme.css` — CSS theme
* `/views` — HTML pages
* `server.js` — Express server and routes
* `legoSets.js` — Lego sets data and `addSet()` method

