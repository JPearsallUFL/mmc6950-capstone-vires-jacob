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
                        const {firstName, lastName, jobTitle, bonusEligible, longTermIncentive, assessment, strength, weakness, supervisorName, perner} = req.body
                        const report = await db.report.create(firstName,lastName,jobTitle,bonusEligible,longTermIncentive,assessment,strength,weakness,supervisorName,perner)
                        console.log(report)
                        const reportLink = await db.report.add(req.session.user.id, report.id)

                        if (reportLink === null) {
                            req.session.destroy()
                            return res.status(401)
                        }
                        return res.status(200).json(reportLink)
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
                        const report = await db.report.remove(req.session.user.id, req.body.reportID)
                        if (report === null) {
                            req.session.destroy()
                            return res.status(401)
                        }
                        //This Value needs updated during every new deploy
                        const admin = "651f5d32116bd1d9e2741190"
                        const trash = await db.report.add(admin, req.body.reportID)
                        if (!trash){
                            //Want to add failure log
                            return null
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
                        const {firstName, lastName, jobTitle, bonusEligible, longTermIncentive, assessment, strength, weakness, supervisorName, perner, reportID} = req.body
                        const report = db.report.update(firstName,lastName,jobTitle,bonusEligible,longTermIncentive,assessment,strength,weakness,supervisorName,perner, reportID)
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