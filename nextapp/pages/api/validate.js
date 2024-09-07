import TwitterClient from '../../helpers/TwitterClient';
import { userValidateSchema } from '../../helpers/schema';
import HttpErrorHandler, { HttpError } from '../../helpers/HttpError';

export default async function handler(req, res) {
  HttpErrorHandler(req, res, {
    getFn: validateUser,
  });
}

async function validateUser(query) {
  const validate = userValidateSchema.validate(query, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  const client = TwitterClient.v2();
  const result = await client.get('users/by/username/' + validate.value.handle, {
    'user.fields': 'profile_image_url,verified',
  });

  if (result.errors)
    throw new HttpError(result.errors[0].detail, 404);

  return result.data;
}