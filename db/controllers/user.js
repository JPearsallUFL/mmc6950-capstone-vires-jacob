import User from '../models/user'
import { normalizeId, dbConnect } from './util'

export async function create(username, password, firstName, lastName, department, emailAddress, supervisorName, supervisorEmail) {
  if (!(username && password && firstName && lastName && department && emailAddress && supervisorName && supervisorEmail)){
    throw new Error('All fields must be included.')
  }

  await dbConnect()

  const user = await User.create({username, password, firstName, lastName, department, emailAddress, supervisorName, supervisorEmail})

  if (!user)
    throw new Error('Error inserting User')

  return normalizeId(user)
}

export async function updatePassword(username, newPassword){
  if(!(username && newPassword)){
    throw new Error("Username and new password must be included.")
  }
  console.log(username + "  " + password)
  await dbConnect()
  const password = newPassword
  const user = await User.updateOne({"username":username},{$set:{"password":password}})

  if (!user)
    throw new Error('Error updating User')

  return normalizeId(user)
}