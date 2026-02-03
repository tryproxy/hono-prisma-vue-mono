import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");

const bot = new Bot(token); // (https://t.me/BotFather)

// Reply to any message with "Hi there!".

bot.command("start", (ctx) => ctx.reply("yo"));
bot.command("hello", async (ctx) => {
  const from = `id:${ctx.from?.id} user:${ctx.from?.username}`;
  const reply = await fetch(`${API_BASE_URL}/api/hello`).then((r) => r.json());
  ctx.reply(`${from} \n ${reply.message}`);
});
bot.command("ping", async (ctx) => {
  const data = await fetch(`${API_BASE_URL}/api/db-ping`).then((r) => r.json());
  const from = `id:${ctx.from?.id} user:${ctx.from?.username}`;
  const reply = `DB: ${data.ping.id} @ ${data.ping.createdAt}`;
  ctx.reply(`${from} \n ${reply}`);
});
bot.on("message", (ctx) => ctx.reply("Hi there!"));

await bot.api.setMyCommands([
  {
    command: "start",
    description: "Start the bot",
  },
  {
    command: "hello",
    description: "api/hello",
  },
  {
    command: "ping",
    description: "Ping DB",
  },
]);

bot.start();
