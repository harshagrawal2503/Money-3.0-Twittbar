import clientPromise from '../helpers/mongodb';
import { insertSchema, querySchema } from '../helpers/schema';
import { HttpError } from '../helpers/HttpError';
import TwitterClient from '../helpers/TwitterClient';

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION; // Todo: update to better name

async function getRecent(query) {
  const validate = querySchema.validate(query, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  const mclient = await clientPromise;
  const db = mclient.db(process.env.MONGODB_DB);

  const _query = validate.value;
  const limit = _query.limit || 5;
  const skip = _query.skip || 0;
  delete _query.limit;
  delete _query.skip;

  const results = await db.collection(MONGODB_COLLECTION)
    .find(_query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // get twitter user details
  const uniqueTo = results.map(o => o.to).filter((value, index, self) => self.indexOf(value) === index);
  console.log('uniqueTo', uniqueTo);

  const client = TwitterClient.v2();
  const tresults = await client.get('users/by', {
    'usernames': uniqueTo.join(','),
    'user.fields': 'profile_image_url,verified',
  });

  const tuserMap = {};
  tresults.data.forEach(element => tuserMap[element.username] = element);

  return results.map(element => Object.assign(element, { twitter: tuserMap[element.to] }));
}

async function postRecent(body) {
  const validate = insertSchema.validate(body, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  const mclient = await clientPromise;
  const db = mclient.db(process.env.MONGODB_DB);

  const transaction = validate.value;
  const mresult = await db.collection(MONGODB_COLLECTION)
    .insertOne(transaction);

  // sent twitter direct message
  if (process.env.DISABLE_DM === 'true')
    return mresult;

  const t2client = TwitterClient.v2();
  const t2result = await t2client.get('users/by/username/' + validate.value.to);
  console.log(t2result);
  const recipientId = t2result.data.id;

  const t1client = TwitterClient.v1();
  const t1result = await t1client.post(
    "direct_messages/events/new",
    {
      event: {
        type: 'message_create',
        message_create: {
          target: {
            recipient_id: recipientId,
          },
          message_data: {
            text: `You have receive ${validate.value.amount} ℏ from ${validate.value.from}.\nGo to ${process.env.NEXTAUTH_URL} to setup and receive ℏ.`
          },
        },
      }
    },
  );

  return t1result;
}

export { getRecent, postRecent };