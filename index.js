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

const categories = `
waifu       
neko
shinobu
megumin
bullyW
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
cringe`;

client.on("message", async (message) => {
  const url = `https://api.waifu.pics`;
  if (message.body.match(/que categorias hay/i)) {
    message.reply(`Podes consultar las siguientes categorias:
    ${categories}`);
  }
  if (message.body.match(/quiero una/i) || message.body.match(/quiero un/i)) {
    const category = message.body.split(" ").pop();
    console.log(category);
    if (categories.search(category) != -1) {
      console.log("existe");
    } else {
      console.log("no existe");
    }
    const response = await fetch(`${url}/sfw/neko`);
    // const response = await fetch(`${url}/sfw/${category}`);
    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      const media = await MessageMedia.fromUrl(data.url);
      console.log(media);
      await client.sendMessage(message.id.remote, media);
    } else {
    }
  }
});

client.initialize();
