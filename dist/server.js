"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_fastify_bcrypt = __toESM(require("fastify-bcrypt"));
var import_fastify = __toESM(require("fastify"));
var import_jwt = __toESM(require("@fastify/jwt"));
var import_cors = __toESM(require("@fastify/cors"));

// src/routes/authRoutes.ts
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/authRoutes.ts
async function authRoutes(server) {
  server.post("/authenticate", async (req, resp) => {
    const authenticateReq = import_zod.z.object({
      username: (0, import_zod.string)().min(5, { message: "username minimo 5" }),
      password: (0, import_zod.string)().min(5, { message: "password minimo 8" })
    });
    const { username, password } = authenticateReq.parse(req.body);
    console.log(await server.bcrypt.hash("admin"));
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { username }
    });
    if (!user) {
      resp.status(400).send({
        error: {
          code: "USER_NOT_EXIST",
          message: "O usuario n\xE3o existe"
        }
      });
      return;
    }
    const passwordValidate = await server.bcrypt.compare(
      password,
      user.password
    );
    if (!passwordValidate) {
      resp.status(400).send({
        error: {
          code: "ERROR_PASSWORD",
          message: "Senha incorreta"
        }
      });
      return;
    }
    const token = server.jwt.sign(
      { id: user.id, username },
      {
        sub: user.id,
        expiresIn: "1 day"
      }
    );
    resp.status(200).send({
      message: "Autenticado com sucesso",
      token
    });
  });
}

// src/routes/company.ts
var import_zod2 = require("zod");
async function companies(app2) {
  app2.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });
  app2.get("/company", async () => {
    const company = await prisma.company.findMany({
      orderBy: {
        name: "asc"
      }
    });
    return company;
  });
  app2.get("/company/:id", async (request, response) => {
    const paramsSchema = import_zod2.z.object({
      id: import_zod2.z.string().uuid()
    });
    const { id } = paramsSchema.parse(request.params);
    const company = await prisma.company.findUnique({
      where: {
        id
      }
    });
    if (!company) {
      response.status(400).send({
        code: "COMPANY_NOT_EXIST",
        message: "A empresa n\xE3o existe"
      });
    }
    response.status(200).send(company);
  });
  app2.post("/company", async (request, response) => {
    const bodySchema = import_zod2.z.object({
      name: import_zod2.z.string(),
      cnpj: import_zod2.z.string()
    });
    const { cnpj, name } = bodySchema.parse(request.body);
    const company = await prisma.company.create({
      data: {
        name,
        cnpj
      }
    });
    response.status(200).send(company);
  });
  app2.put("/company/:id", async (request, response) => {
    const paramsSchema = import_zod2.z.object({
      id: import_zod2.z.string().uuid()
    });
    const { id } = paramsSchema.parse(request.params);
    const bodySchema = import_zod2.z.object({
      name: import_zod2.z.string(),
      cnpj: import_zod2.z.string()
    });
    const { cnpj, name } = bodySchema.parse(request.body);
    const company = await prisma.company.update({
      where: {
        id
      },
      data: {
        name,
        cnpj
      }
    });
    response.status(200).send(company);
  });
  app2.delete("/company/:id", async (request, response) => {
    const paramsSchema = import_zod2.z.object({
      id: import_zod2.z.string().uuid()
    });
    const { id } = paramsSchema.parse(request.params);
    await prisma.company.delete({
      where: {
        id
      }
    });
    response.status(200).send({
      message: "A empresa foi removida com sucesso"
    });
  });
}

// src/routes/statusRoutes.ts
async function statusRoutes(server) {
  server.get("/ping", async (_, resp) => {
    resp.code(200).send({ message: "pong" });
  });
  server.get("/database", async (_, resp) => {
    const data = await prisma.company.count();
    if (data >= 0) {
      return resp.code(200).send({ message: "pong" });
    }
    resp.code(500).send({
      message: "Database not connected"
    });
  });
}

// src/server.ts
var import_dotenv = require("dotenv");
var import_path = __toESM(require("path"));
var app = (0, import_fastify.default)();
var envFilePath = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
(0, import_dotenv.configDotenv)({
  path: import_path.default.resolve(__dirname, envFilePath)
});
app.register(import_cors.default, {
  // origin: ['http://localhost:3333'],
  origin: []
});
app.register(import_fastify_bcrypt.default, {
  saltWorkFactor: 10
});
app.register(import_jwt.default, {
  secret: process.env.JWT_SECRET_KEY || "123456789"
});
console.log("degund => process.env.JWT_SECRET_KEY", process.env.JWT_SECRET_KEY);
app.register(authRoutes);
app.register(statusRoutes);
app.register(companies);
app.listen({
  port: process.env.NODE_ENV === "production" ? Number(process.env.PORT) : 3333
}).then(() => {
  console.log("running...");
});
