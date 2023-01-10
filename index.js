const five = require("johnny-five");
const config = require("./config");
const board = new five.Board();

let nowPlaying = null;

board.on("ready", async function () {
  const button = new five.Button(config.fiveButton);

  button.on("down", function () {
    Navidrome.star();
  });

  l = new five.LCD(config.LCD);

  l.useChar("note");
  scroller(l, 0, "NAVIDROME");
  Navidrome.currentlyPlaying(l);
});

function scroller(l, row, str) {
  let counter = 0;
  setInterval(() => {
    let fixedStr = str;
    if (counter === 19) {
      counter = 0;
    }
    if (fixedStr.length + counter > 19) {
      fixedStr = fixedStr.slice(
        0,
        fixedStr.length - (fixedStr.length + counter - 19)
      );
    }
    l.cursor(0, 0).print("                    ");
    l.cursor(row, counter++).print(fixedStr);
  }, 500);
}

const Navidrome = {
  currentlyPlaying: currentlyPlaying,
  star: star,
};

async function currentlyPlaying(l) {
  l.useChar("heart");

  setInterval(async () => {
    try {
      const resp = await fetch(
        `${config.navidrome.url}/rest/getNowPlaying?u=${config.navidrome.username}&t=${config.navidrome.token}&s=${config.navidrome.salt}&v=${config.navidrome.version}&c=${config.navidrome.appName}&f=json`
      );

      const result = await resp.json();

      if (result?.["subsonic-response"]?.error) {
        return;
      }

      if (!result?.["subsonic-response"]?.nowPlaying?.entry) {
        return;
      }
      const tempNowPlaying =
        result?.["subsonic-response"]?.nowPlaying?.entry[0]; //if more than one client is using navidrome, we will just display the most recently used client song playing

      const { title, album, artist, year, starred, id } = tempNowPlaying;
      if (
        // if the id has changed, refresh the whole screen. If the star status has changed, only refresh the star line
        (nowPlaying?.id !== id && l.clear()) ||
        (nowPlaying?.starred !== starred &&
          l.cursor(3, 0).print(`                    `))
      ) {
        //song or starred status has changed
        nowPlaying = tempNowPlaying;
      }

      l.cursor(1, 0).print(title.length > 19 ? title.slice(0, 19) : title);
      l.cursor(2, 0).print(`${artist}`);
      l.cursor(3, 0).print(`${year} ${starred ? ":heart:" : ""}`);
    } catch (error) {
      console.error("ERROR: ", error);
    }
  }, config.navidrome.interval);
}

async function star() {
  if (!nowPlaying) {
    return;
  }

  const resp = await fetch(
    nowPlaying.starred
      ? `http://music.home.io/rest/unstar?id=${nowPlaying.id}&u=${config.navidrome.username}&t=${config.navidrome.token}&s=${config.navidrome.salt}&v=${config.navidrome.version}&c=${config.navidrome.appName}&f=json`
      : `http://music.home.io/rest/star?id=${nowPlaying.id}&u=${config.navidrome.username}&t=${config.navidrome.token}&s=${config.navidrome.salt}&v=${config.navidrome.version}&c=${config.navidrome.appName}&f=json`
  );
}
