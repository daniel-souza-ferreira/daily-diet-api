import { app } from './app'
import { env } from './.env'

app
    .listen({ port: env.PORT })
    .then(() => console.log(`Application runnning in port ${env.PORT}`))
