import express from 'express'
import usersService from '../services/users.service'

class UsersMiddleware {
    private static instance: UsersMiddleware

    static getInstance() {
        if(!UsersMiddleware.instance) {
            UsersMiddleware.instance = new UsersMiddleware()
        }

        return UsersMiddleware.instance
    }

    async validateReqUserBody(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.email && req.body.password) {
            next()
        } else {
            res.status(400).send({ error: `Missing reuired: "email" or "password" fields`})
        }
    }

    async validateEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await usersService.getUserByEmail(req.body.email)
        if(user) {
            res.status(400).send({ error: `User email already in use`})
        } else {
            next()
        }
    }

    async validateEmailToSameUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await usersService.getUserByEmail(req.body.email)
        if(user && user.id === req.params.userId) {
            next()
        } else {
            res.status(400).send({ error: `Invalid email` })
        }
    }

    async validateUserExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user =  await usersService.readById(req.params.userId)
        if(user) {
            next()
        } else {
            res.status(404).send({ error: `User${req.params.userId} not found`})
        }
    }
}

export default UsersMiddleware.getInstance()