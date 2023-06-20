export function generateRefID() {
    const prefix = "TRF_"
    const currentMonth = String(new Date().getUTCMonth() + 1).padStart(2, "0")
    const currentDateArray = new Date().toUTCString().split(" ")
    const time = currentDateArray[4].split(":").join("")
    //date(00), month(00), year(0000) and time(00:00:00)
    const num = currentDateArray[1].padStart(2, "0") + currentMonth + currentDateArray[3] + time
    const reference = prefix + num
    return reference
}

// const characters = "1234567890"
//     let randomChar = ""
//     for(let i = 0; i < length; i++) {
//         let randomIndex = Math.floor(Math.random() * characters.length)
//         randomChar += characters.charAt(randomIndex)
//     }