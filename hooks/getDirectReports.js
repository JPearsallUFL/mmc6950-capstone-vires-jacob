export default async function getDirectReports(pernr) {
    const rostrToken = "b73227f7a59a6e7b14f378afb043ffd6"
    const url = "https://rostr.disney.com/api/v2/org_charts/"
    const token = "?locale=en&token="
    try {
        const res = await fetch((url + pernr + token + rostrToken), {method: 'GET', headers: {accept:"application/json"}})
        const json = await res.json()
        if (json.org_chart.direct_reports.length > 0)
            return json.org_chart.direct_reports
        else throw new Error("You do not have any direct reports. You should not be in this app.")
    } catch(err) {
        console.log(err)
        throw err
    }
}
