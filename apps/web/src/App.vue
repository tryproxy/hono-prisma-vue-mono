<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { API_BASE_URL } from './lib/config';

type PingRes = { ok: boolean; message: string }
type HealthRes = { ok: boolean; db: string }
type AllOrdersRes = {
  count: number
  orders: Orders[]
}

type Orders = {
  id: string
  username: string
  userId: string
  item: string
  qty: number
  createdAt: string
}

const hello = ref('loading...')
const ping = ref('loading...')
const orders = ref<Orders[]>([])
const hasInitData = ref(false)
const initDataJson = ref<string>('')

onMounted(async () => {
  const initData = window.Telegram?.WebApp?.initData ?? ''
  hasInitData.value = Boolean(initData)
  if (initData) {
    const params = new URLSearchParams(initData)
    const data: Record<string, unknown> = {}
    for (const [key, value] of params.entries()) {
      if (key === 'user') {
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

  const fetchJson = async <T,>(endpoint: string) => {
    const res = await fetch(endpoint)
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }
    return res.json() as Promise<T>
  }

  const [h, p, o] = await Promise.allSettled([
    fetchJson<PingRes>(`${API_BASE_URL}/api/ping`),
    fetchJson<HealthRes>(`${API_BASE_URL}/api/health`),
    fetchJson<AllOrdersRes>(`${API_BASE_URL}/api/orders`),
  ])

  hello.value = h.status === 'fulfilled' ? h.value.message : 'Error'
  ping.value = p.status === 'fulfilled' ? `${p.value.db}` : 'Error'
  // orders.value = o.status === "fulfilled" ? o.value : "Error"
  if (o.status === 'fulfilled') {
    orders.value = o.value.orders
  }
})
</script>

<template>
  <div class="page">
    <div class="card">
      <h1>Vue|grammY|Hono|Prisma|Postgres</h1>
      <div><b>ping:</b> {{ hello }}</div>
      <div class="section"><b>db:</b> {{ ping }}</div>
      <div class="section">
        <b>order:</b>
        <table class="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody class="orders-table-body">
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.userId }}</td>
              <td>{{ order.username }}</td>
              <td>{{ order.id }}</td>
              <td>{{ order.qty }}</td>
              <td>{{ order.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page,
.card,
.orders-table {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(1200px 600px at 10% 10%, #2f2f34 0%, transparent 55%),
    radial-gradient(1000px 500px at 90% 90%, #373640 0%, transparent 60%),
    linear-gradient(145deg, #18181c 0%, #222228 45%, #16161a 100%);
  color: #f7f6fa;
  padding: 20px;
}

.card {
  width: min(960px, 100%);
  max-width: 100%;
  padding: 20px;
  border: 1px solid #f7a8d7;
  border-radius: 16px;
  background: rgba(32, 32, 37, 0.72);
  box-shadow:
    0 0 0 1px rgba(247, 168, 215, 0.15) inset,
    0 20px 50px rgba(0, 0, 0, 0.35);
}

.section {
  margin-top: 8px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: 8px;
  border: 1px solid rgba(247, 168, 215, 0.5);
  border-radius: 10px;
  overflow: hidden;
}

.orders-table th,
.orders-table td {
  text-align: left;
  padding: 4px 4px;
  border-bottom: 1px solid rgba(247, 168, 215, 0.25);
  border-left: 1px solid rgba(247, 168, 215, 0.25);
  overflow-wrap: anywhere;
  word-break: break-word;
}

.orders-table th {
  background: rgba(247, 168, 215, 0.14);
  color: #ffd6ee;
  letter-spacing: 0.02em;
}

.orders-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.03);
}

:global(::selection) {
  background: rgba(247, 168, 215, 0.35);
  color: #fff6fc;
}

.orders-table-body {
  border: 1px solid rgba(247, 168, 215, 0.25);
}
</style>
