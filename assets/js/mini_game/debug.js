const debugMode = false;

if (debugMode) {
  const debugPanel = document.createElement("div");
  debugPanel.id = "debug-panel";
  debugPanel.style.position = "fixed";
  debugPanel.style.bottom = "0";
  debugPanel.style.left = "0";
  debugPanel.style.background = "rgba(0,0,0,0.7)";
  debugPanel.style.color = "#fff";
  debugPanel.style.padding = "10px";
  debugPanel.style.zIndex = "20000";
  debugPanel.style.fontFamily = "monospace";

  const entityTypes = ["missile", "plane", "powerup", "heart", "flare", "meteor", "purpleOrb"];
  entityTypes.forEach(type => {
    const btn = document.createElement("button");
    btn.textContent = "Spawn " + type;
    btn.style.marginRight = "5px";
    btn.style.marginBottom = "5px";
    btn.style.padding = "5px 10px";
    btn.style.fontSize = "0.9rem";

    btn.addEventListener("click", () => {
      if (type === "purpleOrb") {
        addPurpleOrb();

      } else if (type === "meteor") {
        createRandomMeteor();
      } else {
        createSpecialObject(type);
      }
    });
    debugPanel.appendChild(btn);
  });
  document.body.appendChild(debugPanel);
}
