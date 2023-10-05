import User from '../models/user'
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

export async function add(userId, report) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedReports: report } },
    { new: true }
  )
  if (!user) return null
  const addedReport = user.savedReports.find(saved => saved.reportID === report.reportID)
  return normalizeId(addedReport)
}

export async function remove(userId, reportId) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedReports: {_id: reportId } } },
    { new: true }
  )
  if (!user) return null
  return true
}