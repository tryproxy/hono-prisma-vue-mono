<script setup lang="ts">
import { onMounted, ref } from "vue";
import { API_BASE_URL } from "./lib/config";

const hello = ref("loading...");
const ping = ref("loading...");
const order = ref('loading...')

onMounted(async () => {
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
      <div><b>hello:</b> {{ hello }}</div>
      <!-- <div style="margin-top: 8px;"><b>db ping:</b> {{ ping }}</div> -->
      <div style="margin-top: 8px;"><b>order:</b> {{ order }}</div>
    </div>
  </div>
</template>
