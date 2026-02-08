import { Bot, Context, InlineKeyboard, session, SessionFlavor } from "grammy";
import { messages } from "../../i18n/en";
import { prisma } from "../../infrastructure/prisma/client";
import { initWsLogger, sendLog } from "../../ws-logger";

type BotStep = {
  step: "idle" | "item" | "qty" | "confirm";
  answer: Record<string, unknown>;
};
type BotContext = Context & SessionFlavor<BotStep>;

const token = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
const bot = new Bot<BotContext>(token); // (https://t.me/BotFather)

initWsLogger();

bot.use(async (ctx, next) => {
  const from = ctx.from;
  const text = ctx.message?.text?.trim();
  const data = ctx.callbackQuery?.data;

  sendLog({
    ts: new Date().toISOString(),
    kind: text ? "message" : data ? "callback" : "update",
    userId: from?.id,
    username: from?.username,
    text,
    data,
  });

  await next();
});

bot.use(
  session({
    initial: (): BotStep => ({
      step: "item",
      answer: {},
    }),
  }),
);

bot.use(async (ctx, next) => {
  const from = ctx.from;
  const user = from
    ? `id:${from.id} user:${from.username ?? "unknown"}`
    : "unknown-user";
  const text = ctx.message?.text?.trim();
  const cb = ctx.callbackQuery?.data;
  const kind = text ? "message" : cb ? "callback" : "update";

  if (text) {
    console.log(`[tg] ${kind} ${user} text=${JSON.stringify(text)}`);
  } else if (cb) {
    console.log(`[tg] ${kind} ${user} data=${JSON.stringify(cb)}`);
  } else {
    console.log(`[tg] ${kind} ${user}`);
  }

  await next();
});

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

bot.command("start", (ctx) => {
  const payload = ctx.match?.trim(); // from_channel
  if (payload === "from_channel") {
    const user = ctx.from?.username;
    ctx.reply(`Welcome to DashQ Bot, ${user}!`);
    sendWebAppButton(ctx);
    return;
  }
  return ctx.reply("yo");
});

// bot.command("hello", async (ctx) => {
//   const from = `id:${ctx.from?.id} user:${ctx.from?.username}`;
//   const reply = await fetch(`${API_BASE_URL}/api/hello`).then((r) => r.json());
//   ctx.reply(`${from} \n ${reply.message}`);
// });

bot.command("ping", async (ctx) => {
  const data = await fetch(`${API_BASE_URL}/api/ping`).then((r) => r.json());
  const from = `id:${ctx.from?.id} user:${ctx.from?.username}`;
  const reply = `${data.ping.message}`;
  ctx.reply(`${from} \n ${reply}`);
});

async function sendWebAppButton(ctx: BotContext) {
  const kb = new InlineKeyboard().webApp(
    "Open web app",
    // "https://admin.aso.market/?access_token=XXX",
    "https://hono-prisma-vue-mono.vercel.app/",
  );

  await ctx.reply("Your order", { reply_markup: kb });
}

bot.command("webapp", async (ctx) => {
  sendWebAppButton(ctx);
});

bot.command("open", async (ctx) => {
  const user = ctx.from?.id;
  await ctx.reply("admin.aso.market", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open as mini app",
            // url: "https://hono-prisma-vue-mono.vercel.app/",
            url: "https://t.me/dashq_bot_bot/front",
            // url: "t.me/dashq_bot_bot/adminaso",
            // url: "t.me/dashq_bot_bot/devtoken",
            // url: "https://admin.aso.market",
            // url: "https://t.me/dashq_bot_bot/?start=from_channel",
          },
        ],
      ],
    },
  });
});

bot.on("message", async (ctx) => {
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

  function isYesResponse(msg: string) {
    return messages.confirm.yesResponses.includes(msg.toLowerCase());
  }

  function isNoResponse(msg: string) {
    return messages.confirm.noResponses.includes(msg.toLowerCase());
  }

  if (step === "confirm") {
    if (isYesResponse(input)) {
      const { item, qty } = ctx.session.answer as {
        item: {
          label: string;
          name: string;
          id: number;
        };
        qty: string;
      };
      await prisma.order.create({
        data: {
          userId: String(ctx.from?.id ?? "unknown"),
          username: ctx?.from?.username,
          item: item.name,
          qty: Number(qty),
        },
      });

      ctx.session = { step: "idle", answer: {} };

      await ctx.reply(messages.submit);

      try {
        const reply = await fetch(`${API_BASE_URL}/api/orders`).then((r) =>
          r.json(),
        );
        await ctx.reply(`
          ${messages.onSubmitSuccess} \n
          ${JSON.stringify(reply.order)}
          `);
      } catch (err) {
        console.error("orders fetch has failed with:", err);
      }
      return;
    }

    if (isNoResponse(input)) {
      ctx.session = { step: "idle", answer: {} };
      return ctx.reply(messages.cancel);
    }

    ctx.session = { step: "idle", answer: {} };
    return ctx.reply(messages.cancel);
  }
});

// await bot.api.setChatMenuButton({
//   menu_button: {
//     type: "commands",
//   },
// });

// await bot.api.setChatMenuButton({
//   menu_button: {
//     type: "web_app",
//     text: "Open web app!",
//     web_app: { url: "https://t.me/dashq_bot_bot/front" },
//   },
// });

await bot.api.setMyCommands(
  [
    {
      command: "create",
      description: messages.wildcard,
    },
    {
      command: "open",
      description: messages.open,
    },
    {
      command: "start",
      description: "Welcome to DashQ Bot!",
    },
    {
      command: "webapp",
      description: "Open web app",
    },
  ],
  { scope: { type: "all_chat_administrators" } },
);

bot.start();
