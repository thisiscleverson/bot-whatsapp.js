const Phrases    = require('../phraselist.json') // ler o arquivo json com todas a frases para analisar
const qrcode     = require('qrcode-terminal') 
const { Client } = require('whatsapp-web.js')
const client     = new Client


//functions
const checkMessage = (Msg) => {
    let msg = Msg.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase()

    for(let index in Phrases['phrases']){
        //console.log(msg,':', msg.indexOf(Phrases['phrases'][index]))
        if (msg.indexOf(Phrases['phrases'][index]) != -1) {
            return true
        }
    }
    
    return false
}   


const answers = () => {
    let index = Math.floor(Math.random() * (Phrases['answers'].length - 1) + 1) // sortear qual frase de resposta vai ser usada
    return Phrases['answers'][index]   
}


// functions client 
client.on('qr', qr => {
   qrcode.generate(qr, {small: true}) // mostra o codigo QR para inicializar o bot
})


client.on('ready', () => {
    console.log('> o bot está pronto!')
})


client.on('message', message => {
    if(checkMessage(message.body) == true){
        message.reply(answers())
    }
})

client.initialize()

