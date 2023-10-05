import { Schema } from 'mongoose'

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
    bonusEligble: {
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
    perner: {
        type: Number
    }
})