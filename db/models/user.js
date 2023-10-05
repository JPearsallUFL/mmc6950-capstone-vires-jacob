import {Schema, model, models} from 'mongoose'
import reportSchema from './report'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
    username: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 20,
        maxLength: 100
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress:{
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    supervisorName: {
        type: String
    },
    supervisorEmail: {
        type: String
    },
    savedReports: {
        type:Array,
        "default": [reportSchema]
    }
})

// hashes the password before it's stored in mongo
UserSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
  })
  
  export default models.User || model('User', UserSchema)