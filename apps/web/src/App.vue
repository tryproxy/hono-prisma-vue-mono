<script setup lang="ts">
import { onMounted, ref } from "vue";
import { API_BASE_URL } from "./lib/config";


type HelloRes = { ok: boolean; message: string };
type PingRes = { ok: boolean; ping: { id: number; createdAt: string } };
type OrderRes = {
  ok: boolean;
  order: { username: string; item: string; qty: number; createdAt: string } | null;
};

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

  const fetchJson = async <T>(endpoint: string) => {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  const [h, p, o] = await Promise.allSettled([
    fetchJson<HelloRes>(`${API_BASE_URL}/api/hello`),
    fetchJson<PingRes>(`${API_BASE_URL}/api/db-ping`),
    fetchJson<OrderRes>(`${API_BASE_URL}/api/orders`),
  ]);

  hello.value = h.status === "fulfilled" ? h.value.message : "Error";
  ping.value = p.status === "fulfilled" ? `${p.value.ping.id} @ ${p.value.ping.createdAt}` : "Error"
  order.value = o.status === "fulfilled"
    ? ` ${o.value.order?.username} ${o.value.order?.item} ${o.value.order?.qty} ${o.value.order?.createdAt} `
    : "Error";
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
      <div style="margin-top: 8px;"><b>db ping:</b> {{ ping }}</div>
      <div style="margin-top: 8px;"><b>order:</b> {{ order }}</div>
    </div>
  </div>
</template>
