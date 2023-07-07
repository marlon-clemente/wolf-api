import bcrypt from 'fastify-bcrypt'
import fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import { authRoutes } from './routes/authRoutes'
import { companies } from './routes/company'
import { statusRoutes } from './routes/statusRoutes'
import { configDotenv } from 'dotenv'
import path from 'path'

const app = fastify()
const envFilePath = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env'

configDotenv({
  path: path.resolve(__dirname, envFilePath),
})

app.register(cors, {
  // origin: ['http://localhost:3333'],
  origin: [],
})

app.register(bcrypt, {
  saltWorkFactor: 10,
})

app.register(jwt, {
  secret: process.env.JWT_SECRET_KEY || '123s4567885699',
})

console.log('degund => process.env.JWT_SECRET_KEY', process.env.JWT_SECRET_KEY)

app.register(authRoutes)
app.register(statusRoutes)
app.register(companies)

app
  .listen({
    port:
      process.env.NODE_ENV === 'production' ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log('running...')
  })
