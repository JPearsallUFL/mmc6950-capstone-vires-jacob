import User from '../models/user'
import Report from '../models/report'
import { normalizeId, dbConnect } from './util'

export async function getAll(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  return user
}

export async function getByReportId(reportId) {
  await dbConnect()
  const report = Report.findById(reportId).lean()
  if (report) return report
  return null
}

export async function create(firstName, lastName, jobTitle, jobLevel, bonusEligible, longTermIncentive, assessment, strength, weakness, supervisorName, pernr, reportName){
  if (!(firstName && lastName && jobTitle && jobLevel && bonusEligible && longTermIncentive && reportName)){
    throw new Error('Required fields must be included.')
  }
  await dbConnect()
  const report = await Report.create({firstName, lastName, jobTitle, jobLevel, bonusEligible, longTermIncentive, assessment, strength, weakness, supervisorName, pernr, reportName})
  if (!report)
    throw new Error('Error inserting Report')
  return normalizeId(report)
}

export async function add(userId, reportId, reportName) {
  
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedReports: {id: reportId, name: reportName} } },
    { new: true }
    )
  if (!user){
    return null
  }
    
  return {}
}

export async function remove(userId, reportId) {
  await dbConnect()
  const report = reportId.id
  const name = reportId.name
  let user = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedReports: {id: report, name: name} } }, {new:true},(error,result) => {
      if (error){
        return false
      }
      else {
        console.log(result)
        return true
      } 
    }
  )
}

export async function update(firstName,lastName,jobTitle,jobLevel,bonusEligible,longTermIncentive,assessment,strength,weakness,supervisorName,pernr,reportID){
  if(!(firstName && lastName && jobTitle && jobLevel && bonusEligible && longTermIncentive && reportID)){
    throw new Error("Required fields must be included.")
  }
  await dbConnect()
  const body = {
    "firstName":firstName,
     "lastName":lastName,
     "jobTitle":jobTitle,
     "jobLevel":jobLevel,
     "bonusEligible":bonusEligible,
     "longTermIncentive":longTermIncentive,
     "assessment":assessment,
     "strength":strength,
     "weakness":weakness,
     "supervisorName":supervisorName,
     "pernr":pernr
  }
  const report = await Report.findOneAndUpdate({"_id":reportID},{$set:body},{returnOriginal: false})

  if (!report)
    throw new Error('Error updating Report')

  return normalizeId(report)
}