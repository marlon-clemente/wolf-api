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

// src/routes/company.ts
var company_exports = {};
__export(company_exports, {
  companies: () => companies
});
module.exports = __toCommonJS(company_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/company.ts
var import_zod = require("zod");
async function companies(app) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });
  app.get("/company", async () => {
    const company = await prisma.company.findMany({
      orderBy: {
        name: "asc"
      }
    });
    return company;
  });
  app.get("/company/:id", async (request, response) => {
    const paramsSchema = import_zod.z.object({
      id: import_zod.z.string().uuid()
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
  app.post("/company", async (request, response) => {
    const bodySchema = import_zod.z.object({
      name: import_zod.z.string(),
      cnpj: import_zod.z.string()
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
  app.put("/company/:id", async (request, response) => {
    const paramsSchema = import_zod.z.object({
      id: import_zod.z.string().uuid()
    });
    const { id } = paramsSchema.parse(request.params);
    const bodySchema = import_zod.z.object({
      name: import_zod.z.string(),
      cnpj: import_zod.z.string()
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
  app.delete("/company/:id", async (request, response) => {
    const paramsSchema = import_zod.z.object({
      id: import_zod.z.string().uuid()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  companies
});
