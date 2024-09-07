import Joi from 'joi';

const insertSchema = Joi.object({
  transactionId: Joi.string()
    .pattern(/^\d.\d.\d+@\d+.\d+$/, 'Hedera Transaction')
    .required(),
  from: Joi.string()
    .pattern(/^\d.\d.\d+$/, 'Hedera Account')
    .required(),
  to: Joi.string()
    .lowercase()
    .required(),
  timestamp: Joi.date()
    .timestamp()
    .required(),
  amount: Joi.number()
    .required(),
});

const querySchema = Joi.object({
  from: Joi.string()
    .pattern(/^\d.\d.\d+$/, 'Hedera Account'),
  to: Joi.string()
    .lowercase(),
  limit: Joi.number(),
  skip: Joi.number(),
});

const userValidateSchema = Joi.object({
  handle: Joi.string()
    .lowercase()
    .required(),
});

const accountMapSchema = Joi.object({
  handle: Joi.string()
    .lowercase()
    .required(),
  account: Joi.string()
    .pattern(/^\d.\d.\d+$/, 'Hedera Account')
    .required(),
});

export { insertSchema, querySchema, userValidateSchema, accountMapSchema };