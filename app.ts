import express from 'express'
import * as http from 'http'
import * as bodyParser from 'body-parser'
import * as dotenv from 'ts-dotenv'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import { CommonRoutesConfig } from './common/common.routes'
import { UsersRoutes } from './users/users.routes.config'
import debug from 'debug'
import { sequelize } from './database/db.config'

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port = process.env.PORT
const routes: Array<CommonRoutesConfig> = []
const debugLog: debug.IDebugger = debug('app')


app.use(bodyParser.json())
app.use(cors())
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(        
        winston.format.colorize(),
        winston.format.json()
    )
}))

routes.push(new UsersRoutes(app))


app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}))

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server is up and running`)
})


server.listen(port, () => {
    try {
        debugLog(`Server running at http://localhost:${port}`)
        routes.forEach((route: CommonRoutesConfig) => {
            debugLog(`Routes configured for ${route.getName()}`)
        })
        sequelize.authenticate().then(() => {
            console.log('DB connected')
        })
    } catch (err) {
        console.log(err)
    }
})