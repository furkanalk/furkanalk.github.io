function createRandomMeteor() {
  const svgNS = "http://www.w3.org/2000/svg";
  const meteorSVG = document.createElementNS(svgNS, "svg");
  const n = Math.floor(Math.random() * 4) + 5;
  let pointsArray = [];

  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI;
    const radius = Math.random() * 10 + 10;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    pointsArray.push({ x, y });
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  pointsArray.forEach(pt => {
    if (pt.x < minX) minX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y > maxY) maxY = pt.y;
  });

  const shiftedPoints = pointsArray.map(pt => ({
    x: pt.x - minX,
    y: pt.y - minY
  }));
  const pointsStr = shiftedPoints.map(pt => `${pt.x},${pt.y}`).join(" ");
  const width = maxX - minX;
  const height = maxY - minY;

  meteorSVG.setAttribute("viewBox", `0 0 ${width} ${height}`);
  meteorSVG.style.width = `${width}px`;
  meteorSVG.style.height = `${height}px`;

  const polygon = document.createElementNS(svgNS, "polygon");
  polygon.setAttribute("points", pointsStr);

  const colorChance = Math.random();
  if (colorChance < 0.5) {
    polygon.setAttribute("fill", "#fff");
  } else {
    const grayVal = Math.floor(Math.random() * 100) + 100;
    polygon.setAttribute("fill", `rgba(${grayVal}, ${grayVal}, ${grayVal}, 0.5)`);
  }

  polygon.setAttribute("stroke", "#888");
  polygon.setAttribute("stroke-width", "2");
  meteorSVG.appendChild(polygon);
  meteorSVG.classList.add("meteor");

  const edge = Math.floor(Math.random() * 4);
  let startX, startY, endX, endY;
  if (edge === 0) {
    startX = -50;
    startY = Math.random() * window.innerHeight;
    endX = window.innerWidth + 50;
    endY = Math.random() * window.innerHeight;
  } else if (edge === 1) {
    startX = window.innerWidth + 50;
    startY = Math.random() * window.innerHeight;
    endX = -50;
    endY = Math.random() * window.innerHeight;
  } else if (edge === 2) {
    startX = Math.random() * window.innerWidth;
    startY = -50;
    endX = Math.random() * window.innerWidth;
    endY = window.innerHeight + 50;
  } else {
    startX = Math.random() * window.innerWidth;
    startY = window.innerHeight + 50;
    endX = Math.random() * window.innerWidth;
    endY = -50;
  }

  meteorSVG.style.position = "fixed";
  meteorSVG.style.left = startX + "px";
  meteorSVG.style.top = startY + "px";
  meteorSVG.style.zIndex = "5000";

  const duration = Math.random() * 10 + 5;
  meteorSVG.style.transition = `transform ${duration}s linear`;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  setTimeout(() => {
    meteorSVG.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }, 50);

  meteorSVG.addEventListener("transitionend", () => {
    meteorSVG.remove();
  });

  document.body.appendChild(meteorSVG);
  return meteorSVG;
}