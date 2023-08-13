import express from 'express'
const router = express.Router();

import { register, login, deleteUser, loginBO, adminAuth } from '../controllers/auth/auth'

/** POST register new user */
router.post('/register', register)

/**  POST login a user */
router.post('/login', login)

/** POST login into BO */
router.post('/loginBO', loginBO)

/** DELETE delete a user */
router.delete('/deleteUser', adminAuth, deleteUser)


export default router;