export function generateRefID() {
    let prefix ="TRF-"
    let length = 16
    let characters = "1234567890"
    let randomChar = ""
    for(let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length)
        randomChar += characters.charAt(randomIndex)
    }
    const reference = prefix + randomChar;
    return reference
}