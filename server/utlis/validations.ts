import Joi from 'joi'

export const ChartValidation = Joi.object({
  title: Joi.string().required(),
  diagramTypeId: Joi.string().required(),
  isDetailed: Joi.boolean().optional().default(false),
  details: Joi.string().optional(),
  diagramId: Joi.string().optional(),
})

export const PATCHChartUpdateValidation = Joi.object({
  existingOpenAIResponse: Joi.string().required(),
  isDiagramChanged: Joi.boolean().required(),
  diagramId: Joi.string().optional(),
})

export const PUTChartUpdateValidation = Joi.object({
  title: Joi.string().required(),
  isDetailed: Joi.boolean().optional().default(false),
  details: Joi.string().optional(),
  diagramId: Joi.string().optional(),
})

export const SignupValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  name: Joi.string().optional(),
})

export const CompleteOrderValidation = Joi.object({
  country: Joi.string().required(),
  region: Joi.string().required(),
  city: Joi.string().required(),
  zipcode: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),

  subscriptionTypeId: Joi.string().required(),
  planType: Joi.string().required(),
  currencyCode: Joi.string().length(3).required(),

  cardHolderName: Joi.string().required(),
  cardNumber: Joi.number().min(12).max(16).required(),
  expiryDate: Joi.string().min(5).max(5).required(),
  securityCode: Joi.number().min(3).max(4).required(),

})

export const UserAddressValidation = Joi.object({
  country: Joi.string().required(),
  region: Joi.string().required(),
  city: Joi.string().required(),
  zipcode: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  name: Joi.string().optional(),
  orgnizationName: Joi.string().optional(),
})

export const UserGSTValidation = Joi.object({
  gstNumber: Joi.string().required(),
})

export const UserAddressContactValidation = Joi.object({
  name: Joi.string().required(),
  organisationName: Joi.string().required(),
  country: Joi.string().required(),
  region: Joi.string().required(),
  city: Joi.string().required(),
  zipcode: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
})

export const UserSubscriptionValidation = Joi.object({
  userId: Joi.string().required(),
  subscriptionTypeId: Joi.string().required(),
  amount: Joi.number().required(),
})

export const CancelUserSubscriptionValidation = Joi.object({
  userId: Joi.string().required(),
  userSubscriptionId: Joi.string().required(),
  note: Joi.string().max(100).optional(),
})

export const ContactUsValidation = Joi.object({
  name: Joi.string().required(),
  message: Joi.string().required(),
  industry: Joi.string().optional().default('-'),
  requestFor: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
})
