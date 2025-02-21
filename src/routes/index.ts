import express from 'express'
import { handleAllUsers, handleDeleteReq, handlePatchReq, handlePostRequest, handleUserByID } from '../controllers'

const router = express.Router()

router
    .route('/')
    .get(handleAllUsers)
    .post(handlePostRequest)

router
    .route('/:id')
    .get(handleUserByID)
    .delete(handleDeleteReq)
    .patch(handlePatchReq)

export default router
