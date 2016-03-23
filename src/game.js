import { HEIGHT, WIDTH, LEFTWALL, RIGHTWALL, MIDWIDTH, MIDHEIGHT, FPS, FRAMERATE, DIFFICULTY, STARTTIME, PLAYERLINE, BULLET_COUNT } from './constants.js';
import term from './terminal.js';
import { Monster, Bullet, Powerup } from './classes.js';
import { writeCentre, paintScreen, startSequence } from './display.js';
import { installingPackages } from './io.js';

let SCORE = 0;
let ALIVE = true;
let LOOP;
let bulletCount = BULLET_COUNT;

const gameState = [{
  type: 'player',
  s: '^',
  up: PLAYERLINE,
  left: MIDWIDTH,
  colour: 'green'
}];

const player = gameState[0];

function checkBullet(line, entities) {
  const bullets = entities.filter(i => i.type === 'bullet');
  const mobs = entities.filter(i => i.type === 'mob');
  const bulletsToGo = [];
  bullets.forEach((bullet, bi) => {
    // console.log(item.left, dangerZone)
    mobs.forEach((mob, mi) => {
      if (intersects(bullet.left, mob.dangerZone) && !bullet.dead && !mob.dead) {
        bullet.dead = true;
        bullet.colour = 'black';
        mob.s = 'x'.repeat(mob.s.length);
        mob.dead = true;
        mob.colour = 'yellow';
        addScore(mob.s.length);
      }
    })
  })
} 

function checkIntersects (line, entities) {
  const playerPos = entities.find(item => item.type === 'player').left;
  const mobs = entities.filter(i => i.type === 'mob');
  const dangerZone = [];
  mobs.forEach(mob => {
    if (intersects(playerPos, mob.dangerZone) && !mob.dead) {
      ALIVE = false;
      setTimeout(gameOver, 1000)
    }
  });
}

function checkPowerup (line, entities) {
  const playerPos = entities.find(item => item.type === 'player').left;
  const powerups = entities.filter(i => i.type === 'powerup');
  const dangerZone = [];
  powerups.forEach(powerup => {
    if (intersects(playerPos, powerup.dangerZone) && !powerup.dead) {
      powerup.dead = true;
      //full powerup of bullets
      bulletCount += BULLET_COUNT;
    }
  });
}

function gameOver (win) {
  if (win) {
    writeCentre(`You win! Packages installed! Your score was ${SCORE}.`);
  } else {
    writeCentre(`You lose! Give up, go home, and sell your keyboard on ebay.\nNo packages have been installed but then I'm sure you've got used to failure by now.\n\nYour score was ${SCORE}.`);
  }
  process.exit(0);
}

function intersects (pos, dangerZone) {
  if (dangerZone.indexOf(pos) !== -1 ) {
    return true;
  }
  return false;
}

function generateScene () {
  const packages = Object.keys(installingPackages);
  if (packages.length > 0 && (Math.random() * 100) < DIFFICULTY) {
    const lastMsg = packages.pop();
    gameState.push(new Monster(lastMsg));
  }

  //Less powerups if on a higher difficulty
  if ((Math.random() * 60) > DIFFICULTY) {
    gameState.push(new Powerup());
  }
}

function addScore (int) {
  SCORE = SCORE + int;
}

function startGame () {
  startSequence(function () {
    LOOP = setInterval(runLoop, FRAMERATE);
  })
}

function fire () {
  if (bulletCount > 0) {
    bulletCount--;
    gameState.push(new Bullet(player.left));
  }
}

function runLoop () {
  if (ALIVE) {
    // term.clear();
    generateScene();
    paintScreen();
  }
};

export { gameState, checkIntersects, checkBullet, checkPowerup,  SCORE, addScore, startGame, fire, player, gameOver, bulletCount };