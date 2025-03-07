currentPlanes = 0;
currentMissiles = 0;

function createEntityElement(type) {
  const img = document.createElement("img");
  let src;

  if (type === "missile") {
    src = "assets/images/mini_game/final/missile.png";
    img.setAttribute("data-type", "missile");
    img.style.width = "35px";
    img.style.height = "20px";
    currentMissiles++;
  } else if (type === "plane") {
    const options =
      [
        "assets/images/mini_game/final/enemy_plane_one.png",
        "assets/images/mini_game/final/enemy_plane_two.png",
        "assets/images/mini_game/final/enemy_plane_three.png"
      ];
    src = options[Math.floor(Math.random() * options.length)];
    img.setAttribute("data-type", "plane");
    img.style.width = "50px";
    img.style.height = "40px";
    currentPlanes++;
  } else if (type === "powerup") {
    src = "assets/images/mini_game/final/sheild.png";
    img.setAttribute("data-type", "powerup");
    img.style.width = "32px";
    img.style.height = "32px";
  } else if (type === "heart") {
    src = "assets/images/mini_game/final/heart.png";
    img.setAttribute("data-type", "heart");
    img.style.width = "32px";
    img.style.height = "32px";
  } else if (type === "flare") {
    src = "assets/images/mini_game/final/flare.png";
    img.setAttribute("data-type", "flare");
    img.style.width = "32px";
    img.style.height = "32px";
  } else {
    src = "assets/images/mini_game/svg/default.svg";
  }

  img.src = src;
  img.style.position = "fixed";
  img.style.pointerEvents = "none";
  img.style.zIndex = "5000";
  return img;
}

function createSpecialObject(type) {
  const img = createEntityElement(type);

  img.classList.add("meteor");

  const edge = Math.floor(Math.random() * 4);
  let startX, startY;
  if (edge === 0) {
    startX = -50;
    startY = Math.random() * window.innerHeight;
  } else if (edge === 1) {
    startX = window.innerWidth + 50;
    startY = Math.random() * window.innerHeight;
  } else if (edge === 2) {
    startX = Math.random() * window.innerWidth;
    startY = -50;
  } else {
    startX = Math.random() * window.innerWidth;
    startY = window.innerHeight + 50;
  }
  img.style.left = startX + "px";
  img.style.top = startY + "px";

  const scale = Math.random() * 0.3 + 0.7;
  img.style.transformOrigin = "center center";

  document.body.appendChild(img);

  if (type === "plane") {
    let endX = (edge === 0) ? window.innerWidth + 50 :
      (edge === 1) ? -50 :
        Math.random() * window.innerWidth;
    let endY = (edge === 2) ? window.innerHeight + 50 :
      (edge === 3) ? -50 :
        Math.random() * window.innerHeight;

    let dx = endX - startX;
    let dy = endY - startY;
    let planeAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    img.style.transform = `translate(-50%,-50%) rotate(${planeAngle}deg) scale(${scale})`;

    // let duration = (typeof currentLevel !== "undefined" && currentLevel >= 3)
    //  	? (Math.random() * 7 + 3)
    //  	: (Math.random() * 10 + 5);
    let duration = (Math.random() * 10 + 5);
    if (typeof currentLevel !== "undefined") {
      img.style.transition = `transform ${duration}s linear`;
      setTimeout(() => {
        img.style.transform = `translate(${dx}px,${dy}px) rotate(${planeAngle}deg) scale(${scale})`;
      }, 50);

      img.addEventListener("transitionend", () => img.remove());
      if (currentPlanes > 0) currentPlanes--;
    }

  } else if (type === "missile") {
    let missileX = startX, missileY = startY;
    let headingAngle = 0;
    let isLockedOn = true;
    const lockDistance = 50;

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

        if (distance < lockDistance) {
          isLockedOn = false;
          if (typeof isGameMode !== "undefined" && isGameMode) {
            score += 10;
            scoreValueElem.textContent = score.toString();
          }
        }
      }
      let speed = (typeof currentLevel !== "undefined" && currentLevel >= 3) ? 2.5 : 2.0;
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

  } else {
    const endX = (edge === 0) ? window.innerWidth + 50 :
      (edge === 1) ? -50 :
        Math.random() * window.innerWidth;
    const endY = (edge === 2) ? window.innerHeight + 50 :
      (edge === 3) ? -50 :
        Math.random() * window.innerHeight;
    let duration = Math.random() * 15 + 10;
    if (typeof currentLevel !== "undefined" && currentLevel >= 4 && type === "flare") {
      duration = Math.random() * 12 + 6;
    }
    img.style.transition = `transform ${duration}s linear`;
    setTimeout(() => {
      const dx = endX - startX;
      const dy = endY - startY;
      img.style.transform = `translate(${dx}px,${dy}px) scale(${scale})`;
    }, 50);

    img.addEventListener("transitionend", () => img.remove());
  }

  return img;
}