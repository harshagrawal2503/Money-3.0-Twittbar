export class HttpError extends Error {
  constructor(message, status) {
      super(message);
      this.status = status;
  }
}

export default async function HttpErrorHandler(req, res, { getFn, postFn }) {
  const method = req.method.toUpperCase();
  try {

    if (method === 'GET' && getFn != null)
      res.status(200).json(await getFn(req.query));
    else if (method === 'POST' && postFn != null)
      res.status(200).json(await postFn(req.body));
    else
      res.status(405).send();

  } catch (e) {
    if (e instanceof HttpError) {
      res.status(e.status).json({ error: e.message });
    }
    else {
      console.error(e);
      res.status(500).send();
    }
  }
}