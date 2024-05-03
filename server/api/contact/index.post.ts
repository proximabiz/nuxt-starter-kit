import type { MailDataRequired } from '@sendgrid/mail'
import sgMail from '@sendgrid/mail'
import axios from 'axios'
import type { EventHandlerRequest, H3Event } from 'h3'
import { defineEventHandler } from 'h3'
import { CustomError } from '../../utlis/custom.error'
import { ContactUsValidation } from '../../utlis/validations'

const sendgridApiKey = useRuntimeConfig().SENDGRID_API_KEY as string
const sendgridEmailTempletId = useRuntimeConfig().SENDGRID_EMAIL_TEMPLATE_ID as string
const sendgridEmailFromId = useRuntimeConfig().SENDGRID_FROM_EMAILID as string
const secretkey = useRuntimeConfig().GOOGLE_CAPTCHA_SECRET_KEY
export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const params = await readBody(event)
  const validate = await ContactUsValidation.validateAsync(params)
  if (!validate)
    throw new CustomError('Invalid input provided', 401)
  const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: secretkey,
      response: params.token,
    },
  })
  if (response.data.success) {
    sgMail.setApiKey(sendgridApiKey)
    const recipients = ['sharak@proximabiz.com', 'sriharim@proximabiz.com', 'tejeswarik@proximabiz.com', 'bijalb@proximabiz.com', 'rajashreeb@proximabiz.com', 'priyatham@proximabiz.com', 'Supriyap@proximabiz.com']
    const msg: MailDataRequired = {
      to: recipients as any,
      from: sendgridEmailFromId as any,
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
      throw new CustomError(`Bad Request: ${error}`, 400)
    }
  }
  else {
    throw new CustomError('reCAPTCHA verification failed', 404)
  }
})
