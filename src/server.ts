import bcrypt from 'fastify-bcrypt'
import fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import { authRoutes } from './routes/authRoutes'
import { companies } from './routes/company'
import { statusRoutes } from './routes/statusRoutes'

const app = fastify()

app.register(cors, {
  origin: ['http://localhost:3333'],
})

app.register(bcrypt, {
  saltWorkFactor: 10,
})

app.register(jwt, {
  secret: 'aufhuefuiefaqw[op68d2asdad9d5s',
})

app.register(authRoutes)
app.register(statusRoutes)
app.register(companies)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('running on http://localhost:3333')
  })
