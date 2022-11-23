import {
  SESv2Client,
  ListSuppressedDestinationsCommand,
  DeleteSuppressedDestinationCommand,
  PutSuppressedDestinationCommand,
} from '@aws-sdk/client-sesv2';

import nextConnect from 'next-connect';

function getClient(region) {
  return new SESv2Client({
    // region: process.env.REGION,
    region,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    },
  });
}

const handler = nextConnect();

handler.get(async (req, res) => {
  const param = {
    Reasons: ['BOUNCE', 'COMPLAINT'],
  };

  const { region } = req.query;

  const client = getClient(region);

  try {
    const command = new ListSuppressedDestinationsCommand(param);
    const listSuppressedData = await client.send(command);
    const emailList = listSuppressedData.SuppressedDestinationSummaries.map(
      ({ EmailAddress: email, Reason: reason }) => {
        return { email, reason };
      }
    );
    res.status(200).json({
      data: emailList,
    });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});

const REASONS = ['BOUNCE', 'COMPLAINT'];

handler.post(async (req, res) => {
  const { email, reason, region } = req.body;

  const client = getClient(region);
  try {
    if (!email) {
      throw new Error(`Favor de indicar el correo electronico.`);
    }

    if (!reason) {
      throw new Error(
        `Favor de indicar la razon por la cual se agregara a la lista (${REASONS.join(
          ','
        )}).`
      );
    }

    if (!REASONS.includes(reason)) {
      throw new Error(
        `Favor de indicar una razon valida por la cual se agregara a la lista (${REASONS.join(
          ','
        )}).`
      );
    }

    const params = {
      EmailAddress: email,
      Reason: reason,
    };
    const command = new PutSuppressedDestinationCommand(params);
    const response = await client.send(command);
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});

handler.delete(async (req, res) => {
  const { email, region } = req.body;

  const client = getClient(region);

  try {
    if (!email) {
      throw new Error(`Favor de indicar el correo electronico.`);
    }
    var params = {
      EmailAddress: email,
    };
    const command = new DeleteSuppressedDestinationCommand(params);
    const {
      $metadata: { attempts, httpStatusCode, requestId, totalRetryDelay },
    } = await client.send(command);

    res
      .status(200)
      .json({ attempts, httpStatusCode, requestId, totalRetryDelay });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});

export default handler;
