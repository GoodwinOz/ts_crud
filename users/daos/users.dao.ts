import {UserDto} from '../dto/users.model'
import shortid from 'shortid'
import debug from 'debug'

const log: debug.IDebugger = debug('app:im-memory-dao')

class UsersDao {
    private static instance: UsersDao //Static instance holds 
    //a single obj of UsersDao class
    users: Array<UserDto> = []

    constructor() {
        log('Create new instance of UsersDao')
    }

    static getInstance(): UsersDao { //Creating a new User
        if (!UsersDao.instance) {
            UsersDao.instance = new UsersDao()
        }
        return UsersDao.instance
    }

    async addUser(user: UserDto) {
        user.id = shortid.generate()
        this.users.push(user)
        return user.id
    }

    async getUsers() { //*Read (GET) all resourses*
        return this.users
    }

    async getUserById(userId: string) { //*Read (GET) one by id*
        return this.users.find((user: { id: string }) => user.id === userId)
    }

    async putUserById(user: UserDto) { //Update (PUT) all obj
        const objIndex = this.users.findIndex((obj: { id: string }) => obj.id === user.id)
        this.users.splice(objIndex, 1, user)
        return `${user.id} update via put`
    }

    async patchUserById(user: UserDto) { // Update (PATCH) parts of obj
        const objIndex = this.users.findIndex((obj: { id: string }) => obj.id === user.id)
        let currentUser = this.users[objIndex]
        const allowedPatchFields = ['password', 'firstName', 'lastName', 'permissionLevel']
        for (let field of allowedPatchFields) {
            if (field in user) {
                currentUser[field] = user[field]
            }
        }
        this.users.splice(objIndex, 1, currentUser)
        return `${user.id} patched`
    }

    async removeUserById(userId: string) { //Remove (DELETE) user
        const objIndex = this.users.findIndex((obj: { id: string }) => obj.id === userId)
        this.users.splice(objIndex, 1)
        return `${userId} removed`
    }

    async getUserByEmail(email: string) { //Find by email
        const objIndex = this.users.findIndex((obj: { email: string }) => obj.email === email)
        let currentUser = this.users[objIndex]
        if(currentUser) {
            return currentUser
        } else {
            return null
        }
    }
}

export default UsersDao.getInstance()