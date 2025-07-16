import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables {
        meals: {
            id: string,
            name: string,
            description: string,
            is_on_diet: boolean,
            session_id: string,
            user_id: string,
            date: date
        },
        users: {
            id: string,
            name: string,
            email: string,
            session_id: string
        }
    }
}