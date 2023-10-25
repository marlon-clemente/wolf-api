"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusRoutes = void 0;
const prisma_1 = require("../lib/prisma");
async function statusRoutes(server) {
    server.get('/ping', async (_, resp) => {
        resp.code(200).send({ message: 'pong' });
    });
    server.get('/database', async (_, resp) => {
        const data = await prisma_1.prisma.company.count();
        if (data >= 0) {
            return resp.code(200).send({ message: 'pong' });
        }
        resp.code(500).send({
            message: 'Database not connected',
        });
    });
}
exports.statusRoutes = statusRoutes;
