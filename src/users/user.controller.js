import { response, request } from "express"
import User from "./user.model.js"
import jwt from "jsonwebtoken"
import { hash, verify } from "argon2";

export const getUsers = async  (req = request, res = response) => {
    try {
        const {limit = 10, since = 0} = req.query
        const query = {state : true}

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(since))
                .limit(Number(limit))
        ])
        
        res.status(200).json({
            succes: true,
            total,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error obtaining users',
            error
        })
    }
}


export const updateUser = async (req, res = response)=>{
    try {
        const {id} = req.params
        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        const {_id, email, ...data} = req.body
        console.log('hola')
        if(data.password){
            data.password = await hash(data.password)
        }
        
        const userData = await User.findById(uid)
        const validPassword = await verify(userData.password,data.oldPassword)
        console.log(validPassword)
        if(uid == id){
            if(data.oldPassword){
                if(validPassword){
                    const user = await User.findByIdAndUpdate(uid, (data), {new:true})
                    res.status(200).json({
                        success: true,
                        msg: "User updated",
                        user
                    })
                } else{
                    res.status(200).json({
                        success: true,
                        msg: "Invalid password"
                    })
                }
            } else{
                res.status(401).json({
                    success: false,
                    msg: "Is necessary to enter the old password to edit your user."
                })
            }
        } else{
            res.status(401).json({
                success: false,
                msg: "You are not allowed to do that."
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

export const deleteUser = async (req, res = response)=>{
    try {
        const {id} = req.params
        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        if(id == uid){
            const user = await User.findByIdAndUpdate(uid, {state:false}, {new:true})
            res.status(200).json({
                success: true,
                msg: "User updated",
                user
            })
        } else{
            res.status(401).json({
                success: false,
                msg: "You are not allowed to do that."
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