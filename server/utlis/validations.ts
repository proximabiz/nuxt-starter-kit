import Joi from 'joi'

export const ChartValidation = Joi.object({
  title: Joi.string().required(),
  diagramTypeId: Joi.string().required(),
  isDetailed: Joi.boolean().optional().default(false),
  details: Joi.string().optional(),
  diagramId: Joi.string().optional(),
  subTypeId: Joi.string().required(),
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
  subTypeId: Joi.string().required(),
})

export const SignupValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  name: Joi.string().optional(),
})

export const CompleteOrderValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  country: Joi.string().required(),
  region: Joi.string().required(),
  city: Joi.string().required(),
  zipcode: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  amount: Joi.number().required(),
  email: Joi.string().required().email(),
  subscriptionTypeId: Joi.string().required(),
  planType: Joi.string().valid('monthly', 'yearly').required(),
  currencyCode: Joi.string().valid('INR', 'EUR', 'USD').min(3).max(3).length(3).required(),
  gstNumber: Joi.string().optional(),

  cardHolderName: Joi.string().required(),
  cardNumber: Joi.string().creditCard().required(),
  expiryMonth: Joi.number().integer().positive().required(),
  expiryYear: Joi.number().integer().positive().required(),
  securityCode: Joi.string().min(3).max(4).required(),

})

export const CustomerCardValidation = Joi.object({
  cardHolderName: Joi.string().required(),
  cardNumber: Joi.string().creditCard().required(),
  expiryMonth: Joi.number().integer().positive().required(),
  expiryYear: Joi.number().integer().positive().required(),
  securityCode: Joi.string().min(3).max(4).required(),
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
  email: Joi.string().email().required(),
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
  token: Joi.string().required(),
})

export const UserCardDetailsValidation = Joi.object({
  userId: Joi.string().required(),
})
export const PaymentHistoryLimitValidation = Joi.object({
  limit: Joi.number().optional(),
})
