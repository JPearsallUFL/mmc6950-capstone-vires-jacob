import {Schema, model, models, ObjectId} from 'mongoose'
import reportSchema from './report'
import { hashText } from '../controllers/util/hashText'

const UserSchema = new Schema({
    username: {
        type: String,
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
        type: String,
        required: true
    },
    supervisorEmail: {
        type: String,
        required: true
    },
    pernr: {
        type: String,
        required: true
    },
    savedReports: {
        type:Array,
        "default": [reportSchema] 
    },
},{
    versionKey: false
})
  
  export default models.User || model('User', UserSchema)

//   TestingTestingTesting
//   thisisatestofmyapistuff