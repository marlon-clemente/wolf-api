import { FastifyInstance } from 'fastify'

export async function statusRoutes(server: FastifyInstance) {
  server.get('/ping', async (_, resp) => {
    resp.code(200).send({ message: 'pong' })
  })
}
