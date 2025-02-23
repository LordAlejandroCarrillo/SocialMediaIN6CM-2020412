import { Router } from "express"
import {validateFields} from "../middlewares/validate-fields.js"
import { check } from "express-validator"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import { addComment, updateComment, deleteComment } from '../comments/comment.controller.js'
import { postExistById, commentExistById } from '../helpers/db-validator.js'

const router = Router()

router.post(
    "/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(postExistById),
        validateFields,
        deleteFileOnError
    ],
    addComment
)

router.put(
    "/update-comment/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(commentExistById),
        validateFields,
        deleteFileOnError
    ],
    updateComment
)

router.delete(
    "/delete-comment/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(commentExistById),
        validateFields
    ],
    deleteComment
)

export default router