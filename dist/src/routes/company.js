"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companies = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
async function companies(app) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify();
    });
    app.get('/company', async () => {
        const company = await prisma_1.prisma.company.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        return company;
    });
    app.get('/company/:id', async (request, response) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const company = await prisma_1.prisma.company.findUnique({
            where: {
                id,
            },
        });
        if (!company) {
            response.status(400).send({
                code: 'COMPANY_NOT_EXIST',
                message: 'A empresa não existe',
            });
        }
        response.status(200).send(company);
    });
    app.post('/company', async (request, response) => {
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            cnpj: zod_1.z.string(),
        });
        const { cnpj, name } = bodySchema.parse(request.body);
        const company = await prisma_1.prisma.company.create({
            data: {
                name,
                cnpj,
            },
        });
        response.status(200).send(company);
    });
    app.put('/company/:id', async (request, response) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            cnpj: zod_1.z.string(),
        });
        const { cnpj, name } = bodySchema.parse(request.body);
        const company = await prisma_1.prisma.company.update({
            where: {
                id,
            },
            data: {
                name,
                cnpj,
            },
        });
        response.status(200).send(company);
    });
    app.delete('/company/:id', async (request, response) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.company.delete({
            where: {
                id,
            },
        });
        response.status(200).send({
            message: 'A empresa foi removida com sucesso',
        });
    });
}
exports.companies = companies;
