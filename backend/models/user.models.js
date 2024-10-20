import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            match: [/.+\@.+\..+/, 'Please use a valid email address']
        },
        password: {
            type: String,
            required: true
        },
      
    },
    { timestamps: true }
);



const User = mongoose.model("users", UserSchema);
export default User;