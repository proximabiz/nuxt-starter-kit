import type { MailDataRequired } from '@sendgrid/mail'
import sgMail from '@sendgrid/mail'
import type { EventHandlerRequest, H3Event } from 'h3'
import { defineEventHandler } from 'h3'
import { CustomError } from '../../utlis/custom.error'
import { ContactUsValidation } from '../../utlis/validations'

const sendgridApiKey = useRuntimeConfig().private.SENDGRID_API_KEY
const sendgridEmailTempletId = useRuntimeConfig().private.SENDGRID_EMAIL_TEMPLATE_ID
const sendgridEmailFromId = useRuntimeConfig().private.SENDGRID_FROM_EMAILID

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const params = await readBody(event)
  const validate = await ContactUsValidation.validateAsync(params)
  if (!validate)
    throw new CustomError('Invalid input provided', 401)

  sgMail.setApiKey(sendgridApiKey)
  const recipients = ['raveenas@proximabiz.com', 'ipsitap@proximabiz.com', 'supriyap@proximabiz.com']

  const msg: MailDataRequired = {
    to: recipients,
    from: sendgridEmailFromId,
    templateId: sendgridEmailTempletId,
    dynamicTemplateData: {
      name: params.name,
      email: params.email,
      industry: params.industry ? params.industry : ' - ',
      requestFor: params.requestFor,
      phone: params.phoneNumber,
      message: params.message,
    },
  }
  try {
    const response = await sgMail.send(msg)
    if (response)
      return { message: 'We have recieved your request will get back to you soon!', status: 201 }
  }
  catch (error) {
    console.error('Error sending email:', error)
    throw new CustomError('Bad Request: Failed to send email, Please try again', 400)
  }
})
