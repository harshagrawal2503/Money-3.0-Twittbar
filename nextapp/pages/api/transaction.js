import { getRecent, postRecent } from '../../handler/recent';
import HttpErrorHandler from '../../helpers/HttpError';

export default async function handler(req, res) {
  HttpErrorHandler(req, res, {
    getFn: getRecent,
    postFn: postRecent,
  });
}
