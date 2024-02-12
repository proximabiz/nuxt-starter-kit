import Joi from 'joi'

export const ChartValidation = Joi.object({
  title: Joi.string().required(),
  diagramTypeId: Joi.string().required(),
  isDetailed: Joi.boolean().optional().default(false),
  details: Joi.string().optional(),
})

export const ChartUpdateValidation = Joi.object({
  userKeyword: Joi.string().optional(),
  isDetailed: Joi.boolean().optional().default(false),
  userRequirement: Joi.string().optional(),
  existingOpenAIResponse: Joi.string().optional(),
})

export const SignupValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  name: Joi.string().optional(),
})

export const UserAddressValidation = Joi.object({
  country: Joi.string().required(),
  region: Joi.string().required(),
  city: Joi.string().required(),
  zipcode: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
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
  ammount: Joi.number().required(),
})

export const CancelUserSubscriptionValidation = Joi.object({
  userId: Joi.string().required(),
  userSubscriptionId: Joi.string().required(),
  note: Joi.string().max(100).optional(),
})
