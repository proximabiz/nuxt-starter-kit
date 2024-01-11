import Joi from 'joi';

export const ChartValidation = Joi.object({
  userKeyword: Joi.string().required(),
  diagramType: Joi.string().required(),
  isDetailed: Joi.boolean().optional(),
  userRequirement: Joi.string().optional(),
});

export const ChartUpdateValidation = Joi.object({
    userKeyword: Joi.string().optional(),
    isDetailed: Joi.boolean().optional(),
    userRequirement: Joi.string().optional(),
  });
