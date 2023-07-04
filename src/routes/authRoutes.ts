import { FastifyInstance } from 'fastify'
import { string, z } from 'zod'
import { prisma } from '../lib/prisma'

export async function authRoutes(server: FastifyInstance) {
  server.post('/authenticate', async (req, resp) => {
    const authenticateReq = z.object({
      username: string().min(5, { message: 'username minimo 5' }),
      password: string().min(5, { message: 'password minimo 8' }),
    })
    const { username, password } = authenticateReq.parse(req.body)
    console.log(await server.bcrypt.hash('admin'))
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { username },
    })

    if (!user) {
      resp.status(400).send({
        error: {
          code: 'USER_NOT_EXIST',
          message: 'O usuario não existe',
        },
      })
      return
    }

    const passwordValidate = await server.bcrypt.compare(
      password,
      user.password,
    )

    if (!passwordValidate) {
      resp.status(400).send({
        error: {
          code: 'ERROR_PASSWORD',
          message: 'Senha incorreta',
        },
      })
      return
    }

    const token = server.jwt.sign(
      { id: user.id, username },
      {
        sub: user.id,
        expiresIn: '1 day',
      },
    )

    resp.status(200).send({
      message: 'Autenticado com sucesso',
      token,
    })
  })
}
