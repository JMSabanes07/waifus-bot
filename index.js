//wp web api
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const fetch = require("node-fetch");
const { Wit, log } = require("node-wit");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    // product: "chrome",
    // executablePath: "/usr/bin/chromium-browser",
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

const categories = `waifu, neko, shinobu, megumin, bully, cuddle, cry, hug, awoo, kiss, lick, pat, smug, bonk, yeet, blush, smile, wave, highfive, handhold, nom, bite, glomp, slap, kill, kick, happy, wink, poke, dance, cringe`;

const categoriesArray = categories.split(", ");

const refactoryResponse = (res) => {
  const refactoryAmount = (amount) => {
    if (amount === "una") return 1;
    if (amount === "unas") return 3;
    if (amount === "un par") return 2;
    if (amount === "algunas") return 3;
    if (amount === "bastantes") return 4;
    if (amount === "muchas") return 5;
    return amount;
  };

  return {
    intent: res.intents[0] && res.intents[0].name,
    category:
      res.entities["category:category"] &&
      refactoryAmount(res.entities["category:category"][0].value),
    amount:
      res.entities["wit$number:number"] &&
      res.entities["wit$number:number"][0].value,
    action:
      res.entities["action:action"] && res.entities["action:action"][0].value,
    key: res.entities["key:key"] && res.entities["key:key"][0].value,
  };
};

client.on("message", async (message) => {
  if (message.type === "sticker") return console.log("sticker");
  console.log(message.mentionedIds[0]);

  const witClient = new Wit({
    accessToken: "3ZYAKBYYWLHG22JPW53WU4KDZ6MWQIOC",
    actions: {},
    logger: new log.Logger(log.DEBUG), // optional
  });

  const response = await witClient.message(message.body);
  const data = refactoryResponse(response);
  console.log(data);

  const url = `https://api.waifu.pics`;

  if (data.action && data.key) {
    message.reply(`Podes consultar las siguientes categorias: ${categories}`);
    return;
  }
  if (!data.category || !data.action) return;
  if (categoriesArray.indexOf(data.category) === -1) {
    console.log("no existe");
    message.reply("No se que es eso manito");
    return;
  }

  console.log("existe");
  try {
    client.sendMessage(message.id.remote, "Ok papu");
    if (data.amount) {
      for (let i = 0; i < data.amount; i++) {
        const response = await fetch(
          `https://api.waifu.pics/sfw/${data.category}`
        );
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          const media = await MessageMedia.fromUrl(data.url);
          // console.log(media);
          // client.sendMessage(message.id.remote, media);
          client.sendMessage(
            message.mentionedIds[0]
              ? message.mentionedIds[0]
              : message.id.remote,
            media
          );
        } else {
          message.reply("aca hay un error con la api manito");
        }
      }
    } else {
      const response = await fetch(
        `https://api.waifu.pics/sfw/${data.category}`
      );
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        const media = await MessageMedia.fromUrl(data.url);
        client.sendMessage(message.id.remote, media);
        console.log(message.id.remote, message.mentionedIds[0]);
        // client.sendMessage(
        //   message.mentionedIds[0] ? message.mentionedIds[0] : message.id.remote,
        //   media
        // );
      } else {
        message.reply("aca hay un error con la api manito");
      }
    }
  } catch (error) {
    console.log(error);
  }

  // const url = `https://api.waifu.pics`;
  // if (message.body.match(/que categorias hay/i)) {
  //   message.reply(`Podes consultar las siguientes categorias: ${categories}`);
  // }
  // if (message.body.match(/quiero una/i) || message.body.match(/quiero un/i)) {
  //   const category = message.body.split(" ").pop();
  //   console.log(category);
  //   if (categoriesArray.indexOf(category) === -1) {
  //     console.log("no existe");
  //     message.reply("No se que es eso manito");
  //   } else {
  //     console.log("existe");
  //     try {
  //       const response = await fetch(`https://api.waifu.pics/sfw/${category}`);
  //       if (response.status === 200) {
  //         const data = await response.json();
  //         console.log(data);
  //         const media = await MessageMedia.fromUrl(data.url);
  //         console.log(media);
  //         client.sendMessage(message.id.remote, media);
  //       } else {
  //         message.reply("aca hay un error con la api manito");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }
});

client.initialize();
