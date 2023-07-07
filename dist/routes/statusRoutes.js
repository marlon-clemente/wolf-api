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

// src/routes/statusRoutes.ts
var statusRoutes_exports = {};
__export(statusRoutes_exports, {
  statusRoutes: () => statusRoutes
});
module.exports = __toCommonJS(statusRoutes_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  statusRoutes
});
