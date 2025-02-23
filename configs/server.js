'use_strict';

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
import limiter from '../src/middlewares/validate-cant-requests.js';
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/users/user.routes.js'
import User from '../src/users/user.model.js'
import Category from '../src/categories/category.model.js'
import { hash } from 'argon2';
import categoryRoutes from '../src/categories/category.routes.js'
import postRoutes from '../src/posts/post.routes.js'
import commentRoutes from '../src/comments/comment.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended:false }))
    app.use(cors())
    app.use(express.json())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
}

const routes = (app) => {
    app.use('/socialMediaSystem/v1/auth', authRoutes)
    app.use('/socialMediaSystem/v1/users', userRoutes)
    app.use('/socialMediaSystem/v1/categories', categoryRoutes)
    app.use('/socialMediaSystem/v1/posts', postRoutes)
    app.use('/socialMediaSystem/v1/comments', commentRoutes)
}

const connectDB = async () => {
    try {
        await dbConnection()
        console.log('Database connected succesfully')
    } catch (error) {
        console.log('Error trying to connect to the database', error)
        process.exit(1)
    }
}

export const startServer = async () => {
    const app = express()
    const port = process.env.PORT || 3000

    try {
        middlewares(app)
        connectDB()
        routes(app)
        app.listen(port)
        const password = await hash("12345678")
        console.log(`Server running on port: ${port}`)
        const query = {state: true}

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])
        const [totalC, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
        ])
        
        let userCount = 0
        if(total != 0){
            users.map( localUser =>{
                if(localUser.username == "jfernandez" || localUser.email == "fernandez@gmail.com"){
                    userCount++
                }
            })
        }
        //AGREGAR ADMIN
        if(userCount == 0){
            await User.create({
                name: "Juan",
                surname: "Fernandez",
                username: "jfernandez",
                email: "fernandez@gmail.com",
                password: password,
                role:"ADMIN_ROLE"
            })
            console.log("")
            console.log("USER CREATED SUCCESFULLY")
        } else{
            console.log("")
            console.log("USER ALREADY CREATED")
        }

        let categoryCount = 0
        if(totalC != 0){
            categories.map( localCategory =>{
                if(localCategory.name == "Technology"){
                    categoryCount++
                }
            })
        }
        //AGREGAR CATEGORIA
        if(categoryCount == 0){
            await Category.create({
                name:"Technology",
                description:"Everything related on innovation and a creative way to solve problems."
            })
            console.log("")
            console.log("CATEGORY CREATED SUCCESFULLY")
        } else{
            console.log("")
            console.log("CATEGORY ALREADY CREATED")
            }
        categoryCount = 0
    } catch (e) {
        console.log(e)
    }
}