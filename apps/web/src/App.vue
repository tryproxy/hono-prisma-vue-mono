<script setup lang="ts">
import { onMounted, ref } from "vue";

const hello = ref("loading...");
const ping = ref("loading...");

onMounted(async () => {
  const h = await fetch("/api/hello").then((r) => r.json());
  hello.value = h.message;

  const p = await fetch("/api/db-ping").then((r) => r.json());
  ping.value = `${p.ping.id} @ ${p.ping.createdAt}`;
});
</script>

<template>
  <div style="min-height: 100vh; display: grid; place-items: center; font-family: system-ui;">
    <div style="padding: 20px; border: 1px solid #ddd; border-radius: 14px;">
      <h1>Vue - Hono - Prisma - Postgres </h1>
      <div><b>hello:</b> {{ hello }}</div>
      <div style="margin-top: 8px;"><b>db ping:</b> {{ ping }}</div>
    </div>
  </div>
</template>
