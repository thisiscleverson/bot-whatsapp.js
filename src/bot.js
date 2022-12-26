const Phrases    = require('../phraselist.json') // ler o arquivo json com todas a frases para analisar
const qrcode     = require('qrcode-terminal') 
const { Client, Status } = require('whatsapp-web.js')
const client     = new Client


//functions
const getHours = () => {
    let currentTime = new Date()
    return `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`
}


const checkMessage = (Msg, contact) => {
    let msg = Msg.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase()

    for(let index in Phrases['phrases']){
        //console.log(msg,':', msg.indexOf(Phrases['phrases'][index]))
        if (msg.indexOf(Phrases['phrases'][index]) != -1) {
            console.log(" ")    
           	console.log(`📩 mensagem [ ${getHours()} ] por ${contact}: ${Msg}`)
		    console.log("🔎 palavra chave: "+Phrases['phrases'][index])
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
    console.log('> Anton pronto para ação ✅ ')
})


client.on('message', async message => {
    let contact = await message.getContact()
    if(checkMessage(message.body, contact.pushname) == true){
        try{
            await message.reply(answers())

        }catch(err){
            console.log(`> ❗ O Anton teve um ploblema a responder ${contact.pushname} as [ ${getHours()} ]`)
            console.log(`> 📩 mensagem recebida: ${message.body}`)
        }
    }
})

client.initialize()

