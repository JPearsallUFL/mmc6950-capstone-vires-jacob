import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from '../../config/session'
import db from '../../db'

//this handler runs for /api/report with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
    async function handler(req,res){
        switch (req.method){
            case 'POST':
                if (req.session.user) {
                    try{
                        const report = db.report.add(req.session.user.id, JSON.parse(req.body))
                        if (report === null) {
                            req.session.destroy()
                            return res.status(401)
                        }
                        return res.status(200).json(report)
                    }
                    catch (error) {
                        return res.status(400).json({error: error.message})
                    }
                }
                else {
                    return res.status(401).json("User is not logged in")
                }
                
            case 'DELETE':
                if (req.session.user){
                    try{
                        const report = await db.report.remove(req.session.user.id, JSON.parse(req.body).id)
                        if (report === null) {
                            req.session.destroy()
                            return res.status(401)
                        }
                        return res.status(200).json(report)
                    }
                    catch(error){
                        return res.status(400).json({error: error.message})
                        }
                }
                else {
                    return res.status(401).json("User is not logged in")
                }
            case 'PUT':
                if (req.session.user) {
                    try{
                        const report = db.report.update(req.session.user.id, JSON.parse(req.body), JSON.parse(req.body).id)
                        if (report === null) {
                            req.session.destroy()
                            return res.status(401)
                        }
                        return res.status(200).json(report)
                    }
                    catch (error) {
                        return res.status(400).json({error: error.message})
                    }
                }
                else {
                    return res.status(401).json("User is not logged in")
                }
            default:
                return res.status(404).end()
        }
    },
    sessionOptions
)