let planeHasShield = false;
const planeShieldElem = document.getElementById('plane-shield');

let isGameMode = false;
let score = 0;
let isGameLive = false;

let gameTime = 0;
let gameTimeInterval = null;
const timerDisplay = document.getElementById('timer-display');

const gameOverlay = document.getElementById('game-overlay');
const finalScoreElem = document.getElementById('final-score');
const finalTimeElem = document.getElementById('final-time');
const scoreDisplay = document.getElementById('score-display');
const scoreValueElem = document.getElementById('score-value');

let heartCount = 0;
const heartContainer = document.getElementById('heart-container');
const maxHeartLabel = document.getElementById('max-heart-label');

let shieldTimeLeft = 0;
let shieldTimerId = null;
const shieldTimerWrapper = document.getElementById('shield-timer-wrapper');
const shieldTimerLabel = document.getElementById('shield-timer-label');

let currentLevel = 1;
const levelLabel = document.getElementById('level-label');
levelLabel.style.display = 'none';

function startGameTimers() {
  gameTime = 0;
  score = 0;
  timerDisplay.textContent = '00:00';
  scoreValueElem.textContent = '0';
  timerDisplay.style.display = 'block'
  levelLabel.style.display = 'block';
  uiPanel.classList.remove('hidden');
  if (gameTimeInterval) clearInterval(gameTimeInterval);

  gameTimeInterval = setInterval(() => {
    if (isGameMode && !planeDestroyed) {
      timerDisplay.textContent = formatTime(gameTime);
      scoreValueElem.textContent = score.toString();
    }
  }, 1000);
}

function stopGameTimers() {
  if (gameTimeInterval) {
    clearInterval(gameTimeInterval);
    gameTimeInterval = null;
  }
  timerDisplay.style.display = "none";
}
function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  let mm = (m < 10) ? ("0" + m) : ("" + m);
  let ss = (s < 10) ? ("0" + s) : ("" + s);
  return mm + ":" + ss;
}

function setShieldActive(isActive) {
  const shieldDiv = document.getElementById('shield-div');
  const shieldPlaceholder = document.getElementById('shield-placeholder-container');

  if (isActive) {
    shieldDiv.classList.remove('hidden');
    shieldPlaceholder.style.display = 'none';
  } else {
    shieldDiv.classList.add('hidden');
    shieldPlaceholder.style.display = 'flex';
  }
}

function respawnPlayerPlane() {
  planeDestroyed = false;
  airplane.style.visibility = "visible";
  airplane.classList.add("blinking");
  setTimeout(() => {
    airplane.classList.remove("blinking");
  }, 3000);
}

function triggerExplosion(x, y, color = null) {
  const explosion = document.createElement('div');
  explosion.classList.add('explosion');
  explosion.style.left = x + 'px';
  explosion.style.top = y + 'px';
  if (color) {
    explosion.style.background = `radial-gradient(circle, ${color} 20%, rgba(0,0,0,0)80%)`;
  }
  document.body.appendChild(explosion);
  setTimeout(() => explosion.remove(), 1000);
}

function startShieldTimer() {
  shieldTimeLeft = 10;
  shieldTimerLabel.textContent = shieldTimeLeft.toString();
  shieldTimerWrapper.style.display = 'block';
  shieldTimerLabel.style.color = 'rgba(73, 0, 190, 0.91)';

  if (shieldTimerId) clearInterval(shieldTimerId);
  shieldTimerId = setInterval(() => {
    shieldTimeLeft--;
    shieldTimerLabel.textContent = shieldTimeLeft.toString();
    if (shieldTimeLeft <= 3) {
      shieldTimerLabel.style.color = 'rgba(231, 6, 6, 0.91)';
    }
    if (shieldTimeLeft <= 0) {
      clearInterval(shieldTimerId);
      planeHasShield = false;
      setShieldActive(false);
      planeShieldElem.style.display = 'none';
      shieldTimerWrapper.style.display = 'none';
    }
  }, 1000);
}
function stopShieldTimer() {
  if (shieldTimerId) clearInterval(shieldTimerId);
  shieldTimerWrapper.style.display = 'none';
}

function updateHeartDisplay() {
  const hearts = heartContainer.querySelectorAll('img');
  hearts.forEach((img, index) => {
    if (index < heartCount) {
      img.src = 'assets/images/mini_game/final/heart.png';
      img.classList.remove('opacity-50');
    } else {
      img.src = 'assets/images/mini_game/placeholder/heart.png';
      img.classList.add('opacity-50');
    }
  });
  heartContainer.style.display = 'flex';
}

function updateLevelLabel() {
  let labelText = 'LEVEL ' + currentLevel.toString();
  if (currentLevel >= 5) labelText = 'LEVEL 5 (MAX)';
  levelLabel.textContent = labelText;

  if (currentLevel === 1) levelLabel.style.color = 'green';
  else if (currentLevel === 2) levelLabel.style.color = 'yellow';
  else if (currentLevel === 3) levelLabel.style.color = 'orange';
  else if (currentLevel === 4) levelLabel.style.color = 'red';
  else if (currentLevel >= 5) levelLabel.style.color = 'purple';
}

function doLevelUpReward() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%,-50%)';
  overlay.style.color = '#fff';
  overlay.style.fontSize = '2rem';
  overlay.style.background = 'rgba(0,0,0,0.7)';
  overlay.style.padding = '20px';
  overlay.style.zIndex = '13000';
  overlay.style.borderRadius = '10px';
  overlay.style.textAlign = 'center';

  let msg = 'LEVEL UP!<br>';
  let given = '';

  if (heartCount < 3) {
    heartCount++;
    updateHeartDisplay();
    given = 'You earned +1 life!';
  } else {
    if (purpleOrbCount < 3) {
      purpleOrbCount++;
      updatePurpleOrbs();
      given = 'You earned +1 Purple Orb!';
    } else {
      if (flareCount < 3) {
        flareCount++;
        updateFlareUI();
        given = 'You earned +1 Flare!';
      } else {
        if (!planeHasShield) {
          planeHasShield = true;
          setShieldActive(true);
          planeShieldElem.style.display = 'block';
          startShieldTimer();
          given = 'You earned a Shield!';
        } else {
          given = 'No reward (all maxed).';
        }
      }
    }
  }
  overlay.innerHTML = `${msg} <span style="font-size:1.2rem">${given}</span>`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 2000);
}

function checkLevelUp() {
  let oldLevel = currentLevel;

  if (score >= 1000 && currentLevel < 5) {
    currentLevel = 5;
  } else if (score >= 750 && currentLevel < 4) {
    currentLevel = 4;
  } else if (score >= 500 && currentLevel < 3) {
    currentLevel = 3;
  } else if (score >= 250 && currentLevel < 2) {
    currentLevel = 2;
  }

  if (currentLevel > oldLevel) {
    updateLevelLabel();
    doLevelUpReward();
  }
}

function checkMissileMissileCollisions() {
  const missiles = [...document.querySelectorAll('img[data-type="missile"]')];
  for (let i = 0; i < missiles.length; i++) {
    for (let j = i + 1; j < missiles.length; j++) {
      const r1 = missiles[i].getBoundingClientRect();
      const r2 = missiles[j].getBoundingClientRect();
      if (rectsIntersect(r1, r2)) {
        triggerExplosion((r1.left + r1.right) / 2, (r1.top + r1.bottom) / 2, "darkred");
        missiles[i].remove();
        missiles[j].remove();
        if (currentMissiles > 0) currentMissiles = currentMissiles - 2;
      }
    }
  }
}

function checkMeteorPlaneCollisions() {
  const meteors = [...document.querySelectorAll('.meteor')];
  const airplaneRect = airplane.getBoundingClientRect();

  meteors.forEach(m => {
    const dt = m.getAttribute('data-type');
    const isEnemyPlane = (dt === 'plane');
    const isMeteor = (!dt);
    const isHeart = (dt === 'heart');

    if (isGameMode && !planeDestroyed) {
      const r = m.getBoundingClientRect();
      if (rectsIntersect(airplaneRect, r)) {
        if (isHeart) {
          m.remove();
          if (heartCount < 3) {
            heartCount++;
            updateHeartDisplay();
          }
        }
        else if (isEnemyPlane || isMeteor) {
          if (planeHasShield) {
            let color = isEnemyPlane ? "darkorange" : "darkgray";
            triggerExplosion((r.left + r.right) / 2, (r.top + r.bottom) / 2, color);
            m.remove();
            planeHasShield = false;
            setShieldActive(false);
            planeShieldElem.style.display = 'none';
            stopShieldTimer();
          } else {
            triggerExplosion(
              (airplaneRect.left + airplaneRect.right) / 2,
              (airplaneRect.top + airplaneRect.bottom) / 2,
              "purple"
            );
            planeDestroyed = true;
            airplane.style.visibility = 'hidden';

            let color2 = isEnemyPlane ? "darkorange" : "darkgray";
            triggerExplosion((r.left + r.right) / 2, (r.top + r.bottom) / 2, color2);
            m.remove();

            if (heartCount > 0) {
              heartCount--;
              updateHeartDisplay();
              setTimeout(() => respawnPlayerPlane(), 1500);
            } else {
              endGame();
            }
          }
        }
      }
    }
  });
}

function checkMissileEnemyPlaneCollisions() {
  if (!isGameMode && currentLevel >= 4) return;
  const missiles = [...document.querySelectorAll('img[data-type="missile"]')];
  const enemyPlanes = [...document.querySelectorAll('img[data-type="plane"]')];

  missiles.forEach(m => {
    const mr = m.getBoundingClientRect();
    enemyPlanes.forEach(ePlane => {
      //if(currentLevel >= 4 || ePlane.dataset.noMissileCollision === "true") return;
      if (ePlane.dataset.noMissileCollision === "true") return;
      const er = ePlane.getBoundingClientRect();
      if (rectsIntersect(mr, er)) {
        triggerExplosion((mr.left + mr.right) / 2, (mr.top + mr.bottom) / 2, "darkred");
        m.remove();
        triggerExplosion((er.left + er.right) / 2, (er.top + er.bottom) / 2, "darkorange");
        ePlane.remove();

        score += 5;
        scoreValueElem.textContent = score.toString();
        if (currentMissiles > 0) currentMissiles--;
      }
    });
  });
}

function checkCollisions() {
  const missiles = [...document.querySelectorAll('img[data-type="missile"]')];
  const powers = [...document.querySelectorAll('img[data-type="powerup"],img[data-type="flare"]')];

  const airplaneRect = airplane.getBoundingClientRect();
  const shieldRadius = 40;
  const airplaneCenterX = (airplaneRect.left + airplaneRect.right) / 2;
  const airplaneCenterY = (airplaneRect.top + airplaneRect.bottom) / 2;

  powers.forEach(p => {
    let dt = p.getAttribute('data-type');
    const r = p.getBoundingClientRect();
    if (rectsIntersect(airplaneRect, r)) {
      if (dt === "powerup") {
        p.remove();
        planeHasShield = true;
        planeShieldElem.style.display = 'block';
        setShieldActive(true);
        startShieldTimer();
      } else if (dt === "flare") {
        p.remove();
        if (flareCount < 3) {
          flareCount++;
          updateFlareUI();
        }
      }
    }
  });

  // missiles for purple plane
  missiles.forEach(m => {
    const mr = m.getBoundingClientRect();
    let cx = (mr.left + mr.right) / 2, cy = (mr.top + mr.bottom) / 2;
    if (!planeDestroyed) {
      if (planeHasShield) {
        let dx = airplaneCenterX - cx;
        let dy = airplaneCenterY - cy;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < shieldRadius) {
          triggerExplosion(cx, cy, "darkred");
          m.remove();
          planeHasShield = false;
          setShieldActive(false);
          planeShieldElem.style.display = 'none';
          stopShieldTimer();
          if (currentMissiles > 0) currentMissiles--;
        }
      } else {
        if (rectsIntersect(airplaneRect, mr)) {
          triggerExplosion(airplaneCenterX, airplaneCenterY, "purple");
          m.remove();
          if (currentMissiles > 0) currentMissiles--;
          planeDestroyed = true;
          airplane.style.visibility = 'hidden';

          if (heartCount > 0) {
            heartCount--;
            updateHeartDisplay();
            setTimeout(() => respawnPlayerPlane(), 1500);
          } else {
            endGame();
          }
        }
      }
    }
  });
  checkMissileMissileCollisions();
  checkMeteorPlaneCollisions();
  checkMissileEnemyPlaneCollisions();
  checkEnemyPlaneLogic();
  requestAnimationFrame(checkCollisions);
}

function checkEnemyPlaneLogic() {
  if (!isGameMode) return;
  const enemyPlanes = [...document.querySelectorAll('img[data-type="plane"]')];

  enemyPlanes.forEach(plane => {
    if (currentLevel >= 2) {
      // if(!plane.dataset.willFire){
      //   plane.dataset.willFire = (Math.random() < 1) ? "true" : "false";
      // }
      // if(plane.dataset.willFire === "true" && !plane.dataset.rocketInterval){
      if (!plane.dataset.rocketInterval) {
        plane.dataset.rocketInterval = setInterval(() => {
          if (!document.body.contains(plane)) {
            clearInterval(plane.dataset.rocketInterval);
            return;
          }
          if (Math.random() < 0.3) {
            blinkRedCircle(plane, () => {
              plane.dataset.noMissileCollision = "true";
              setTimeout(() => {
                delete plane.dataset.noMissileCollision;
              }, 2000);

              const r = plane.getBoundingClientRect();
              let transform = plane.style.transform;
              let match = transform.match(/rotate\(([-0-9.]+)deg\)/);
              let planeAngle = match ? parseFloat(match[1]) : 0;
              let planeAngleRad = planeAngle * Math.PI / 180;

              // inital coordinates for missiles from enemy planes
              let noseX = (r.left + r.right) / 2 + 50 * Math.cos(planeAngleRad);
              let noseY = (r.top + r.bottom) / 2 + 50 * Math.sin(planeAngleRad);
              createMissileFrom(noseX, noseY);
            });
          }
        }, 2000);
      }
    }

    if (currentLevel >= 4) {
      if (!plane.dataset.partialFollow) {
        plane.dataset.partialFollow = "true";
        plane.style.transition = "none";
        plane.followAngle = null;

        function partialFollow() {
          if (!document.body.contains(plane)) return;
          const planeRect = plane.getBoundingClientRect();
          let px = (planeRect.left + planeRect.right) / 2;
          let py = (planeRect.top + planeRect.bottom) / 2;

          const myRect = airplane.getBoundingClientRect();
          let mx = (myRect.left + myRect.right) / 2;
          let my = (myRect.top + myRect.bottom) / 2;

          let dx = mx - px, dy = my - py;
          let distance = Math.hypot(dx, dy);
          const desiredDist = 200;
          // let speed = (currentLevel >= 4) ? 2.5 : 1.5;
          let speed = 1.5
          let newAngle = Math.atan2(dy, dx);

          if (distance > desiredDist) {
            if (plane.followAngle === null) {
              plane.followAngle = newAngle;
            } else {
              plane.followAngle = lerpAngle(plane.followAngle, newAngle, 0.1);
            }
          }
          let angle = (plane.followAngle !== null) ? plane.followAngle : newAngle;

          px += speed * Math.cos(angle);
          py += speed * Math.sin(angle);
          plane.style.left = px + "px";
          plane.style.top = py + "px";

          let deg = angle * (180 / Math.PI);
          plane.style.transform = `translate(-50%,-50%) rotate(${deg}deg)`;
          requestAnimationFrame(partialFollow);
        }
        requestAnimationFrame(partialFollow);
      }
    }
  });
}

function blinkRedCircle(plane, callback) {
  const planeRect = plane.getBoundingClientRect();
  const diameter = Math.max(planeRect.width, planeRect.height) + 20;
  const circle = document.createElement('div');
  circle.style.position = 'fixed';
  circle.style.width = diameter + 'px';
  circle.style.height = diameter + 'px';
  circle.style.border = '3px solid red';
  circle.style.borderRadius = '50%';
  circle.style.zIndex = '13000';
  circle.style.opacity = '0';
  document.body.appendChild(circle);

  function updatePosition() {
    if (!document.body.contains(plane)) return;
    const rect = plane.getBoundingClientRect();
    const cx = (rect.left + rect.right) / 2;
    const cy = (rect.top + rect.bottom) / 2;
    circle.style.left = (cx - diameter / 2) + 'px';
    circle.style.top = (cy - diameter / 2) + 'px';
    requestAnimationFrame(updatePosition);
  }
  updatePosition();

  setTimeout(() => {
    circle.style.transition = 'opacity 0.3s';
    circle.style.opacity = '1';
  }, 0);
  setTimeout(() => {
    circle.style.opacity = '0';
  }, 300);
  setTimeout(() => {
    circle.style.opacity = '1';
  }, 600);
  setTimeout(() => {
    circle.style.opacity = '0';
  }, 900);
  setTimeout(() => {
    circle.remove();
    if (callback) callback();
  }, 1000);
}

function createMissileFrom(x, y) {
  const img = document.createElement("img");
  img.src = "assets/images/mini_game/final/missile.png";
  img.setAttribute("data-type", "missile");
  img.style.position = "fixed";
  img.style.pointerEvents = "none";
  img.style.width = "35px";
  img.style.height = "20px";
  img.style.zIndex = "7000";
  img.style.left = x + "px";
  img.style.top = y + "px";
  document.body.appendChild(img);

  let missileX = x, missileY = y;
  let headingAngle = 0;
  let isLockedOn = true;
  const lockDistance = 40;

  function animateMissile() {
    if (!document.body.contains(img)) return;
    const planeRect = airplane.getBoundingClientRect();
    const planeCenterX = (planeRect.left + planeRect.right) / 2;
    const planeCenterY = (planeRect.top + planeRect.bottom) / 2;
    let dx = planeCenterX - missileX;
    let dy = planeCenterY - missileY;
    let distance = Math.hypot(dx, dy);

    if (isLockedOn) {
      let desiredAngle = Math.atan2(dy, dx);
      let minTurn = 0.02, maxTurn = 0.2;
      let clampDist = Math.min(distance, 500);
      let turnFactor = minTurn + (maxTurn - minTurn) * (clampDist / 500);
      headingAngle = lerpAngle(headingAngle, desiredAngle, turnFactor);

      // if distance < lockDistance => "dodged"
      if (distance < lockDistance) {
        isLockedOn = false;
        if (isGameMode) {
          score += 10;
          scoreValueElem.textContent = score.toString();
        }
      }
    }
    let speed = (currentLevel >= 3) ? 2.5 : 2.0;
    if (distance > speed) {
      missileX += speed * Math.cos(headingAngle);
      missileY += speed * Math.sin(headingAngle);
    } else {
      missileX = planeCenterX;
      missileY = planeCenterY;
    }
    img.style.left = missileX + "px";
    img.style.top = missileY + "px";
    let deg = headingAngle * (180 / Math.PI);
    img.style.transform = `translate(-50%,-50%) rotate(${deg}deg)`;

    requestAnimationFrame(animateMissile);
  }
  requestAnimationFrame(animateMissile);
}

function clearExistingObjects() {
  const allObjs = document.querySelectorAll('.meteor, .missile, .plane, .powerup, .heart, .flare, .flare-particle');
  allObjs.forEach(o => o.remove());
}

function endGame() {
  isGameLive = true;

  gameOverlay.classList.remove('hidden');
  finalScoreElem.textContent = score.toString();
  finalTimeElem.textContent = formatTime(gameTime);
  uiPanel.classList.add('hidden');

  stopGameTimers();
  stopMissileSpawn();
  stopPowerupSpawn();
  stopEnemyPlaneSpawn();

  document.getElementById('purple-bar-outer').style.display = 'none';
  document.getElementById('purple-bar-inner').style.width = '0%';

  purpleOrbCount = 0

  planeHasShield = false;
  setShieldActive(false);
  planeShieldElem.style.display = 'none';
  stopShieldTimer();

  clearExistingObjects();
}

function rectsIntersect(r1, r2) {
  const shrinkFactor = 0.35;
  const r1W = r1.width * shrinkFactor, r1H = r1.height * shrinkFactor;
  return !(
    r2.left > r1.right - r1W ||
    r2.right < r1.left + r1W ||
    r2.top > r1.bottom - r1H ||
    r2.bottom < r1.top + r1H
  );
}

requestAnimationFrame(checkCollisions);