import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import { useRouter } from "next/router";
import { useEffect } from "react";
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

export default function Home(props) {

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
        }
        catch(err){
            console.log(err)
        }
    }
    
    async function handleSearch(){
        
        var divChange = document.getElementById("reports_table")
        divChange.innerHTML = ""
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
            const reportNames = list.savedReports
            
            reportNames.map((a) => {
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
                    //this isnt happening because of 400(bad request) error, Think its from race condtion.
                    router.refresh
                };
                
                let name_cell = document.createElement("td")
                let edit_cell = document.createElement("td")
                let delete_cell = document.createElement("td")
                name_cell.innerHTML = a.name
                row.appendChild(name_cell)
                edit_cell.appendChild(edit_button)
                row.appendChild(edit_cell)
                delete_cell.appendChild(delete_button)
                row.appendChild(delete_cell)
                divChange.appendChild(row)
            })
        }
        catch (err){
            console.log(err)
            divChange.appendChild(document.createTextNode("Shit it doesnt"))
        }
    }
    useEffect(() => {handleSearch();},[props]);

  return (
    <>
      <Head>
        <title>My Reports</title>
        <meta name="description" content="My Reports" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main>
        <h1>My Saved Reports</h1>
        <p>TODO: Display a list of Saved Reports with option to Edit/Delete</p>
        <div id="report_map">
            <table id="reports_table"></table>
        </div>
      </main>

    </>
  );
}
