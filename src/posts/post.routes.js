import { Router } from "express"
import { check } from "express-validator"
import {validateFields} from "../middlewares/validate-fields.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import {doAPost, updatePost, deletePost} from "../posts/post.controller.js"
import {postExistById} from "../helpers/db-validator.js"

const router = Router()

router.post(
    '/',
    validateFields,
    deleteFileOnError,
    doAPost
)

router.put(
    "/update-post/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(postExistById),
        validateFields,
        deleteFileOnError
    ],
    updatePost
)

router.delete(
    "/delete-post/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(postExistById),
        validateFields
    ],
    deletePost
)


export default router