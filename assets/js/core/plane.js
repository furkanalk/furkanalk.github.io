const cursorCircle = document.getElementById('cursor-circle');
const airplane = document.getElementById('airplane');

let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
let airplaneX = targetX, airplaneY = targetY;
let lastAngle = 0;
let planeDestroyed = false;
let directAngle = 0;

function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  return a + diff * t;
}

// track mouse
document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
  let newAngle = Math.atan2(e.movementY, e.movementX);
  if (!isNaN(newAngle)) {
    lastAngle = lerpAngle(lastAngle, newAngle, 0.2);
  }
  cursorCircle.style.left = targetX + 'px';
  cursorCircle.style.top = targetY + 'px';
});

let frameCounter = 0;
const MAX_SPEED = 4;

function animateAirplane() {
  const circleRadius = 20;
  const gap = 20;
  const desiredDistance = circleRadius + gap;

  const desiredX = targetX + desiredDistance * Math.cos(lastAngle);
  const desiredY = targetY + desiredDistance * Math.sin(lastAngle);

  let vx = (desiredX - airplaneX) * 0.025;
  let vy = (desiredY - airplaneY) * 0.025;
  let currentSpeed = Math.hypot(vx, vy);

  if (currentSpeed > MAX_SPEED) {
    const scale = MAX_SPEED / currentSpeed;
    vx *= scale;
    vy *= scale;
  }

  airplaneX += vx;
  airplaneY += vy;

  airplane.style.left = airplaneX + 'px';
  airplane.style.top = airplaneY + 'px';

  // sheild
  if (planeShieldElem) {
    planeShieldElem.style.left = airplaneX + 'px';
    planeShieldElem.style.top = airplaneY + 'px';
    planeShieldElem.style.transform = 'translate(-50%,-50%)';
  }
  // rotate plane
  const angle = Math.atan2(targetY - airplaneY, targetX - airplaneX) * 180 / Math.PI;
  directAngle = angle;
  airplane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

  // flame
  frameCounter++;
  if (!planeDestroyed && frameCounter % 3 === 0) {
    createFlameParticle(airplaneX, airplaneY, angle);
  }
  requestAnimationFrame(animateAirplane);
}
animateAirplane();