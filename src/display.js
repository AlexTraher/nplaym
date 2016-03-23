import { HEIGHT, WIDTH, LEFTWALL, RIGHTWALL, MIDWIDTH, MIDHEIGHT, FPS, FRAMERATE, DIFFICULTY, STARTTIME, PLAYERLINE } from './constants.js';
import { SCORE, checkIntersects, checkBullet, checkPowerup, gameState, player, bulletCount } from './game.js';
import { npmOutput } from './io.js';
import colors from 'colors';
import term from './terminal.js';

function paintScreen () {

  for (let line = 0; line < HEIGHT; line++) {

    paintMovers(line)

    if (line === 1) {
      // Replace control chars, letters and numbers
      const out = npmOutput.replace(/[\x00-\x1F\x7F-\x9Fa-zA-Z0-9\?\[:\s]/g, '');
      const progressTxt = `NPM: ${out}`;
      term.write(progressTxt);
      term.left(progressTxt.length)
    }

    if (line === 2) {
      const scoreTxt = `Score: ${SCORE}`;
      term.write(scoreTxt);
      term.left(scoreTxt.length);
    }

    if (line === 3) {
      var bulletTxt = `bullet ${bulletCount}`;
      term.write(bulletTxt);
      term.left(bulletTxt.length);
    }

    term.nl();
  }

  gameState.filter(item => item.type === 'bullet' || item.type === 'mob' || item.type === 'powerup')
    .forEach(item => {
      item.tick();
    })
}

function cursorReturn (item) {
  term.left(item.left + item.s.length)
}

function paintMovers (line) {
  const entities = gameState.filter(item => item.up === line).sort((a, b) => a.left > b.left);

  if (entities.length > 0) {
    entities.forEach(item => {
      term.right(item.left).write(item.s[item.colour]);
      cursorReturn(item)
    })
    checkBullet(line, entities);
    if (line === PLAYERLINE) {
      checkIntersects(line, entities);
      checkPowerup(line, entities);
    }
  }
}

function writeCentre (msg, offset) {
  term.nl(MIDHEIGHT).write(msg).nl(MIDHEIGHT);
}

function startSequence (startGameFn) {

  // TODO: Sort out this callback cancer
  for (let i = 0; i < MIDWIDTH + 1; i++) {
    setTimeout(function () {
      let str = ' '.repeat(i) + '>'.green;
      term.write(str);
      term.left(str.length)

      if (i === MIDWIDTH) {
        str = ' '.repeat(i) + '^'.green;
        for (let j = 0; j < PLAYERLINE; j++) {
          setTimeout(function () {
            term.clearLine().nl().write(str)

            if (j === PLAYERLINE - 1) {
              for (let k = 0; k < HEIGHT - PLAYERLINE; k++) {
                setTimeout(function () { 
                  term.nl();
                  if (k === HEIGHT - PLAYERLINE - 1) {
                    startGameFn()
                  }
                }, 20 * k)
              }
            }

          }, 20 * j)
        }
      }

    }, 10 * i)
  }

}


export { paintScreen, cursorReturn, writeCentre, startSequence };