import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../../config/session"
import db from '../../../db'

// this file handles /api/auth/:action with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
    function handler(req, res) {
        if ((req.method !== ('POST'))&&(req.method !== ('PATCH')))
            return res.status(404).end()
        switch(req.query.action) {
            case "login":
                return login(req, res)
            case "logout":
                return logout(req, res)
            case "signup":
                return signup(req, res)
            case "updatePassword":
                return updatePassword(req, res)
        default:
            console.log (req.query.action)

        return res.status(404).end()  
    }
  },
  sessionOptions
)

async function login(req, res) {
  const { username, password } = req.body
  try {
    const user = await db.auth.login(username, password)
    req.session.user = {
      username: user.username,
      id: user.id,
      firstName: user.firstName,
      pernr: user.pernr
    }
    await req.session.save()
    console.log(req.session)
    res.status(200).end()
  } catch(err) {
    res.status(400).json({error: err.message})
  }
}

async function logout(req, res) {
  await req.session.destroy()
  res.status(200).end()
}

async function signup(req, res) {
  try {
    const {username, password, firstName, lastName, department, emailAddress, supervisorName, supervisorEmail, pernr} = req.body
    if (password.length < 20){
      throw new Error("Password must be at least 20 characters")
    }
    const user = await db.user.create(username, password, firstName, lastName, department, emailAddress, supervisorName, supervisorEmail, pernr)
    console.log(user)
    if (res.status(200)){
      res.redirect('/login')
    }
    // req.session.user = {
    //   username: user.username,
    //   id: user.id
    // }
    // await req.session.save()
    // res.redirect('/')
  } catch(err) {
    res.status(400).json({error: err.message})
  }
}

async function updatePassword(req, res) {
  try {
      const {username, password, newPassword} = req.body
      let user = await db.auth.login(username, password)
      req.session.user = {
          username: user.username,
          id: user.id
      }
      await req.session.save()

      user = await db.user.updatePassword(username, newPassword)
      await req.session.destroy()
      req.session.user = {
          username: user.username,
          id: user.id
        }
      await req.session.save()
      res.redirect('/')
  } catch(err) {
    res.status(400).json({error: err.message})
  }
}