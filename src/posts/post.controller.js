import User from "../users/user.model.js"
import Post from "./post.model.js"
import Category from "../categories/category.model.js"
import Comment from "../comments/comment.model.js"
import jwt from "jsonwebtoken"
import { generateJWT } from "../helpers/generate-jwt.js"

export const doAPost = async (req, res)=>{
    try {
        const token = await req.header('x-token')

        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const data = req.body
        const query = {state: true}
        const [totalC, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
        ])
        let categoryCount = 0
        let catId = ""

        const lowerCategory = data.category ? data.category.toLowerCase() : null;
                const capitalizedCategory = lowerCategory 
                    ? lowerCategory.charAt(0).toUpperCase() + lowerCategory.slice(1) 
                    : null;

        categories.map( localCategory =>{
            if(localCategory.name == capitalizedCategory){
                categoryCount++
                catId = localCategory.id
            }
        })
        const nameOwner = await User.findById(uid)
        if(categoryCount != 0){
            if(catId != ""){
                const userCategory = await Category.findById(catId)

                const post = await Post.create({
                    ownerUsername: nameOwner.username,
                    ownerEmail: nameOwner.email,
                    title: data.title,
                    text: data.text,
                    categoryId: userCategory.id,
                    category: userCategory.name,
                    trendLevel: userCategory.trendLevel,
                    owner: uid
                })
                await User.findByIdAndUpdate(uid, { postsCount : (nameOwner.postsCount + 1)},{new:true})
                return res.status(200).json({
                    success: true,
                    message: "Post created successfully",
                    post
                })
            }
        } else{
            return res.status(401).json({
                success: false,
                message: `There is no "${data.category}" on categories, perhaps you spelled it wrong.`
            })
        }
        
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "User registration failed",
            error: e.message
        })
    }
}

export const updatePost = async (req, res = response)=>{
    try {
        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const { title, text, category } = req.body
        const { id } = req.params

        const query = {state:true}
        const [totalC, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
        ])

        const lowerCategory = category ? category.toLowerCase() : null;
                const capitalizedCategory = lowerCategory 
                    ? lowerCategory.charAt(0).toUpperCase() + lowerCategory.slice(1) 
                    : null;
        let categoryDB = {}
        await categories.map(localCategory =>{
            if(localCategory.name == capitalizedCategory){
                categoryDB = localCategory
            }
        })

        const postDB = await Post.findById(id)
        if(uid == postDB.owner.toString()){
            if(categoryDB != undefined){
                const post = await Post.findByIdAndUpdate(
                    id, 
                    {
                        trendLevel: categoryDB.trendLevel,
                        category: categoryDB.name,
                        categoryId: categoryDB.id,
                        text: text,
                        title: title
                    }, 
                    {new:true}
                )
                res.status(200).json({
                    success: true,
                    msg: "Post updated",
                    post
                })
            } else{
                res.status(401).json({
                    success: false,
                    msg: `The category ${category} does not exist.`,
                })
            }
        } else{
            res.status(401).json({
                success: false,
                msg: 'You are not allowed to do this.',
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating user',
            error
        })
    }
}

export const deletePost = async (req, res = response)=>{
    try {
        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const { id } = req.params
        const query = {state:true}
        const [totalC, comments] = await Promise.all([
            Comment.countDocuments(query),
            Comment.find(query)
        ])
        const postDB = await Post.findById(id)
        if(uid == postDB.owner.toString()){
            await comments.map( async localComment =>{
                if(localComment.postRef.toString() == id){
                    await Comment.findByIdAndUpdate(localComment.id, {state:false}, {new:true})
                }
            })
            const post = await Post.findByIdAndUpdate(
                id, 
                {
                    state: false,
                    comments: [] 
                }, 
                {new:true}
            )
            res.status(200).json({
                success: true,
                msg: "Post deleted",
                post
            })
        } else{
            res.status(401).json({
                success: false,
                msg: 'You are not allowed to do this.',
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating user',
            error
        })
    }
}