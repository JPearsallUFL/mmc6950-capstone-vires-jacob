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
                        const {first_name, last_name, title, level, bonus, lti, assessment, strength, weakness, supervisorName, pernr, currentDate} = req.body
                        const reportName = first_name + " " + last_name + " " + currentDate + " Report"
                        const report = await db.report.create(first_name,last_name,title,level,bonus,lti,assessment,strength,weakness,supervisorName,pernr,reportName)
                        const reportLink = await db.report.add(req.session.user.id, report.id, reportName)

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
                        const id = req.headers.id
                        const reportName = req.headers.name
                        const reportId = {"id":id, "name":reportName}
                        //This Value needs updated during every new deploy
                        const admin = "65396b98902bc8d18f041839"
                        const trash = await db.report.add(admin, reportId.id)
                        if (!trash){
                            //Want to add failure log
                            return res.status(401)
                        }
                        const sessionid = req.session.user.id
                        const userId = {_id: sessionid}
                        try{
                            const report = await db.report.remove(userId, reportId)
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
                        const {first_name, last_name, title, level, bonus, lti, assessment, strength, weakness, supervisorName, pernr, reportID} = req.body
                        const report = db.report.update(first_name,last_name,title,level,bonus,lti,assessment,strength,weakness,supervisorName,pernr, reportID)
                        if (report === null) {
                            req.session.destroy()
                            return res.status(401)
                        }
                        return res.status(200).json("Report Updated")
                    }
                    catch (error) {
                        return res.status(400).json({error: error.message})
                    }
                }
                else {
                    return res.status(401).json("User is not logged in")
                }
            case "GET":
                if (req.session.user){
                    const reportID = req.headers.reportid
                    try{
                        const report = await db.report.getByReportId(reportID)
                        return res.status(200).json(report)
                    }
                    catch(error){
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