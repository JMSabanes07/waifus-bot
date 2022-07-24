//wp web api
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const fetch = require("node-fetch");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { product: "chrome", executablePath: "/usr/bin/chromium-browser" },
});

client.on("qr", qr => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async message => {
  const url = `https://api.waifu.pics`;
  if (message.body.match(/que categorias hay/i)) {
    message.reply(`Podes consultar las siguientes categorias:
    waifu       
    neko
    shinobu
    megumin
    bully
    cuddle
    cry
    hug
    awoo
    kiss
    lick
    pat
    smug
    bonk
    yeet
    blush
    smile
    wave
    highfive
    handhold
    nom
    bite
    glomp
    slap
    kill
    kick
    happy
    wink
    poke
    dance
    cringe`);
  }
  if (message.body.match(/quiero una/i) || message.body.match(/quiero un/i)) {
    const category = message.body.split(" ").pop();
    const response = await fetch(`${url}/sfw/${category}`);
    const data = await response.json();
    const media = await MessageMedia.fromUrl(data.url);
    await client.sendMessage(message.id.remote, media);
  }
});

client.on("authenticated", session => {
  console.log("tas autenticao");
});

client.initialize();
