"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/authRoutes.ts
var authRoutes_exports = {};
__export(authRoutes_exports, {
  authRoutes: () => authRoutes
});
module.exports = __toCommonJS(authRoutes_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authRoutes
});
