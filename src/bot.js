const configBot  = require('../config.json') 
const QRcode     = require('qrcode-terminal') 
const { Client } = require('whatsapp-web.js')
const { readFileSync, existsSync, writeFile} = require('fs')
const client     = new Client({ puppeteer: { headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox']} });



const historyFilePath = './history.txt'

//functions

/*
const getHours = () => {
    let currentTime = new Date()
    return `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`
}
*/


const checkMessage = (mensagem) => {
    const messageSeatsRemoved = mensagem.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase()

    const results = configBot['keyword'].some((keyword) => messageSeatsRemoved.indexOf(keyword) != -1)

    return results
}


const RandomAnswers = () => {
    let index = Math.floor(Math.random() * (configBot['answers'].length - 1) + 1) 
    return configBot['answers'][index]   
}


const saveHistory = (contents) => {
    let contentsFile = ''
    if(existsSync(historyFilePath)){
        try {
            contentsFile = readFileSync(historyFilePath, 'utf8')
        } catch (error) {
            console.error(error)
        }
    }

    const newContents = contentsFile + '\n' + contents
    writeFile(historyFilePath, newContents, (error) => console.error(error))
}


client.on('qr', qr => {
   console.clear()
   QRcode.generate(qr, {small: true}) // criar um QR code no terminal
})


client.on('ready', () => {
    console.clear()
    console.log('> Connected ✅ ')
})


client.on('message', async message => {
    message.getContact().then((contact) => {
        if(!message.isStatus && checkMessage(message.body) == true){
            try{
                message.reply(RandomAnswers())
                let log = `by: ${contact.name}: ${message.body}`
                saveHistory(log)
                console.log(log)
            }catch(err){
                console.log(`> Ocorreu um problema a responder ${contact.name} as [ ${getHours()} ]`)
                console.log(`> A mensagem recebida foi: ${message.body}`)
            }
        }
    })
})


client.initialize()

