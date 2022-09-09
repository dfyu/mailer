type attachment = {
  /** 文件名 */
  filename: string
  /** 文件base64 */
  base64: string
}

type EmailOption = {
  /** 邮件邮箱 */
  to: string
  /** 邮件标题 */
  subject?: string
  /** 邮件内容 */
  content?: string
  /** 邮件html，content有值时优先使用content */
  html?: string
  /** 邮件附件 */
  attachments?: attachment []
}

export default function sendEmail (option: EmailOption, tip?: boolean)
