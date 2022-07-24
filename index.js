//wp web api
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const fetch = require("node-fetch");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    product: "chrome",
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("authenticated", (session) => {
  console.log("tas autenticao");
});

const categories = `waifu, neko, shinobu, megumin, bullyW, cuddle, cry, hug, awoo, kiss, lick, pat, smug, bonk, yeet, blush, smile, wave, highfive, handhold, nom, bite, glomp, slap, kill, kick, happy, wink, poke, dance, cringe`;

const categoriesArray = categories.split(", ");

client.on("message", async (message) => {
  const url = `https://api.waifu.pics`;
  if (message.body.match(/que categorias hay/i)) {
    message.reply(`Podes consultar las siguientes categorias: ${categories}`);
  }
  if (message.body.match(/quiero una/i) || message.body.match(/quiero un/i)) {
    const category = message.body.split(" ").pop();
    console.log(category);
    if (categoriesArray.indexOf(category) === -1) {
      console.log("no existe");
      message.reply("No se que es eso manito");
    } else {
      console.log("existe");
      try {
        const response = await fetch(`https://api.waifu.pics/sfw/${category}`);
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          const media = await MessageMedia.fromUrl(data.url);
          console.log(media);
          client.sendMessage(message.id.remote, media);
        } else {
          message.reply("aca hay un error con la api manito");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
});

client.initialize();
