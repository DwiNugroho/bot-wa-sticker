const { create, decryptMedia } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const moment = require('moment')
const mime = require('mime-types')

const serverOption = {
    headless: true,
    qrTimeout: 40,
    authTimeout: 40,
    autoRefresh: true,
    qrRefreshS: 15,
    devtools: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ]
}

const opsys = process.platform;
if (opsys == "win32" || opsys == "win64") {
serverOption['executablePath'] = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
} else if (opsys == "linux") {
serverOption['browserRevision'] = '737027';
} else if (opsys == "darwin") {
serverOption['executablePath'] = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const startServer = async (from) => {
    create('Imperial', serverOption)
        .then(client => {
            console.log('[SERVER] Server Started!')

            // Force it to keep the current session
            client.onStateChanged(state => {
                console.log('[stateChanged]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })

            client.onMessage((message) => {
                msgHandler(client, message)
            })
        })
        .catch(() => {
            console.log('ERROR');
        });
}

async function msgHandler (client, message) {
    try {
        // console.log(message)
        const { type, body, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message
        const { id, pushname } = sender
        const { name } = chat
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const commands = [
            '#sticker',
            '#stiker',
            '#halo',
            '#misuh',
            'kojok',
            'dimas',
            '#quote',
            '#quotes',
            'halo',
            'hi',
            'hai',
        ]
        const cmds = commands.map(x => x + '\\b').join('|')
        const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : ''
        const quotes = [
            `"Percuma kusiapkan dunia bila yang kamu inginkan cuma bapakku"`,
            `"Nyari duit memang susah, yang gampang ya ninggalin sholat"`,
            `"gapapa ga dapet kamu, yang penting dapet bapakmu"`,
            `"lembabkan bibirmu, mulutmu kasar"`,
            `"Namanya manusia hidup ya diselimuti masalah, kalo diselimuti wijen ya jadi onde onde aja"`,
            `"Are you some kind of kambing, because you make my heart terombang ambing"`,
            `"Kalo kamu nyari yang sesuai selera kamu, mungkin kamu cocoknya sama indomie"`,
            `"Daripada melukai diri sendiri lebih baik mabok saja"`,
            `"itu yang pacaran beda agama, Tuhannya berantem ga ya?"`,
            `"Pengen ngebalas kelakuanmu tapi Aku sadar manusia tidak boleh jahat sama binatang"`,
            `"Bayangin kamu dikick dari kartu keluarga cuma gara gara bapakmu gabut"`,
            `"Semakin dewasa semakin gak pengen pamer kekayaan, pamer pacar, pamer gadget mahal. bukannya takut riya, cuma emang gak punya aja."`,
            `"Kuntilanak aja dimana mana ketawa, masa lu yang sejenisnya cemberut mulu"`,
            `"Kamu jangan main ke rumahku ya, keluargaku takut sama anjing"`,
        ];
        const misuh = [
            'ANAK BABI',
            'NGENTOTT',
            'ASUU',
            'JANCOKK',
            'CANGKEMU BOSOK',
            'COCOTE KOYOK TAEK',
            'BACOD ANJENG',
            'TAEKK',
            'SILITT',
            'KELAMIN JANTANN',
            'DAJJAL',
            'COCOTE NING TILIS',
            'KEMEM',
            'RAIMU GELEM TAK DUPAK?',
            'GELOD AYOO',
            'LAMBEMU ISO MENENG RAK',
            'NDASMU',
            'UTEKE NING TILIS',
        ];


        if (cmd) {
            if (!isGroupMsg) console.log('[EXEC]', color(time, 'yellow'), color(cmd[0]), 'from', color(pushname))
            if (isGroupMsg) console.log('[EXEC]', color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(name))
            const args = body.trim().split(' ')
            switch (cmd[0].toLowerCase()) {
                case '#sticker':
                    if (isMedia) {
                        const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (quotedMsg && quotedMsg.type == 'image') {
                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else {
                        client.sendText(from, 'Kirim gambar pake hashtag #sticker GOBLOK !')
                    }
                    break
                case '#stiker':
                    if (isMedia) {
                        const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (quotedMsg && quotedMsg.type == 'image') {
                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else {
                        client.sendText(from, 'Kirim gambar pake hashtag #sticker GOBLOK !')
                    }
                    break
                case '#halo':
                        client.sendText(from, 'Hai');
                    break
                case 'kojok':
                case 'dimas':
                        client.sendText(from, 'Dimas biasa dipanggil Kojok omahe ngguri tower');
                    break
                case '#misuh':
                        client.sendText(from, misuh[Math.floor(Math.random() * misuh.length)]);
                    break
                case '#quotes':
                case '#quote':
                        client.sendText(from, quotes[Math.floor(Math.random() * quotes.length)]);
                    break
                case 'hi':
                case 'hai':
                        client.sendText(from, `Halo ${pushname ? pushname : ''}`);
                case 'halo':
                        client.sendText(from, `Hi ${pushname ? pushname : ''}`);
                    break
            }
        } else {
            if (!isGroupMsg) console.log(color('[RECV]'), color(time, 'yellow'), 'Message from', color(pushname))
            if (isGroupMsg) console.log(color('[RECV]'), color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

function color (text, color) {
    switch (color) {
        case 'red': return '\x1b[31m' + text + '\x1b[0m'
        case 'yellow': return '\x1b[33m' + text + '\x1b[0m'
        default: return '\x1b[32m' + text + '\x1b[0m' // default is green
    }
}

startServer()
