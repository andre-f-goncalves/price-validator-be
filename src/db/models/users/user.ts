import mongoose from 'mongoose';
import { UserInterface } from './user.types';
import { REGULAR } from '../../../constants/roles'

const { Schema } = mongoose;

const userSchema = new Schema<UserInterface>({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        default: REGULAR,
        required: true,
    },
    shoppingLists: {
        type: [],
        default: [],
        required: false
    }
})

const User = mongoose.model('User', userSchema);

export default User;