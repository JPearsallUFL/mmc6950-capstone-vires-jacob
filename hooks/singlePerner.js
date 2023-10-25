export default async function singlePerner(pernr) {
    const rostrToken = "b73227f7a59a6e7b14f378afb043ffd6"
    const url = "https://rostr.disney.com/api/v2/people/search?token="
    const query = "&field_query=pernr:"
    try {
        const res = await fetch((url + rostrToken + query + pernr), {method: 'GET', headers: {accept:"application/json"}})
        const json = await res.json()
        if (json.total_entries === 1)
            return json.entries[0]
        else throw new Error("More than one result returned, please verify and correct your perner")
    } catch(err) {
        console.log(err)
        return res.status(400).json({error: err.message})
    }
}