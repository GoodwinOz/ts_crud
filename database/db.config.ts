import * as dotenv from 'ts-dotenv'
import {Sequelize} from 'sequelize-typescript'


const sequelize = new Sequelize('usersts', process.env.DBUSER, process.env.DBPASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    models: [__dirname + '/users/dto/users,model.ts']
})

export default sequelize