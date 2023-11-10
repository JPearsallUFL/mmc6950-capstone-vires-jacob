import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
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

export default function SavedReports(props) {

    const [myReports, setReports] = useState([])

    const router = useRouter();

    async function deleteReport(idvalue,reportName){
        try{
            const reportObject = { "id": idvalue, "name": reportName }
            const reportId = JSON.stringify(reportObject)
            const res = await fetch("/api/report", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Accept: "application/json", 
                    "Content-Type": "application/json",
                    "id": idvalue,
                    "name": reportName
                },
            });
            const newRes = await res.json()
            if (newRes){
                setReports(newRes.savedReports)
            }
        }
        catch(err){
            console.log(err)
        }
    }
    
    async function handleSearch(){
       
        try {
            
            const res = await fetch("/api/user", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json", 
                    "Content-Type": "application/json"
                }
                });
            const list = await res.json()
            setReports(list.savedReports)
        }
        catch (err){
            console.log(err)
            divChange.appendChild(document.createTextNode(err))
        }
    }

    async function createTable(){
        var divChange = document.getElementById("reports_table")
        divChange.innerHTML = ""
        if (myReports.length === 0) return
        myReports.map((a) => {
            let row = document.createElement("tr")
            
            let edit_button = document.createElement("button")
            edit_button.data = a.id
            edit_button.innerHTML="Edit Report"
            edit_button.onclick = function(){
                sessionStorage.setItem("report",a.id)
                router.push("/editReport")
            };
            
            let delete_button = document.createElement("button")
            delete_button.innerHTML="Delete Report"
            delete_button.onclick = function(){
                deleteReport(a.id,a.name)
                router.refresh
            };
            
            let name_cell = document.createElement("td")
            let edit_cell = document.createElement("td")
            let delete_cell = document.createElement("td")
            
            name_cell.innerHTML = a.name
            row.appendChild(name_cell)
            let report_options = document.createElement("div")
            report_options.className = "report_options"
            edit_cell.appendChild(edit_button)
            // row.appendChild(edit_cell)
            report_options.appendChild(edit_cell)
            delete_cell.appendChild(delete_button)
            // row.appendChild(delete_cell)
            report_options.appendChild(delete_cell)
            row.appendChild(report_options)
            divChange.appendChild(row)
        })
    }

    useEffect(() => {handleSearch();},[]);
    useEffect(() => {createTable()}, [myReports])

  return (
    <>
        <Head>
            <title>My Reports</title>
            <meta name="description" content="My Reports" />
        </Head>

        <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

        <Container>
            <main>
                <div>
                    <h1>My Saved Reports</h1>
                    <div id="report_map" className="background_stuff">
                        <table id="reports_table"></table>
                    </div>
                </div>
            </main>
        </Container>
    </>
  );
}
