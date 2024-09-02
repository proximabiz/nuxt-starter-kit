import Joi from 'joi'

export const ProductFamilyValidation = Joi.object({
  proFamId: Joi.string().required(),
  descp: Joi.string().optional(),
  name: Joi.string().required(),
})

export const ProductItemValidation = Joi.object({
  subTypeId: Joi.string().required(), // for specific subcription type
  itemId: Joi.string().required(),
  descp: Joi.string().optional(),
  itemName: Joi.string().required(),
})

export const ProductItemPriceValidation = Joi.object({
  subTypeId: Joi.string().required(), // for specific subcription type
  name: Joi.string().required(),
  priceId: Joi.string().required(),
  price: Joi.number().required(),
  period: Joi.number().optional().default(1),
  currencyCode: Joi.string().valid('USD', 'EUR', 'INR').required(),
  periodUnit: Joi.string().valid('month', 'year').required(), // can add day & week also
})
