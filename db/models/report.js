import {Schema, model, models} from 'mongoose'

const reportSchema = new Schema({
    reportID: Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobLevel: {
        type: String,
        required: true
    },
    bonusEligible: {
        type: Boolean,
        required: true
    },
    longTermIncentive: {
        type: Boolean,
        required: true
    },
    assessment: {
        type: String
    },
    strength: {
        type: String
    },
    weakness: {
        type: String
    },
    supervisorName: {
        type: String
    },
    pernr: {
        type: Number
    },
    reportName: {
        type: String,
        required: true
    }
})

export default models.Report || model('Report', reportSchema)