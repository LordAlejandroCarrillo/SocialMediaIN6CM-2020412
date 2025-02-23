import { Router } from "express"
import { check } from "express-validator"
import { getUsers, updateUser } from "./user.controller.js"
import { validateFields } from "../middlewares/validate-fields.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import { userExistsById } from "../helpers/db-validator.js"

const router = Router()

router.get("/", getUsers)

router.put(
    "/update-user/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(userExistsById),
        validateFields,
        deleteFileOnError
    ],
    updateUser
)

export default router