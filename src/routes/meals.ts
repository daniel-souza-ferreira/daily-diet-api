import { FastifyInstance } from "fastify/types/instance"
import { z } from 'zod'
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { checkUserSessionId } from '../middlewares/check-user-session-id'

export async function mealsRoutes(app: FastifyInstance) {
    app.post('/', { preHandler: [checkUserSessionId] }, async (request, reply) => {
        const { sessionId } = request.cookies
        const user = await knex('users')
            .where('session_id', sessionId)
            .first()

        const createMelBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            isOnDiet: z.boolean(),
            date: z.iso.datetime().optional()
        })
        const { name, description, date, isOnDiet: is_on_diet } = await createMelBodySchema.parse(request.body)

        const mealData = {
            id: randomUUID(),
            name,
            is_on_diet,
            description,
            user_id: user?.id,
            date: date ? date : new Date().toISOString()
        }
        await knex('meals').insert(mealData)
        return reply.status(201).send({ meal: mealData })
    })

    app.get('/', { preHandler: [checkUserSessionId] }, async (request, reply) => {
        const { sessionId } = request.cookies
        const user = await knex('users')
            .where('session_id', sessionId)
            .first()

        const meals = await knex('meals').where('user_id', user?.id).select()
        return reply.status(200).send({ 
            meals: meals || []
        })
    })

    app.get('/:id', { preHandler: [checkUserSessionId] }, async (request, reply) => {
        const { sessionId } = request.cookies
        const user = await knex('users')
            .where('session_id', sessionId)
            .first()

        const getMealParamsSchema = z.object({ id: z.uuid() })
        const { id } = getMealParamsSchema.parse(request.params)
        const meal = await knex('meals')
            .where({ user_id: user?.id, id: id })
            .first()
        
        return {
            meal: meal || null
        }
    })

    app.put('/:id', { preHandler: [checkUserSessionId] }, async (request, reply) => {
        const { sessionId } = request.cookies
        const user = await knex('users')
            .where('session_id', sessionId)
            .first()
    
        const getMealParamsSchema = z.object({ id: z.uuid() })
        const { id } = getMealParamsSchema.parse(request.params)
        const meal = await knex('meals')
            .where({ user_id: user?.id, id: id })
            .first()
        
        if (!meal) {
            return reply.status(400).send('Meal not found')
        }

        const updateBodySchema = z.object({
            name: z.string().nonempty().optional(),
            description: z.string().optional(),
            isOnDiet: z.boolean().optional(),
            date: z.iso.datetime().optional()
        })
        const { name, description, date, isOnDiet: is_on_diet } = updateBodySchema.parse(request.body)

        await knex('meals')
            .where({ id: id })
            .update({
                ...meal,
                name,
                description,
                is_on_diet,
                date
            })
        return reply.status(200).send()
    })

    app.delete('/:id', { preHandler: [checkUserSessionId] }, async (request, reply) => {
        const { sessionId } = request.cookies
        const user = await knex('users')
            .where('session_id', sessionId)
            .first()

        const getMealParamsSchema = z.object({ id: z.uuid() })
        const { id } = getMealParamsSchema.parse(request.params)
        const meal = await knex('meals')
            .where({ user_id: user?.id, id: id })
            .first()
        
        if (!meal) {
            return reply.status(400).send('Meal not found')
        }

        await knex('meals').where('id', id).del()
        return reply.status(200).send()
    })

    app.get('/metrics', { preHandler: [checkUserSessionId] }, async (request, reply) => {
        const { sessionId } = request.cookies
        const user = await knex('users')
            .where('session_id', sessionId)
            .first()

        const meals = await knex('meals').where('user_id', user?.id).select()
        
        let bestSequence = 0
        if (meals && meals.length) {
            let currentSequence = 0

            const sortedMeals = meals.sort((mealA, mealB) => new Date(mealA.date).getTime() - new Date(mealB.date).getTime())
            sortedMeals.forEach(meal => {
                currentSequence = meal.is_on_diet ? currentSequence + 1 : 0
                bestSequence = currentSequence > bestSequence ? currentSequence : bestSequence
            })
        }

        return reply.status(200).send({ 
            metrics: {
                total: (meals || []).length,
                mealsInDiet: (meals || []).filter(meal => meal.is_on_diet).length,
                mealsOutDiet: (meals || []).filter(meal => !meal.is_on_diet).length,
                bestSequence
            }
        })
    })
}