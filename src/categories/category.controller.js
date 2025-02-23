import Post from "../posts/post.model.js"
import User from "../users/user.model.js"
import jwt from "jsonwebtoken"
import Category from "./category.model.js"

export const addCategory = async (req, res)=>{
    try {
        const token = await req.header('x-token')
        
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const data = req.body

        const currentUser = await User.findById(uid)
        
        if(currentUser.role == "ADMIN_ROLE"){

            const category = await Category.create({
                name: data.name,
                description: data.description
            })
            
            return res.status(201).json({
                message: "Category created successfully",
                category
            })
        } else{
            return res.status(401).json({
                message: "You are not allowed to do this."
            })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Category creation failed",
            error: e.message
        })
    }
}

export const editCategory = async (req, res)=>{
    try {
        const token = await req.header('x-token')
        
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const { id } = req.params

        const data = req.body

        const currentUser = await User.findById(uid)
        
        if(currentUser.role == "ADMIN_ROLE"){

            const category = await Category.findByIdAndUpdate(
                id,
                {
                    name: data.name,
                    description: data.description
                },
                {new:true}
            )
            
            return res.status(201).json({
                message: "Category updated successfully",
                category
            })
        } else{
            return res.status(401).json({
                message: "You are not allowed to do this."
            })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Category updating failed",
            error: e.message
        })
    }
}

export const deleteCategory = async (req, res)=>{
    try {
        const token = await req.header('x-token')
        
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const { id } = req.params

        const currentUser = await User.findById(uid)

        const query = {state:true}
        const [totalC, posts] = await Promise.all([
            Post.countDocuments(query),
            Post.find(query)
        ])
        
        if(currentUser.role == "ADMIN_ROLE"){

            const category = await Category.findByIdAndUpdate(
                id,
                {
                    state: false
                },
                {new:true}
            )
            
            posts.map( async localPost =>{
                if(localPost.categoryId.toString() == id){
                    await Post.findByIdAndUpdate(
                        localPost._id.toString(),
                        {
                            state: false,
                            comments: []
                        }
                    )
                }
            })

            return res.status(201).json({
                message: "Category deleted successfully",
                category
            })
        } else{
            return res.status(401).json({
                message: "You are not allowed to do this."
            })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Category deletion failed",
            error: e.message
        })
    }
}