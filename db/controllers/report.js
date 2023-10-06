import User from '../models/user'
import Report from '../models/report'
import { normalizeId, dbConnect } from './util'

export async function getAll(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  return user.savedReports.map(report => normalizeId(report))
}

export async function getByReportId(userId, reportId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  const report = user.savedReports.find(report => report.reportID === reportId)
  if (report) return normalizeId(report)
  return null
}

export async function create(firstName, lastName, jobTitle, bonusEligible, longTermIncentive, assessment, strength, weakness, supervisorName, perner){
  if (!(firstName && lastName && jobTitle && bonusEligible && longTermIncentive)){
    throw new Error('Required fields must be included.')
  }
  await dbConnect()
  const report = await Report.create({firstName, lastName, jobTitle, bonusEligible, longTermIncentive, assessment, strength, weakness, supervisorName, perner})
  if (!report)
    throw new Error('Error inserting Report')
  return normalizeId(report)
}

export async function add(userId, report) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedReports: report } },
    { new: true }
    )
  if (!user){
    return null
  }
    
  return report
}

export async function remove(userId, reportId) {
  await dbConnect()
  let user = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedReports: reportId } }
  )
  if (!user) return null

  return {}
}

export async function update(firstName,lastName,jobTitle,bonusEligible,longTermIncentive,assessment,strength,weakness,supervisorName,perner, reportID){
  if(!(firstName && lastName && jobTitle && bonusEligible && longTermIncentive && reportID)){
    throw new Error("Required fields must be included.")
  }
  await dbConnect()
  const body = {
    "firstName":firstName,
     "lastName":lastName,
     "jobTitle":jobTitle,
     "bonusEligible":bonusEligible,
     "longTermIncentive":longTermIncentive,
     "assessment":assessment,
     "strength":strength,
     "weakness":weakness,
     "supervisorName":supervisorName,
     "perner":perner
  }
  const report = await Report.findOneAndUpdate({"_id":reportID},{$set:body},{returnOriginal: false})

  if (!report)
    throw new Error('Error updating Report')

  return normalizeId(report)
}