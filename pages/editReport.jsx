import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import {format} from 'date-fns'
import singlePerner from "../hooks/singlePerner";
import { normalizeId } from "../db/controllers/util";
import { Container, Form } from "react-bootstrap";
//import styles from "../styles/Home.module.css";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);

export default function EditReport(props) {
    let reportID = sessionStorage.getItem("report")
    // sessionStorage.removeItem("name")

    const router = useRouter();
    let [empBasePernr, SetPernr ] = useState("")
    let [{supervisorName, first_name, last_name, title, level, bonus, lti, assessment, strength, weakness, pernr}, setForm,]=useState({
        supervisorName: "",
        first_name: "",
        last_name: "",
        title: "",
        level: "",
        bonus: "",
        lti: "",
        assessment: "",
        strength: "",
        weakness: "",
        pernr: ""
    });
    const [error, setError] = useState("");

    function handleChange(e){
        setForm({
             level, bonus, lti, assessment, pernr, ...{[e.target.name]:e.target.value.trim()},
             supervisorName, first_name, last_name, title, strength, weakness, ...{[e.target.name]:e.target.value},

        });
    }
    async function handleEditReport(e){
        e.preventDefault();
        if (!supervisorName) return setError("Must include supervisor name");
        if (!first_name.trim()) return setError("Must include employee first name");
        if (!last_name.trim()) return setError("Must include employee last name");
        if (!title.trim()) return setError("Must include job title");
        if (!level.trim()) return setError("Must include job level");
        if (!(bonus&&lti)) return setError("Must fill out Bonus & LTI Information")
        
        try {
            const res = await fetch("/api/report", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({supervisorName, first_name, last_name, title, level, bonus, lti, assessment, strength, weakness, pernr, reportID}),
            });
            if (res.status === 200) return router.push("/myReports");
            else{
                const reportError = await res.text();
            }
            const {error: message} = await res.json();
            setError(message);
        }
        catch (err){
            console.log(err);
        }
    }

    async function getEmployeeData(){
        // e.preventDefault()
        // sessionStorage.removeItem("pernr")
        try {
            const rostrRes = await singlePerner(empBasePernr)
            const emp_first_name = rostrRes.first_name
            const emp_last_name = rostrRes.last_name
            const emp_title = rostrRes.title
            const emp_level = rostrRes.job_level_code
            const emp_supervisorName = rostrRes.supervisor.full_name
            const emp_pernr = rostrRes.pernr

            const form = document.getElementById("reviewForm")
            form.first_name.value = emp_first_name
            first_name = emp_first_name
            form.last_name.value = emp_last_name
            last_name = emp_last_name
            form.title.value = emp_title
            title = emp_title
            form.level.value = emp_level
            level = emp_level
            form.supervisorName.value = emp_supervisorName
            supervisorName = emp_supervisorName
            form.pernr.value = emp_pernr
            pernr = emp_pernr
        }
        catch(err){
            console.log(err);
        }
    }

    async function getReportData(){
        try{
            const res = await fetch("/api/report?", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json", 
                    "Content-Type": "application/json",
                    "reportID":reportID
                },
                });
            const list = await res.json()

            const form = document.getElementById("reviewForm")
            form.first_name.value = list.firstName
            first_name = list.firstName
            form.last_name.value = list.lastName
            last_name = list.lastName
            form.title.value = list.jobTitle
            title = list.jobTitle
            form.level.value = list.jobLevel
            level = list.jobLevel
            form.supervisorName.value = list.supervisorName
            supervisorName = list.supervisorName
            form.pernr.value = list.pernr
            pernr = list.pernr
            form.bonus.value = list.bonusEligible
            bonus = list.bonusEligible
            form.lti.value = list.longTermIncentive
            lti = list.longTermIncentive
            form.assessment.value = list.assessment
            assessment = list.assessment
            form.strength.value = list.strength
            strength = list.strength
            form.weakness.value = list.weakness
            weakness = list.weakness
            setForm({supervisorName:list.supervisorName, first_name:list.firstName, last_name:list.lastName, title:list.jobTitle, level:list.jobLevel, bonus:list.bonusEligible, lti:list.longTermIncentive, assessment:list.assessment, strength:list.strength, weakness:list.weakness})


            document.title += list.reportName
            const setPageHeader = document.getElementById("pageHeader")
            setPageHeader.innerHTML += list.reportName

            SetPernr(list.pernr)
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {getReportData();} , []);

  return (
    <>

        <Head>
            <title>Edit Report: </title>
            <meta name="description" content="Edit Report"/>
        </Head>

        <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

        <Container>
            <main>
                <div>
                    <h1 id="pageHeader">Edit Report: </h1>
                    <div className="background_stuff">
                        <button onClick={getEmployeeData}>Import/Overwrite Employee Info</button>
                        <Form id="reviewForm" onSubmit={handleEditReport}>
                            <fieldset className="four_col emp_info">
                            <legend>Employee Info</legend>
                                <label htmlFor="first_name">First Name:</label>
                                <input type="text" name="first_name" id="first_name" onChange={handleChange} value={first_name} />

                                <label htmlFor="last_name">Last Name:</label>
                                <input type="text" name="last_name" id="last_name" onChange={handleChange} value={last_name} />

                                <label htmlFor="title">Job Title:</label>
                                <input type="text" name="title" id="title" onChange={handleChange} value={title} />

                                <label htmlFor="level">Job Level:</label>
                                <input type="text" name="level" id="level" onChange={handleChange} value={level} />

                                <label htmlFor="pernr">Pernr:</label>
                                <input type="text" name="pernr" id="pernr" onChange={handleChange} value={pernr} />

                                <label htmlFor="supervisorName">Supervisor:</label>
                                <input type="text" name="supervisorName" id="supervisorName" onChange={handleChange} value={supervisorName} />
                            </fieldset>
                            <fieldset className="four_col benefits">
                            <legend>Bonus & LTI Eligiblity</legend>
                                <label htmlFor="bonus">Bonus:</label>
                                <select name="bonus" id="bonus" onChange={handleChange} required>
                                    <option hidden>True or False?</option>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                                <label htmlFor="lti">LTI:</label>
                                <select name="lti" id="lti" onChange={handleChange} required>
                                    <option hidden>True or False?</option>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </fieldset>
                            <fieldset>
                            <legend>Your Evaluation</legend>
                                <div className="assessment">
                                    <label htmlFor="assessment">Assessment:</label>
                                    <select id="assessment" name="assessment" onChange={handleChange}>
                                        <option hidden>Select Assessment</option>
                                        <option value="A1">A1</option>
                                        <option value="A2">A2</option>
                                        <option value="A3">A3</option>
                                        <option value="B1">B1</option>
                                        <option value="B2">B2</option>
                                        <option value="B3">B3</option>
                                        <option value="C1">C1</option>
                                        <option value="C2">C2</option>
                                        <option value="C3">C3</option>
                                    </select>
                                </div>
                                <div className="six_col">
                                    <label htmlFor="strength">Strengths:</label>
                                    <textarea name="strength" id="strength" cols="30" rows="10" onChange={handleChange} value={strength}>List Strengths here:</textarea>
                                    <label htmlFor="weakness">Growth Areas:</label>
                                    <textarea name="weakness" id="weakness" cols="30" rows="10" onChange={handleChange} value={weakness}></textarea>
                                </div>
                            </fieldset>
                            <div><button>Save</button></div>
                            {error && <p>{error}</p>}
                        </Form>
                    </div>
                </div>
            </main>
        </Container>
    </>
  );
}
