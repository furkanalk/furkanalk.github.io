let missileSpawnInterval;
let powerupSpawnInterval;
let enemyPlaneInterval;
let meteorSpawnInterval;

setInterval(()=>{
  if(debugMode || document.hidden || isGameLive) return;
  if(currentLevel>=5) {
    createRandomMeteor();
  }
  createRandomMeteor();
},300);

setInterval(()=>{
  if(websiteMode)
    createSpecialObject("plane");
},3500);

function startMeteorSpawn(){
  if(websiteMode) {
    meteorSpawnInterval = setInterval(() => {
      createRandomMeteor();
    }, 300);  
  }
}
function startMissileSpawn(){
  if (currentMissiles < 8) {
    missileSpawnInterval = setInterval(() => {
      createSpecialObject("missile");
    }, 3000);  
  }
}
function startEnemyPlaneSpawn(){
  if (currentPlanes < 5) {
    enemyPlaneInterval = setInterval(() => {
      createSpecialObject("plane");
    }, 3000);
  }
}
function startPowerupSpawn(){
  powerupSpawnInterval = setInterval(() => {
    let rnd = Math.random();
    if (rnd < 0.6) {
      createSpecialObject("powerup");
    } else if (rnd < 0.7) {
      if (heartCount < 3) {
        createSpecialObject("heart");
      }
    } else {
      if (flareCount < 3) {
        createSpecialObject("flare");
      }
    }
  }, 20000);
}
function stopMeteorSpawn(){
  clearInterval(meteorSpawnInterval);
}
function stopMissileSpawn(){
  clearInterval(missileSpawnInterval);
}
function stopEnemyPlaneSpawn(){
  clearInterval(enemyPlaneInterval);
}
function stopPowerupSpawn(){
  clearInterval(powerupSpawnInterval);
}

function startSpawns() {
  if (!debugMode && isGameMode && !isGameLive && !planeDestroyed && !document.hidden) {
    startMissileSpawn();
    startPowerupSpawn();
    startEnemyPlaneSpawn();
  }
}