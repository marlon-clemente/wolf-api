import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function statusRoutes(server: FastifyInstance) {
  server.get('/ping', async (_, resp) => {
    resp.code(200).send({ message: 'pong' })
  })

  server.get('/database', async (_, resp) => {
    const data = await prisma.company.count()

    if (data >= 0) {
      return resp.code(200).send({ message: 'pong' })
    }

    resp.code(500).send({
      message: 'Database not connected',
    })
  })
}
