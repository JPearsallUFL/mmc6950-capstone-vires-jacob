import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import getDirectReports from "../hooks/getDirectReports";
import {useRouter} from "next/router";
import singlePerner from "../hooks/singlePerner";
import Link from "next/link";
import { useEffect } from "react";

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

export default function Search(props) {
    
    const router = useRouter();
    
    async function handleSearch(){
        
        var divChange = document.getElementById("user_table")
        divChange.innerHTML = ""
        try {
            const reports = await getDirectReports(props?.user?.pernr)
            reports.map((a) => {
                let row = document.createElement("tr")
                row.onclick = {}
                let name = a.full_name
                let title = a.title
                let report_button = document.createElement("button")
                report_button.data = a.pernr
                report_button.innerHTML="New Report"
                let pernr = a.pernr
                report_button.onclick = function(){
                    sessionStorage.setItem("name",a.full_name)
                    sessionStorage.setItem("pernr", a.pernr)
                    router.push("/newReport")
                };
                
                
                let name_cell = document.createElement("td")
                let title_cell = document.createElement("td")
                let action_cell = document.createElement("td")
                name_cell.innerHTML = name
                row.appendChild(name_cell)
                title_cell.innerHTML = title
                row.appendChild(title_cell)
                action_cell.appendChild(report_button)
                row.appendChild(action_cell)
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
        <title>NANI Employee Search</title>
        <meta name="description" content="NANI Employee Search" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main>
        <h1>Hi {props?.user?.firstName}, welcome to NANI</h1>
        <p>This page will auto populate or prompt you to press a button to populate a list of your direct reports</p>
        <div id="report_map">
            <table id="user_table"></table>
        </div>
      </main>

    </>
  );
}
