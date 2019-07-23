import Joi from '@hapi/joi'

const schema = {
  isProduction: Joi.boolean(),
  isDevelopment: Joi.boolean(),
};



export function validate(configuration) {
  return Joi.validate(configuration, schema);
}

