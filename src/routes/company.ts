import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function companies(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/company', async () => {
    const company = await prisma.company.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return company
  })

  app.get('/company/:id', async (request, response) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const company = await prisma.company.findUnique({
      where: {
        id,
      },
    })

    if (!company) {
      response.status(400).send({
        code: 'COMPANY_NOT_EXIST',
        message: 'A empresa não existe',
      })
    }

    response.status(200).send(company)
  })

  app.post('/company', async (request, response) => {
    const bodySchema = z.object({
      name: z.string(),
      cnpj: z.string(),
    })
    const { cnpj, name } = bodySchema.parse(request.body)

    const company = await prisma.company.create({
      data: {
        name,
        cnpj,
      },
    })

    response.status(200).send(company)
  })

  app.put('/company/:id', async (request, response) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      cnpj: z.string(),
    })
    const { cnpj, name } = bodySchema.parse(request.body)

    const company = await prisma.company.update({
      where: {
        id,
      },
      data: {
        name,
        cnpj,
      },
    })

    response.status(200).send(company)
  })

  app.delete('/company/:id', async (request, response) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.company.delete({
      where: {
        id,
      },
    })

    response.status(200).send({
      message: 'A empresa foi removida com sucesso',
    })
  })
}
