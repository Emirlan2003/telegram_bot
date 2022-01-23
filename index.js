const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')

const token = '5193017953:AAFCCA7v0hEgcktNbnZWlmHXV0f4oz3qi_Q'

const bot = new TelegramApi(token, {polling: true} )

const chats = {}


const startGame = async(chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а вы должны ее отгадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}



const start = () => {
    bot.setMyCommands([
        { command: '/start' , description: 'Начальное приветствие'},
        { command: '/info', description: 'Информация о пользователе'},
        { command: '/game', description: 'Игра отгадай число'}
    ])

    bot.on('message', async(msg) => {
        const text = msg.text
        const chatId = msg.chat.id
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Эмира`)
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Вас зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game'){
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я вас не понимаю повторите еще раз!')
    })


    bot.on('callback_query', async(msg) => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data === chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
        }else{
            return bot.sendMessage(chatId, `К сожалению вы не отгадали, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })




}
start()