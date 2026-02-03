import { Bot, Context, InlineKeyboard, session, SessionFlavor } from "grammy";
import { messages } from "./i18n/en";

type BotStep = {
  step: "idle" | "item" | "qty" | "confirm";
  answer: Record<string, unknown>;
};
type BotContext = Context & SessionFlavor<BotStep>;

const token = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
const bot = new Bot<BotContext>(token); // (https://t.me/BotFather)

bot.use(
  session({
    initial: (): BotStep => ({
      step: "item",
      answer: {},
    }),
  }),
);

bot.command("create", async (ctx) => {
  ctx.session = { step: "item", answer: {} };
  const [itemA, itemB] = messages.product;
  const kb = new InlineKeyboard()
    .text(itemA.name, itemA.label)
    .text(itemB.name, "item:B");

  await ctx.reply(messages.steps.create, { reply_markup: kb });
});

bot.callbackQuery("item:A", async (ctx) => {
  await handleItemChoice(ctx, "A");
});

bot.callbackQuery("item:B", async (ctx) => {
  await handleItemChoice(ctx, "B");
});

async function handleItemChoice(ctx: BotContext, type: "A" | "B") {
  if (ctx.session.step !== "item") return ctx.answerCallbackQuery();
  ctx.session.answer = {
    ...ctx.session.answer,
    item: messages.product.filter((p) => p.label.includes(`item:${type}`))[0],
  };
  ctx.session.step = "qty";
  await ctx.answerCallbackQuery();
  await ctx.reply(messages.steps.item);
}

bot.command("start", (ctx) => ctx.reply("yo"));

// bot.command("hello", async (ctx) => {
//   const from = `id:${ctx.from?.id} user:${ctx.from?.username}`;
//   const reply = await fetch(`${API_BASE_URL}/api/hello`).then((r) => r.json());
//   ctx.reply(`${from} \n ${reply.message}`);
// });

bot.command("ping", async (ctx) => {
  const data = await fetch(`${API_BASE_URL}/api/db-ping`).then((r) => r.json());
  const from = `id:${ctx.from?.id} user:${ctx.from?.username}`;
  const reply = `DB: ${data.ping.id} @ ${data.ping.createdAt}`;
  ctx.reply(`${from} \n ${reply}`);
});

bot.command("webapp", async (ctx) => {
  const kb = new InlineKeyboard().webApp(
    "Open web app",
    "https://hono-prisma-vue-mono.vercel.app/",
  );

  await ctx.reply("?", { reply_markup: kb });
});

bot.on("message", (ctx) => {
  const input = ctx.message?.text?.trim();
  if (!input) return;

  const { step } = ctx.session;

  if (step === "idle") {
    ctx.reply(messages.wildcard);
  }

  // if (step === "item") {
  //   ctx.session.answer = { ...ctx.session.answer, item: input };
  //   ctx.session.step = "qty";
  //   return ctx.reply(messages.steps.item);
  // }

  if (step === "qty") {
    ctx.session.answer = { ...ctx.session.answer, qty: input };
    ctx.session.step = "confirm";
    return ctx.reply(`${messages.steps.qty(ctx.session.answer)}`);
  }

  function validateSubmitMsg(msg: string) {
    return messages.confirm.yesList.includes(msg.toLowerCase());
  }

  if (step === "confirm") {
    if (validateSubmitMsg(input)) {
      // API
      ctx.session = { step: "idle", answer: {} };
      return ctx.reply(messages.submit);
    }

    ctx.session = { step: "idle", answer: {} };
    return ctx.reply(messages.cancel);
  }
});

await bot.api.setMyCommands([
  {
    command: "create",
    description: messages.wildcard,
  },
  // {
  //   command: "start",
  //   description: "Start the bot",
  // },
  // {
  //   command: "hello",
  //   description: "api/hello",
  // },
  // {
  //   command: "ping",
  //   description: "Ping DB",
  // },
  // {
  //   command: "webapp",
  //   description: "Open web app",
  // },
]);

bot.start();
