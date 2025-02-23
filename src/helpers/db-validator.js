import User from "../users/user.model.js"
import Post from "../posts/post.model.js"
import Comment from "../comments/comment.model.js"
import Category from "../categories/category.model.js"

export const existentEmail = async (email = ' ') => {
    
    const existEmail = await User.findOne({email})
    
    if(existEmail){
        throw new Error(`El correo ${ email } ya existe en la base de datos`)
    }
}

export const userExistsById = async(id = "") => {
    const userExists = await User.findById(id)

    if(!userExists){
        throw new Error(`The ID ${id} doesn't exist`)
    }
}

export const postExistById = async(id = "") => {
    const postExists = await Post.findById(id)

    if(!postExists){
        throw new Error(`The ID ${id} doesn't exist`)
    }
}

export const commentExistById = async(id = "") => {
    const commentExists = await Comment.findById(id)

    if(!commentExists){
        throw new Error(`The ID ${id} doesn't exist`)
    }
}

export const categoryExistById = async(id = "") => {
    const categoryExists = await Category.findById(id)

    if(!categoryExists){
        throw new Error(`The ID ${id} doesn't exist`)
    }
}