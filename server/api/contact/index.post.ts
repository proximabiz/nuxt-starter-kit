import type { MailDataRequired } from '@sendgrid/mail'
import sgMail from '@sendgrid/mail'
import type { EventHandlerRequest, H3Event } from 'h3'
import { defineEventHandler } from 'h3'
import { CustomError } from '../../utlis/custom.error'
import { ContactUsValidation } from '../../utlis/validations'

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const params = await readBody(event)
  const validate = await ContactUsValidation.validateAsync(params)
  if (!validate)
    throw new CustomError('Invalid input provided', 401)

  sgMail.setApiKey('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')
  const recipients = ['raveenas@proximabiz.com', 'ipsitap@proximabiz.com', 'supriyap@proximabiz.com']

  const msg: MailDataRequired = {
    to: recipients,
    from: 'reshub@proximabiz.com',
    templateId: 'd-0f96b3e0ad35403aa4f9f205fd3f5809',
    dynamicTemplateData: {
      name: params.name,
      email: params.email,
      industry: params.industry,
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
    throw new CustomError('Failed to send email', 500)
  }
})
