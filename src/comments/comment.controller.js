import User from "../users/user.model.js"
import Comment from "./comment.model.js"
import jwt from "jsonwebtoken"
import Post from "../posts/post.model.js"

export const addComment = async (req, res)=>{
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
        const query = {state:true}
        const [totalC, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])

        let userDB = {}
        await users.map( localUser=>{
            if(localUser.id == uid){
                userDB = localUser
            }
        })
        const postToComment = await Post.findById(id)
        
        if(postToComment.state == true){
            const comment = await Comment.create({
                ownerUsername: userDB.username,
                ownerEmail: userDB.email,
                text: data.text,
                owner: userDB.id,
                postRef: id
            })
    
            postToComment.comments.push(comment)
            await Post.findByIdAndUpdate(
                id,
                {comments: postToComment.comments},
                {new:true}
            )
            
            return res.status(201).json({
                message: "Comment created successfully",
                comment
            })
        } else{
            return res.status(401).json({
                message: "Comment does not exist anymore."
            })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Comment creation failed",
            error: e.message
        })
    }
}

export const updateComment = async (req, res = response)=>{
    try {
        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const {text} = req.body
        const { id } = req.params
        
        const comment = await Comment.findById(id)
        const post = await Post.findById(comment.postRef.toString())
        let postComments = await post.comments

        if(uid == comment.owner.toString()){
            const comment = await Comment.findByIdAndUpdate(
                id, 
                {
                    text: text
                }, 
                {new:true}
            )
            postComments = postComments.filter( localPostComment =>
                localPostComment._id.toString() != id
            )
            console.log(postComments)
            postComments.push(comment)
            console.log(postComments)
            await Post.findByIdAndUpdate(
                post._id.toString(), 
                {
                    comments: postComments
                }, 
                {new:true}
            )

            res.status(200).json({
                success: true,
                msg: "Comment updated",
                comment
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
            msg: 'Error updating comment',
            error
        })
    }
}

export const deleteComment = async (req, res = response)=>{
    try {
        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const { id } = req.params
        const comment = await Comment.findById(id)
        const post = await Post.findById(comment.postRef.toString())
        let postComments = await post.comments

        if(uid == comment.owner.toString()){
            const comment = await Comment.findByIdAndUpdate(
                id, 
                {
                    state: false
                }, 
                {new:true}
            )
            postComments = postComments.filter( localPostComment =>
                localPostComment._id.toString() != id
            )
            
            await Post.findByIdAndUpdate(
                post._id.toString(), 
                {
                    comments: postComments
                }, 
                {new:true}
            )

            res.status(200).json({
                success: true,
                msg: "Comment deleted",
                comment
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
            msg: 'Error deleting comment',
            error
        })
    }
}