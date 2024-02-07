import Joi from 'joi'

export const ChartValidation = Joi.object({
  title: Joi.string().required(),
  diagramTypeId: Joi.string().required(),
  isDetailed: Joi.boolean().optional().default(false),
  details: Joi.string().optional(),
})

export const ChartUpdateValidation = Joi.object({
  userKeyword: Joi.string().optional(),
  isDetailed: Joi.boolean().optional(),
  userRequirement: Joi.string().optional(),
})

export const SignupValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  name: Joi.string().optional(),
})

export const UserAddressValidation = Joi.object({
  country: Joi.string().required(),
  state: Joi.string().optional(),
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
