const mineflayer = require("mineflayer");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

function createBot() {
  const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.name,
    version: config.version,
  });

  bot.on("error", (err) => {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
      console.log(
        "[BOT] Connection failed: The server is offline, the IP/port is incorrect, or your host is blocking the connection."
      );
    } else {
      console.log("[BOT] Error:", err);
    }
  });

 bot.on("login", () => {
  console.log(`[BOT] Logged in as ${bot.username}`);

  setTimeout(() => {
    bot.chat("/login goybeam");
  }, 3000);
});

  function randomMove() {
    if (!bot.entity) return;

    const yaw = Math.random() * Math.PI * 2;
    const pitch = ((Math.random() - 0.5) * Math.PI) / 2;
    bot.look(yaw, pitch, true);

    const actions = ["forward", "back", "left", "right"];
    actions.forEach((action) => bot.setControlState(action, false));
    if (Math.random() > 0.5) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      bot.setControlState(action, true);
      setTimeout(
        () => bot.setControlState(action, false),
        1000 + Math.random() * 2000
      );
    }
  }

  const moveInterval = setInterval(randomMove, 5000 + Math.random() * 5000);

  function reconnect() {
    console.clear();
    clearInterval(moveInterval);
    console.log("[BOT] Disconnected, reconnecting in 5s...");
    // setTimeout(createBot, 5000);
  }
  bot.on("end", reconnect);
  bot.on("kicked", reconnect);
}

createBot();

try {
  require("./keep_alive");
} catch (e) {}
console.log("[BOT] Keep alive module not found, continuing without it.");
