const countdownOverlay = document.getElementById('countdown-overlay');
const countdownLabel = document.getElementById('countdown-label');

let gameIsLive = false;
const uiPanel = document.getElementById('ui-panel');

let purpleOrbCount = 0;
const purpleOrbContainer = document.getElementById('purple-orb-container');
const maxUltimateLabel = document.getElementById('max-ultimate-label');

let flareCount = 0;
const flareContainer = document.getElementById('flare-container');

const miniGameLink = document.getElementById('mini-game');
miniGameLink.addEventListener('click', (e) => {
  e.preventDefault();
  activateMiniGame();
});

function activateMiniGame() {
  websiteMode = false;
  stopMeteorSpawn();
  clearExistingObjects();
  doCountdown(() => {
    prepareMiniGameUI();
  });
}

function doCountdown(callback) {
  countdownOverlay.style.display = 'flex';
  let count = 3;
  countdownLabel.textContent = count.toString();
  const intv = setInterval(() => {
    count--;
    if (count > 0) {
      countdownLabel.textContent = count.toString();
    } else {
      clearExistingObjects();
      clearInterval(intv);
      countdownOverlay.style.display = 'none';
      callback();
    }
  }, 1000);
}

function prepareMiniGameUI() {
  const headerName = document.getElementById('header-name-ldm');
  const menu = document.getElementById('menu');
  const aboutIntro = document.getElementById('about-me-intro-section');
  const mainContent = document.querySelector('main');
  const watermarks = document.querySelectorAll('.watermark');
  if (headerName) headerName.style.display = 'none';
  if (menu) menu.style.display = 'none';
  if (aboutIntro) aboutIntro.style.display = 'none';
  if (mainContent) mainContent.style.display = 'none';
  watermarks.forEach(w => w.style.display = 'none');

  document.getElementById('page-wrapper').style.zIndex = '0';
  isGameMode = true;
  scoreValueElem.textContent = '0';
  const uiPanel = document.getElementById('ui-panel');
  uiPanel.classList.remove('hidden');

  purpleOrbContainer.innerHTML = '';
  purpleOrbContainer.style.display = 'flex';
  purpleOrbCount = 0;
  maxUltimateLabel.style.display = 'none';
  document.getElementById('purple-bar-outer').style.display = 'block';
  document.getElementById('purple-bar-inner').style.width = '0%';

  heartCount = 0;
  updateHeartDisplay();

  flareCount = 0;
  updateFlareUI();

  currentLevel = 1;
  //levelLabel.style.display = 'none';

  currentMissiles = 0;
  currentPlanes = 0;

  score = 0;
  nextOrbScore = 100;
  
  //startGameTime();
  startGameTimers();
  isGameLive = false;
  startSpawns();
}

function clearExistingObjects() {
  const allObjs = document.querySelectorAll('.meteor', '.plane', '.missile', '.powerup', '.flare', '.heart');
  allObjs.forEach(o => o.remove());
}

const playAgainBtn = document.getElementById('play-again-btn');
playAgainBtn.addEventListener('click', () => {
  gameOverlay.classList.add('hidden');
  clearExistingObjects();
  planeDestroyed = false;
  respawnPlayerPlane();
  doCountdown(() => {
    prepareMiniGameUI();
  });
});

const exitGameBtn = document.getElementById('exit-game-btn');
exitGameBtn.addEventListener('click', () => {
  isGameMode = false;
  websiteMode = true;
  
  planeDestroyed = false;
  respawnPlayerPlane();

  planeShieldElem.style.display = 'none';
  planeHasShield = false;

  uiPanel.classList.add('hidden');
  gameOverlay.classList.add('hidden');
  stopGameTimers();
  stopMissileSpawn();
  stopPowerupSpawn();
  // stopEnemyPlaneSpawn();

  document.getElementById('purple-bar-outer').style.display = 'none';
  document.getElementById('purple-bar-inner').style.width = '0%';
  purpleOrbContainer.innerHTML = '';
  purpleOrbContainer.style.display = 'none';
  maxUltimateLabel.style.display = 'none';

  heartCount = 0;
  updateHeartDisplay();

  flareCount = 0;
  updateFlareUI();

  currentLevel = 1;
  levelLabel.style.display = 'none';

  const headerName = document.getElementById('header-name-ldm');
  const menu = document.getElementById('menu');
  const aboutIntro = document.getElementById('about-me-intro-section');
  const mainContent = document.querySelector('main');
  const watermarks = document.querySelectorAll('.watermark');

  if (headerName) headerName.style.display = '';
  if (menu) menu.style.display = '';
  if (aboutIntro) aboutIntro.style.display = '';
  if (mainContent) mainContent.style.display = '';
  watermarks.forEach(w => w.style.display = '');

  startMeteorSpawn();
  document.getElementById('page-wrapper').style.zIndex = '8000';
});


let nextOrbScore = 100;

setInterval(() => {
  if (isGameMode && !planeDestroyed) {
    score++;
    gameTime++;
    checkLevelUp();
    updateLevelLabel();

    const barOuter = document.getElementById('purple-bar-outer');
    const barInner = document.getElementById('purple-bar-inner');
    barOuter.style.display = 'block';

    let currentCycleScore = score - (nextOrbScore - 100);
    if (currentCycleScore < 0) currentCycleScore = 0;
    let orbProgress = (currentCycleScore / 100) * 100;
    console.log("orbProgress: " + orbProgress)
    console.log("nextOrbScore: " + nextOrbScore)
    barInner.style.width = orbProgress + '%';
    barInner.style.background = 'purple';

    if (score >= nextOrbScore && purpleOrbCount < 3) {
      setTimeout(() => {
        addPurpleOrb();
        barInner.style.width = '0%';
        nextOrbScore += 100;
      }, 500);
    }
  }
}, 1000);

function addPurpleOrb() {
  const orb = document.createElement('div');
  orb.style.width = '20px';
  orb.style.height = '20px';
  orb.style.borderRadius = '50%';
  orb.style.background = 'purple';
  purpleOrbContainer.appendChild(orb);
  purpleOrbCount++;
  if (purpleOrbCount === 3) {
    maxUltimateLabel.style.display = 'block';
  } else {
    maxUltimateLabel.style.display = 'none';
  }
}

function updatePurpleOrbs() {
  purpleOrbContainer.innerHTML = '';
  for (let i = 0; i < purpleOrbCount; i++) {
    const orb = document.createElement('div');
    orb.style.width = '20px';
    orb.style.height = '20px';
    orb.style.borderRadius = '50%';
    orb.style.background = 'purple';
    purpleOrbContainer.appendChild(orb);
  }
  if (purpleOrbCount === 3) {
    maxUltimateLabel.style.display = 'block';
  } else {
    maxUltimateLabel.style.display = 'none';
  }
}

function updateFlareUI() {
  const flares = flareContainer.querySelectorAll('img');

  flares.forEach((img, index) => {
    if (index < flareCount) {
      img.src = 'assets/images/mini_game/final/flare.png';
      img.classList.remove('opacity-50');
    } else {
      img.src = 'assets/images/mini_game/placeholder/flare.png';
      img.classList.add('opacity-50');
    }
  });
}

document.addEventListener('click', (e) => {
  if (debugMode) return;
  if (isGameMode && !planeDestroyed && purpleOrbCount > 0) {
    purpleOrbCount--;
    updatePurpleOrbs();
    directionalPurpleWave();
  }
});

function directionalPurpleWave() {
  // Uçağın merkezi
  const rect = airplane.getBoundingClientRect();
  const centerX = (rect.left + rect.right) / 2;
  const centerY = (rect.top + rect.bottom) / 2;
  const offset = 20;
  const directAngleRad = directAngle * Math.PI / 180;
  const noseX = centerX + offset * Math.cos(directAngleRad);
  const noseY = centerY + offset * Math.sin(directAngleRad);

  const wave = document.createElement('div');
  wave.style.position = 'fixed';
  wave.style.width = '1200px';
  wave.style.height = '1800px';
  wave.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
  wave.style.background = 'rgba(200,0,255,0.3)';
  wave.style.zIndex = '12000';

  const offsetLeft = noseX - 600;
  const offsetTop = noseY;
  wave.style.left = offsetLeft + 'px';
  wave.style.top = offsetTop + 'px';

  let rotateDeg = directAngle - 90;
  wave.style.transformOrigin = '50% 0%';
  wave.style.transform = `rotate(${rotateDeg}deg)`;

  document.body.appendChild(wave);

  setTimeout(() => {
    wave.style.transition = 'opacity 1s ease-out';
    wave.style.opacity = '0';
  }, 50);
  setTimeout(() => wave.remove(), 1050);

  function rotatePoint(pt, angleRad) {
    return {
      x: pt.x * Math.cos(angleRad) - pt.y * Math.sin(angleRad),
      y: pt.x * Math.sin(angleRad) + pt.y * Math.cos(angleRad)
    };
  }
  const angleRadWave = rotateDeg * Math.PI / 180;
  const originLocal = { x: 600, y: 0 };
  const V1 = { x: 600, y: 0 };
  const V2 = { x: 0, y: 1800 };
  const V3 = { x: 1200, y: 1800 };

  function transformVertex(vertex) {
    let rel = { x: vertex.x - originLocal.x, y: vertex.y - originLocal.y };
    let rotated = rotatePoint(rel, angleRadWave);
    return { x: rotated.x + originLocal.x + offsetLeft, y: rotated.y + originLocal.y + offsetTop };
  }
  const globalV1 = transformVertex(V1);
  const globalV2 = transformVertex(V2);
  const globalV3 = transformVertex(V3);

  function pointInTriangle(p, a, b, c) {
    const areaOrig = Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
    const area1 = Math.abs((p.x * (a.y - b.y) + a.x * (b.y - p.y) + b.x * (p.y - a.y)) / 2);
    const area2 = Math.abs((p.x * (b.y - c.y) + b.x * (c.y - p.y) + c.x * (p.y - b.y)) / 2);
    const area3 = Math.abs((p.x * (c.y - a.y) + c.x * (a.y - p.y) + a.x * (p.y - c.y)) / 2);
    return Math.abs(area1 + area2 + area3 - areaOrig) < 1;
  }

  setTimeout(() => {
    const allObjs = [...document.querySelectorAll('.meteor, .missile, .plane')];
    allObjs.forEach(m => {
      let r = m.getBoundingClientRect();
      let cx = (r.left + r.right) / 2;
      let cy = (r.top + r.bottom) / 2;
      const p = { x: cx, y: cy };
      if (pointInTriangle(p, globalV1, globalV2, globalV3)) {
        triggerExplosion(cx, cy, "purple");
        m.remove();
      }
    });
  }, 500);
}

document.addEventListener('keydown', (e) => {
  if (e.code === "Space" && isGameMode && !planeDestroyed && flareCount > 0) {
    e.preventDefault();
    flareCount--;
    updateFlareUI();
    createFlareParticles();
  }
});

function createFlareParticles() {
  const duration = 5000;
  const intervalTime = 100;
  const startTime = Date.now();

  const emitter = setInterval(() => {
    if (planeDestroyed) {
      clearInterval(emitter);
      return;
    }

    const currentTime = Date.now();
    if (currentTime - startTime >= duration) {
      clearInterval(emitter);
      return;
    }
    for (let i = 0; i < 3; i++) {
      const rect = airplane.getBoundingClientRect();
      const centerX = (rect.left + rect.right) / 2;
      const centerY = (rect.top + rect.bottom) / 2;
      const oppositeAngleRad = (directAngle + 180) * Math.PI / 180;

      const angleVariation = (Math.random() - 0.5) * (Math.PI / 12);
      const particleAngle = oppositeAngleRad + angleVariation;

      const offsetDist = 30;
      const startX = centerX + offsetDist * Math.cos(oppositeAngleRad);
      const startY = centerY + offsetDist * Math.sin(oppositeAngleRad);

      const randomExtra = Math.random() * 100; // 0-50 px
      const extraX = randomExtra * Math.cos(particleAngle);
      const extraY = randomExtra * Math.sin(particleAngle);

      const orb = document.createElement('div');
      orb.classList.add("flare-particle");
      orb.style.position = 'fixed';
      orb.style.width = '8px';
      orb.style.height = '8px';
      orb.style.borderRadius = '50%';
      orb.style.background = 'rgba(23, 208, 240, 0.7)';
      orb.style.left = (startX + extraX) + 'px';
      orb.style.top = (startY + extraY) + 'px';
      orb.style.opacity = '1';
      document.body.appendChild(orb);

      setTimeout(() => {
        orb.style.transition = 'opacity 2s, transform 2s';
        const driftX = 20 * Math.cos(particleAngle);
        const driftY = 20 * Math.sin(particleAngle);
        orb.style.transform = `translate(${driftX}px, ${driftY}px)`;
        orb.style.opacity = '0';
      }, 50);
      setTimeout(() => orb.remove(), 2050);
    }

  }, intervalTime);
}

function checkMissileFlareCollision() {
  const missiles = [...document.querySelectorAll('img[data-type="missile"]')];
  const flareParticles = [...document.querySelectorAll('.flare-particle')];

  missiles.forEach(m => {
    let mr = m.getBoundingClientRect();
    let mCenterX = (mr.left + mr.right) / 2;
    let mCenterY = (mr.top + mr.bottom) / 2;

    flareParticles.forEach(p => {
      let pr = p.getBoundingClientRect();
      let pCenterX = (pr.left + pr.right) / 2;
      let pCenterY = (pr.top + pr.bottom) / 2;
      let dist = Math.hypot(mCenterX - pCenterX, mCenterY - pCenterY);

      if (dist < 10) {
        triggerExplosion(mCenterX, mCenterY, "pink");
        m.remove();
      }
    });
  });

  requestAnimationFrame(checkMissileFlareCollision);
}

checkMissileFlareCollision();