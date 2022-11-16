

const qrcode     = require('qrcode-terminal') 
const { Client } = require('whatsapp-web.js')

const client     = new Client


//functions
const checkMessage = (Msg) => {
    const jsonFiles = require('../phraselist.json') // ler o arquivo json com todas a frases para analisar

    let msg = Msg.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase()

    for(let index in jsonFiles['phrases']){
        //console.log(msg,':exi', msg.indexOf(jsonFiles['phrases'][index]))
        if (msg.indexOf(jsonFiles['phrases'][index]) != -1) {
            return true
        }
    }
    
    return false
}   


// functions client 
client.on('qr', qr => {
   qrcode.generate(qr, {small: true}) // mostra o codigo QR para inicializar o bot
})


client.on('ready', () => {
    console.log('bot está pronto!')
})


client.on('message', message => {
    if(checkMessage(message.body) == true){
        message.reply('Obg')
    }
})

client.initialize()

