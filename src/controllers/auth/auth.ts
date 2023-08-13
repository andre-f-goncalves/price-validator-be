import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import type { Controller } from '../types';
import User from '../../db/models/users/user';
import { ADMIN, REGULAR } from '../../constants/roles';

export const register: Controller = async (req, res, next) => {
    dotenv.config()
    const { username, password } = req.body
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" })
    }
    bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
            username,
            password: hash,
        })
            .then((user) => {
                const maxAge = 3 * 60 * 60;
                const token = jwt.sign(
                    { id: user._id, username, role: user.role },
                    process.env.WEB_TOKEN as string,
                    {
                        expiresIn: maxAge, // 3hrs in sec
                    }
                );
                res.status(201).json({
                    message: "User successfully created",
                    token: token,
                    user: user._id,
                });
            })
            .catch((error) =>
                res.status(400).json({
                    message: "User not successful created",
                    error: error.message,
                })
            );
    });
}

export const login: Controller = async (req, res, next) => {
    dotenv.config()
    const { username, password } = req.body
    // Check if username and password is provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, username, role: user.role },
                        process.env.WEB_TOKEN as string,
                        {
                            expiresIn: maxAge, // 3hrs in sec
                        }
                    );
                    res.status(201).json({
                        message: "User successfully Logged in",
                        token: token,
                        user: user.username,
                    });
                } else {
                    res.status(400).json({ message: "Login not succesful" });
                }
            });
        }
    } catch (error: any) {
        res.status(400).json({
            message: "An error occurred on login",
            error: error.message,
        })
    }
}

export const loginBO: Controller = async (req, res, next) => {
    dotenv.config()
    const { username, password } = req.body
    // Check if username and password is provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            bcrypt.compare(password, user.password).then(function (result) {
                if (user.role !== ADMIN) {
                    res.status(401).json({
                        message: 'No Permissions to access'
                    })
                } else if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, username, role: user.role },
                        process.env.WEB_TOKEN as string,
                        {
                            expiresIn: maxAge, // 3hrs in sec
                        }
                    );
                    res.status(201).json({
                        message: "User successfully Logged in",
                        token: token,
                        user: user.username,
                    });
                } else {
                    res.status(400).json({ message: "Login not succesful" });
                }
            });
        }
    } catch (error: any) {
        res.status(400).json({
            message: "An error occurred on loginBO",
            error: error.message,
        })
    }
}

export const deleteUser: Controller = async (req, res, next) => {
    dotenv.config()
    const { id } = req.body
    await User.deleteOne({ _id: id })
        .then(() =>
            res.status(201).json({ message: "User successfully deleted", user: { id } })
        )
        .catch(error =>
            res
                .status(400)
                .json({ message: "occurred", error: error.message })
        )
}

/** MIDDLEWARE FUNCTIONS, CHECK IF THEY CAN BE SPLITED TODO */

export const adminAuth: Controller = (req, res, next) => {
    dotenv.config()
    const token = req.headers.authorization
    if (token) {
        jwt.verify(token, process.env.WEB_TOKEN as string, (err: any, decodedToken: any) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized due to verify" })
            } else {
                if (decodedToken.role !== ADMIN) {
                    return res.status(401).json({ message: "Not authorized due to role" })
                } else {
                    next()
                }
            }
        })
    } else {
        return res
            .status(401)
            .json({ message: "Not authorized, token not available" })
    }
}

export const userAuth: Controller = (req, res, next) => {
    dotenv.config()
    const token = req.headers.authorization
    if (token) {
        jwt.verify(token, process.env.WEB_TOKEN as string, (err: any, decodedToken: any) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized due to verification" })
            } else {
                if (decodedToken.role !== ADMIN && decodedToken.role !== REGULAR) {
                    return res.status(401).json({ message: "Not authorized due to role" })
                } else {
                    next()
                }
            }
        })
    } else {
        return res
            .status(401)
            .json({ message: "Not authorized, token not available" })
    }
}

export const get_user_by_id = (token: string) => {
    dotenv.config()
    try {
        const decoded: any = jwt.verify(token, process.env.WEB_TOKEN as string)
        return decoded.id
    } catch (err) {
        return new Error('invalid token')
    }
}