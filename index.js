const fetch = require('node-fetch')
const arg = require('arg')
const path = require('path')
const { readFileSync } = require('fs')
const cwd = process.cwd()

async function request (options, tip) {
  const response = await fetch("http://mail.richole.cn:3000/", {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(options)
  }).then(res => res.text())

  const isSuccess = response.startsWith('ok')

  if (tip) {
    console.log(isSuccess ? '发送成功' : `发送失败: ${response}`)
  }

  return response
}

let consoleTip = () => {
  console.log("请输入邮箱、标题、内容或HTML, 若发送文件加上参数 --files")
  console.log("例如: mailer --to richole.yu@qq.com --subject 你好 --content 世界 --files package.json --files package-lock.json")
  console.log("例如: mailer --to richole.yu@qq.com --subject 你好 --content 世界 --files ./*")
}

function getDefaultOptions () {
  let args = null
  try {
    args = arg({
      '--files': [String],
      '--to': String,
      '--subject': String,
      '--content': String,
      '--html': String
    });
  } catch (err) {
    console.log(err.message);
    process.exit(0)
  }

  const otherFile = args['_'] || []
  const to = args['--to']
  const subject = args['--subject'] || 'Hi'
  const file = args['--files'] || []
  const content = args['--content'] || 'Richole'
  const html = args['--html'] || ''
  const files = [...file, ...otherFile].map(filename => ({
    filename,
    base64: readFileSync(path.resolve(cwd, filename)).toString('base64')
  }))

  if (!to) {
    consoleTip()
    process.exit(0)
  }

  return {
    to,
    subject,
    content,
    html,
    files
  }

}

module.exports = function sendEmail (options, tip = false) {
  if (!options) {
    options = getDefaultOptions()
    tip = true
  }

  const newOptions = {
    to: options.to || '',
    subject: options.subject || '',
    text: options.content || '',
    html: options.html || '',
    attachments: options.files || []
  }

  return request(newOptions, tip)
}

