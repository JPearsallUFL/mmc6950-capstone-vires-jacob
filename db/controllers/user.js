import User from '../models/user'
import { normalizeId, dbConnect } from './util'
import { hashText } from './util/hashText'

export async function create(username, password, firstName, lastName, department, emailAddress, supervisorName, supervisorEmail, pernr) {
  if (!(username && password && firstName && lastName && department && emailAddress && supervisorName && supervisorEmail && pernr)){
    throw new Error('All fields must be included.')
  }

  await dbConnect()
  const existing = await User.findOne({username}).lean()

  if (existing)
      throw new Error('Username already exists, please login, or choose a different username')
  try {
    const user = await User.create({username, password, firstName, lastName, department, emailAddress, supervisorName, supervisorEmail, pernr})
    if (!user)
      throw new Error('Error inserting User')
    return normalizeId(user)
  }
  catch (err) {
    console.log(err)
  }
  return Error
}

export async function updatePassword(username, newPassword){
  if(!(username && newPassword)){
    throw new Error("Username and new password must be included.")
  }
  await dbConnect()
  const password = await hashText(newPassword)
  const user = await User.findOneAndUpdate({"username":username},{$set:{"password":password}},{returnOriginal: false})

  if (!user)
    throw new Error('Error updating User')

  return normalizeId(user)
}