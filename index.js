/*
   Created By ArxzyDev
   My Contact wa.me/6289513081052
   
   Recode By Arifzyn.
   My Contact wa.me/19092943916
*/

require("./settings");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const chalk = require("chalk");
const FileType = require("file-type");
const path = require("path");
const axios = require("axios");
const PhoneNumber = require("awesome-phonenumber");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
} = require("./lib/exif");
const {
  smsg,
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  fetch,
  await,
  sleep,
  reSize,
} = require("./lib/myfunc");
const {
  default: connConnect,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
  proto,
} = require("@whiskeysockets/baileys");
const readline = require("readline");
const NodeCache = require("node-cache");
const msgRetryCounterCache = new NodeCache();

const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

const pairingCode = process.argv.includes("--pairing");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(`./session`);

  const conn = connConnect({
    printQRInTerminal: !pairingCode,
    logger: pino({
      level: "silent",
    }),
    browser: ["Chrome (Linux)", "", ""],
    auth: state,
    msgRetryCounterCache,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true,
  });

  if (pairingCode && !conn.authState.creds.registered) {
    console.log(chalk.cyan("╭──────────────────────────────────────···"));
    console.log(`📨 ${chalk.redBright("Please type your WhatsApp number")}:`);
    console.log(chalk.cyan("├──────────────────────────────────────···"));
    let phoneNumber = await question(`   ${chalk.cyan("- Number")}: `);
    console.log(chalk.cyan("╰──────────────────────────────────────···"));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    if (!Object.keys(PHONENUMBER_MCC).some((v) => phoneNumber.startsWith(v))) {
      console.log(
        chalk.cyan("╭─────────────────────────────────────────────────···"),
      );
      console.log(
        `💬 ${chalk.redBright(
          "Start with your country's WhatsApp code, Example 62xxx",
        )}:`,
      );
      console.log(
        chalk.cyan("╰─────────────────────────────────────────────────···"),
      );
      console.log(chalk.cyan("╭──────────────────────────────────────···"));
      console.log(`📨 ${chalk.redBright("Please type your WhatsApp number")}:`);
      console.log(chalk.cyan("├──────────────────────────────────────···"));
      phoneNumber = await question(`   ${chalk.cyan("- Number")}: `);
      console.log(chalk.cyan("╰──────────────────────────────────────···"));
      phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    }
    let code = await conn.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(chalk.cyan("╭──────────────────────────────────────···"));
    console.log(` 💻 ${chalk.redBright("Your Pairing Code")}:`);
    console.log(chalk.cyan("├──────────────────────────────────────···"));
    console.log(`   ${chalk.cyan("- Code")}: ${code}`);
    console.log(chalk.cyan("╰──────────────────────────────────────···"));
    rl.close();
  }

  store.bind(conn.ev);

  conn.ev.on("messages.upsert", async (chatUpdate) => {
    //console.log(JSON.stringify(chatUpdate, undefined, 2))
    try {
      mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message =
        Object.keys(mek.message)[0] === "ephemeralMessage"
          ? mek.message.ephemeralMessage.message
          : mek.message;
      if (mek.key && mek.key.remoteJid === "status@broadcast") return;
      if (!conn.public && !mek.key.fromMe && chatUpdate.type === "notify")
        return;
      if (mek.key.id.startsWith("BAE5") && mek.key.id.length === 16) return;
      if (mek.key.id.startsWith("FatihArridho_")) return;
      m = smsg(conn, mek, store);
      require("./Arifzyn")(conn, m, chatUpdate, store);
    } catch (err) {
      console.log(err);
    }
  });

  conn.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };

  conn.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = conn.decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = {
          id,
          name: contact.notify,
        };
    }
  });

  conn.getName = (jid, withoutContact = false) => {
    id = conn.decodeJid(jid);
    withoutContact = conn.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = conn.groupMetadata(id) || {};
        resolve(
          v.name ||
            v.subject ||
            PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
              "international",
            ),
        );
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === conn.decodeJid(conn.user.id)
          ? conn.user
          : store.contacts[id] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
        "international",
      )
    );
  };

  conn.sendContact = async (jid, kon, quoted = "", opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await conn.getName(i + "@s.whatsapp.net"),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(
          i + "@s.whatsapp.net",
        )}\nFN:${await conn.getName(
          i + "@s.whatsapp.net",
        )}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:creator@conndev.xyz\nitem2.X-ABLabel:Email\nitem3.URL:https://profile.conndev.xyz\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    conn.sendMessage(
      jid,
      {
        contacts: { displayName: `${list.length} Kontak`, contacts: list },
        ...opts,
      },
      { quoted },
    );
  };

  conn.public = true;

  conn.serializeM = (m) => smsg(conn, m, store);

  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    try {
      if (connection === "close") {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (reason === DisconnectReason.badSession) {
          console.log(`Bad Session File, Please Delete Session and Scan Again`);
          connectToWhatsApp();
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log("Connection closed, reconnecting....");
          connectToWhatsApp();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log("Connection Lost from Server, reconnecting...");
          connectToWhatsApp();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log(
            "Connection Replaced, Another New Session Opened, Please Close Current Session First",
          );
          connectToWhatsApp();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(`Device Logged Out, Please Scan Again And Run.`);
          connectToWhatsApp();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log("Restart Required, Restarting...");
          connectToWhatsApp();
        } else if (reason === DisconnectReason.timedOut) {
          console.log("Connection TimedOut, Reconnecting...");
          connectToWhatsApp();
        } else conn.end(`Unknown DisconnectReason: ${reason}|${connection}`);
      }
      if (
        update.connection == "connecting" ||
        update.receivedPendingNotifications == "false"
      ) {
        console.log(`[Sedang mengkoneksikan]`);
      }
      if (
        update.connection == "open" ||
        update.receivedPendingNotifications == "true"
      ) {
        console.log(`[Connecting to] WhatsApp web`);
        console.log(`[Connected] ` + JSON.stringify(conn.user, null, 2));
      }
    } catch (err) {
      console.log("Error Di Connection.update " + err);
      connectToWhatsApp();
    }
  });

  conn.ev.on("creds.update", saveCreds);

  conn.sendText = (jid, text, quoted = "", options) =>
    conn.sendMessage(
      jid,
      {
        text: text,
        ...options,
      },
      {
        quoted,
        ...options,
      },
    );
  conn.sendImage = async (jid, path, caption = "", quoted = "", options) => {
    let buffer = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split`,`[1], "base64")
      : /^https?:\/\//.test(path)
      ? await await getBuffer(path)
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);
    return await conn.sendMessage(
      jid,
      {
        image: buffer,
        caption: caption,
        ...options,
      },
      {
        quoted,
      },
    );
  };
  conn.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
    conn.sendMessage(
      jid,
      {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(
          (v) => v[1] + "@s.whatsapp.net",
        ),
        ...options,
      },
      {
        quoted,
      },
    );
  conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split`,`[1], "base64")
      : /^https?:\/\//.test(path)
      ? await await getBuffer(path)
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }

    await conn.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    );
    return buffer;
  };
  conn.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split`,`[1], "base64")
      : /^https?:\/\//.test(path)
      ? await await getBuffer(path)
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }

    await conn.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    );
    return buffer;
  };
  conn.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true,
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? filename + "." + type.ext : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  conn.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
  };
  return conn;
};

connectToWhatsApp();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
