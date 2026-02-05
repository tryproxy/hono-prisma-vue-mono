<script setup lang="ts">
import { onMounted, ref } from "vue";
import { API_BASE_URL } from "./lib/config";

const hello = ref("loading...");
const ping = ref("loading...");
const order = ref('loading...')
const hasInitData = ref(false)
const initDataJson = ref<string>("")

onMounted(async () => {
  const initData = window.Telegram?.WebApp?.initData ?? ""
  hasInitData.value = Boolean(initData)
  if (initData) {
    const params = new URLSearchParams(initData)
    const data: Record<string, unknown> = {}
    for (const [key, value] of params.entries()) {
      if (key === "user") {
        try {
          data.user = JSON.parse(value)
        } catch {
          data.user = value
        }
      } else {
        data[key] = value
      }
    }
    initDataJson.value = JSON.stringify(data, null, 2)
  }

  const h = await fetch(`${API_BASE_URL}/api/hello`).then((r) => r.json());
  hello.value = h.message;

  const p = await fetch(`${API_BASE_URL}/api/db-ping`).then((r) => r.json());

  ping.value = `${p.ping.id} @ ${p.ping.createdAt}`;

  const o = await fetch(`${API_BASE_URL}/api/orders`).then((r) => r.json())
  order.value = `
    ${o.order.username}
    ${o.order.item}
    ${o.order.qty}
    ${o.order.createdAt}`
});
</script>

<template>
  <div style="min-height: 100vh; display: grid; place-items: center; font-family: system-ui;">
    <div style="padding: 20px; border: 1px solid #ddd; border-radius: 14px;">
      <h1>Vue - Hono - Prisma - Postgres </h1>
      <div><b>tg initData:</b> {{ hasInitData ? "yes" : "no" }}</div>
      <pre v-if="initDataJson" style="margin-top: 8px; white-space: pre-wrap; word-break: break-word;">
        {{ initDataJson }}
      </pre>
      <div><b>hello:</b> {{ hello }}</div>
      <!-- <div style="margin-top: 8px;"><b>db ping:</b> {{ ping }}</div> -->
      <div style="margin-top: 8px;"><b>order:</b> {{ order }}</div>
    </div>
  </div>
</template>
