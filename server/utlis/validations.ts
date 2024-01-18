import Joi from 'joi'

export const ChartValidation = Joi.object({
  title: Joi.string().required(),
  diagramTypeId: Joi.string().required(),
  isDetailed: Joi.boolean().optional(),
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
