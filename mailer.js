#!/usr/bin/env node
const path = require("path")
const fs = require("fs")
const util = require("util")
const os = require("os")
const nodeMailer = require("nodemailer")
const exist = util.promisify(fs.exists)
const readFile = util.promisify(fs.readFile)
const homedir = os.homedir()
const cwd = process.cwd()
const filepath = path.resolve(cwd, process.argv[2])
const configName = "mailer.config"
const configPath = path.resolve(homedir, configName)

async function sendMail (filepath, config) {
    const filename = path.basename(filepath)
    const options = {
        from: "Richole <richole.yu@qq.com>",
        to: "yudafu_kzx@citicbank.com",
        subject: filename,
        text: filename,
        html: filename,
        attachments: [{
            path: filepath,
            filename ,
            cid: Date.now().toString()
        }]
    }
    try {
        let info = await nodeMailer.createTransport({
            host: config.host,
            secureConnection: true,
            auth: {
                user: config.user,
                pass: config.pass
            }
        }).sendMail(options)
        console.log(info.response, filename)
    } catch (error) {
        console.log(error, filename)
    }
}

(async function () {
    const isExist = await exist(filepath)
    const isExistConfig = await exist(configPath)
    if (!isExistConfig) {
        console.log(`no mailer.config in ${homedir}`)
        return
    }
    if (isExist) {
        let config = await readFile(configPath)
        config = JSON.parse(config.toString().trim())
        sendMail(filepath, config)
    } else {
        console.log("error!, example: mailer ~/Downloads/test.zip")
    }
})()
