import mongoose from 'mongoose'

interface propTypes {
    user: string,
    password: string | undefined
}

export const connectDB = async ({ user, password }: propTypes) => {
    try {
        await mongoose.connect(
            '' /* database url to connect */
        )
    } catch (err) {
    }
}
