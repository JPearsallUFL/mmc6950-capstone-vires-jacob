import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import {format} from 'date-fns'
import singlePerner from "../hooks/singlePerner";
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

export default function NewReport(props) {
    let employeeName = sessionStorage.getItem("name")
    // sessionStorage.removeItem("name")

    const router = useRouter();
    const currentDate = format(new Date(), 'MMMM do yyyy');
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
    async function handleCreateReport(e){
        e.preventDefault();
        if (!supervisorName.trim()) return setError("Must include supervisor name");
        if (!first_name.trim()) return setError("Must include employee first name");
        if (!last_name.trim()) return setError("Must include employee last name");
        if (!title.trim()) return setError("Must include job title");
        if (!level.trim()) return setError("Must include job level");
        if (!(bonus.trim()&&lti.trim())) return setError("Must fill out Bonus & LTI Information")
        
        try {
            const res = await fetch("/api/report", {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({supervisorName, first_name, last_name, title, level, bonus, lti, assessment, strength, weakness, pernr, currentDate}),
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
        const empPernr = sessionStorage.getItem("pernr")
        // sessionStorage.removeItem("pernr")
        try {
            const rostrRes = await singlePerner(empPernr)
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

  return (
    <>
      <Head>
        <title>New Report: {employeeName}</title>
        <meta name="description" content="New Report" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />


      <main>
      <h1>New Report for {employeeName}, {currentDate}</h1>
      <button onClick={getEmployeeData}>Import/Overwrite Employee Data</button>
        <form id="reviewForm" onSubmit={handleCreateReport}>
            <fieldset>
                <legend>This Employee Info Can be pulled from API</legend>
                <label htmlFor="first_name">Employee First Name:</label>
                <input type="text" name="first_name" id="first_name" onChange={handleChange} value={first_name} />
                <label htmlFor="last_name">Employee Last Name:</label>
                <input type="text" name="last_name" id="last_name" onChange={handleChange} value={last_name} />
                <label htmlFor="title">Employee Job Title:</label>
                <input type="text" name="title" id="title" onChange={handleChange} value={title} />
                <label htmlFor="level">Employee Job Level:</label>
                <input type="text" name="level" id="level" onChange={handleChange} value={level} />
                <label htmlFor="pernr">Employee Pernr:</label>
                <input type="text" name="pernr" id="pernr" onChange={handleChange} value={pernr} />
                <label htmlFor="supervisorName">Supervisor Name:</label>
                <input type="text" name="supervisorName" id="supervisorName" onChange={handleChange} value={supervisorName} />
            </fieldset>
            <fieldset>
                <legend>Bonus and LTI Information</legend>
                <label htmlFor="bonus">Bonus Eligible?:</label>
                <select name="bonus" id="bonus" onChange={handleChange} required>
                    <option hidden>True or False?</option>
                    <option value="false">False</option>
                    <option value="true">True</option>
                </select>
                {/* <input type="select" name="bonus" id="username" onChange={handleChange} value={username} /> */}
                <label htmlFor="lti">LTI Eligible?:</label>
                <select name="lti" id="lti" onChange={handleChange} required>
                    <option hidden>True or False?</option>
                    <option value="false">False</option>
                    <option value="true">True</option>
                </select>
                {/* <input type="select" name="username" id="username" onChange={handleChange} value={username} /> */}
            </fieldset>
            <fieldset>
                <legend>Your Evaluation</legend>
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
                {/* <input type="select" name="assessment" id="assessment" onChange={handleChange} value={assessment} /> */}
                {/* <label htmlFor="strength">Strengths:</label>
                <input type="textarea" name="strength" id="strength" onChange={handleChange} value={strength} />
                <label htmlFor="weakness">Weaknesses:</label>
                <input type="textarea" name="weakness" id="weakness" onChange={handleChange} value={weakness} /> */}
                <textarea name="strength" id="strength" cols="30" rows="10" onChange={handleChange} value={strength}>List Strengths here:</textarea>
                {/* <textarea name="weakness" id="weakness" cols="30" rows="10" onChange={handleChange} value={weakness}>List Weaknesses here:</textarea> */}

                <textarea name="weakness" id="weakness" cols="30" rows="10" onChange={handleChange} value={weakness}></textarea>
            </fieldset>
            <button>Submit</button>
            {error && <p>{error}</p>}
        </form>
        <Link href="/myReports">View Saved Reports?</Link>
      </main>
    </>
  );
}
