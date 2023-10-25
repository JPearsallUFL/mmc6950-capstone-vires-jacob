import Link from "next/link";


export default async function HandleSearch(props){
    var divChange = document.getElementById("user_table")
    divChange.innerHTML = ""
    try {
        const reports = await getDirectReports(props?.user?.pernr)
        //Am able to pull direct reports, now need to map them.
        reports.map((a) => {
            let row = document.createElement("tr")
            let name = a.full_name
            let title = a.title
            let user_Link = document.createElement("Link")
            user_Link.to = "/newReport"
            let button = document.createElement("btn")
            button.innerHTML="New Report"
            user_Link.appendChild(button)
            // let action = 

            let name_cell = document.createElement("td")
            let title_cell = document.createElement("td")
            let action_cell = document.createElement("td")
            name_cell.innerHTML = name
            row.appendChild(name_cell)
            title_cell.innerHTML = title
            row.appendChild(title_cell)
            action_cell.innerHTML = action
            row.appendChild(user_Link)
            divChange.appendChild(row)
        })
    }
    catch (err){
        divChange.appendChild(document.createTextNode("Shit it doesnt"))
    }
}

