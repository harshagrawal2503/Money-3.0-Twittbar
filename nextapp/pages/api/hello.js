// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import TwitterClient from '../../helpers/TwitterClient';

export default async function handler(req, res) {
  res.status(200).json({ health: 'pass' });
  return;

  const client = TwitterClient.v1();
  const result = await client.post(
    "direct_messages/events/new",
    {
      event: {
        type: 'message_create',
        message_create: {
          target: {
            recipient_id: '153368788',
          },
          message_data: {
            text: "hello world"
          },
        },
      }
    },
  );

  console.log(result);
  res.status(200).json(result)
}
