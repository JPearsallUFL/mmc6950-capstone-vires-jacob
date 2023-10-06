import bcrypt from 'bcrypt'

export async function hashText(text){
    const newText = await bcrypt.hash(text, 10)
    return newText
}
