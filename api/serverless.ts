import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastify from "fastify";
import bcrypt from "fastify-bcrypt";

import { configDotenv } from "dotenv";
import path from "path";
import { authRoutes } from "../src/routes/authRoutes";
import { companies } from "../src/routes/company";
import { statusRoutes } from "../src/routes/statusRoutes";

const app = fastify({ logger: true });
const envFilePath =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env";

configDotenv({
  path: path.resolve(__dirname, envFilePath),
});

app.register(cors, {
  // origin: ['http://localhost:3333'],
  origin: [],
});

app.register(bcrypt, {
  saltWorkFactor: 10,
});

app.register(jwt, {
  secret: process.env.JWT_SECRET_KEY || "123s4567885699",
});

app.register(authRoutes);
app.register(statusRoutes);
app.register(companies);

export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit("request", req, res);
};
