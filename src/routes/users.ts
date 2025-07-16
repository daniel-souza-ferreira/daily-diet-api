import { FastifyInstance } from "fastify/types/instance"
import { z } from 'zod'
import { knex } from "../database"
import { randomUUID } from "node:crypto"

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.email()
        })
        const { name, email } = createUserBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId
        if (!sessionId) {
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
        }

        await knex('users').insert({
            id: randomUUID(),
            name,
            email,
            session_id: sessionId
        })

        return reply.status(201).send()
    })

    app.get('/', async (request, reply) => {
        const users = await knex('users').select()
        return reply.status(200).send({ users })
    })
}