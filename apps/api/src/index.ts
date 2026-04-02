import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { loadEnv } from "./env.js";
import { connectMongo } from "./db.js";
import { cors } from "hono/cors";
import { authRoutes } from "./auth/routes.js";

const env = loadEnv();
await connectMongo(env.MONGODB_URI);

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
)

app.route('/auth', authRoutes)
app.get("/health", (c) => c.json({ ok: true }));

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${info.port}`);
  },
);
