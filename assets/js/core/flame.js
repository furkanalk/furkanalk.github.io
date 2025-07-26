function createFlameParticle(baseX, baseY, angleDeg) {
  const offsetDist = 22;
  const offsetRad = angleDeg * Math.PI / 180;
  const x = baseX - offsetDist * Math.cos(offsetRad);
  const y = baseY - offsetDist * Math.sin(offsetRad);

  const flame = document.createElement('div');
  flame.style.position = 'fixed';
  flame.style.width = '7px';
  flame.style.height = '5px';
  flame.style.background = 'rgba(108, 108, 108, 0.6)';
  flame.style.zIndex = '9999';
  flame.style.pointerEvents = 'none';
  flame.style.opacity = '1';
  flame.style.borderRadius = '50%';
  flame.style.left = x + 'px';
  flame.style.top = y + 'px';
  flame.style.transform = `translate(-50%, -50%) rotate(${angleDeg + 180}deg)`;

  document.body.appendChild(flame);

  let startTime = null;
  const totalDuration = 500;

  const vibrationInterval = setInterval(() => {
    let blurValue = Math.random() * 3;
    let jitterX = (Math.random() - 0.5) * 2;
    let jitterY = (Math.random() - 0.5) * 2;
    flame.style.filter = `blur(${blurValue}px)`;
    flame.style.transform = `translate(calc(-50% + ${jitterX}px), calc(-50% + ${jitterY}px)) rotate(${angleDeg + 180}deg)`;
  }, 50);

  function fadeOut(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = elapsed / totalDuration;

    flame.style.opacity = (1 - progress).toString();

    const rad = (angleDeg + 180) * Math.PI / 180;
    const drift = 15 * progress;
    const driftX = drift * Math.cos(rad);
    const driftY = drift * Math.sin(rad);
    flame.style.transform = `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) rotate(${angleDeg + 180}deg)`;

    if (progress < 1) {
      requestAnimationFrame(fadeOut);
    } else {
      clearInterval(vibrationInterval);
      flame.remove();
    }
  }
  requestAnimationFrame(fadeOut);
}