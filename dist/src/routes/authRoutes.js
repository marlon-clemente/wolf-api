"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function authRoutes(server) {
    server.post('/authenticate', async (req, resp) => {
        const authenticateReq = zod_1.z.object({
            username: (0, zod_1.string)().min(5, { message: 'username minimo 5' }),
            password: (0, zod_1.string)().min(5, { message: 'password minimo 8' }),
        });
        const { username, password } = authenticateReq.parse(req.body);
        console.log(await server.bcrypt.hash('admin'));
        const user = await prisma_1.prisma.user.findUnique({
            // @ts-ignore
            where: { username },
        });
        if (!user) {
            resp.status(400).send({
                error: {
                    code: 'USER_NOT_EXIST',
                    message: 'O usuario não existe',
                },
            });
            return;
        }
        const passwordValidate = await server.bcrypt.compare(password, user.password);
        if (!passwordValidate) {
            resp.status(400).send({
                error: {
                    code: 'ERROR_PASSWORD',
                    message: 'Senha incorreta',
                },
            });
            return;
        }
        const token = server.jwt.sign({ id: user.id, username }, {
            sub: user.id,
            expiresIn: '1 day',
        });
        resp.status(200).send({
            message: 'Autenticado com sucesso',
            token,
        });
    });
}
exports.authRoutes = authRoutes;
