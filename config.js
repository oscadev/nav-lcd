const md5 = require("md5");
require("dotenv").config();

const salt = md5(new Date());

let config = {
  LCD: {
    controller: "PCF8574T",
    rows: 4,
    cols: 20,
  },
  fiveButton: {
    pin: 4,
    invert: true,
    isPullup: true,
  },
  navidrome: {
    url: process.env.NAVIDROME_URL,
    username: process.env.NAVIDROME_USERNAME,
    appName: "nav-lcd", //the name you want this service to be seen as in your navidrome settings
    version: "1.16.1",
    password: process.env.NAVIDROME_PASSWORD,
    salt: salt,
    token: md5(process.env.NAVIDROME_PASSWORD + salt),
    interval: 1000, // how often in ms to refetch subsonic data
  },
};

module.exports = config;
