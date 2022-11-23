import AWS from 'aws-sdk';
import nextConnect from 'next-connect';
const handler = nextConnect();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION,
});

const docClient = new AWS.DynamoDB({
  region: process.env.REGION,
});

handler.get(async (req, res) => {
  const { startDate, endDate } = req.query;

  const params = {
    TableName: process.env.TABLE_NAME,
  };
  if (startDate && endDate) {
    params.FilterExpression = '#date BETWEEN :startTime AND :endTime';
    params.ExpressionAttributeValues = {
      ':startTime': startDate,
      ':endTime': endDate,
    };
    params.ExpressionAttributeNames = { '#date': 'SnsPublishTime' };
  }
  // const params = {
  //   TableName: process.env.TABLE_NAME,
  //   FilterExpression: '#date BETWEEN :startTime AND :endTime',
  //   ExpressionAttributeValues: {
  //     ':startTime': startDate,
  //     ':endTime': endDate,
  //   },
  //   ExpressionAttributeNames: { '#date': 'SnsPublishTime' },
  // };
  try {
    const data = await dynamoDB.scan(params).promise();
    const rows = data.Items.map(
      ({
        SESMessageId: id,
        SESDestinationAddress: to,
        SESOriginAddress: from,
        SESDestinos: destinos,
        SnsPublishTime: date,
        SESstatus: status,
        SnsPublishHour: hour,
        SESSubject: subject,
        SESMessageType: messageType,
      }) => {
        return {
          id,
          to,
          from,
          destinos,
          date,
          status,
          hour,
          subject,
          messageType,
        };
      }
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});

const STATUS = ['atendido', 'pendiente'];

handler.post(async (req, res) => {
  const { id, date, status } = req.body;

  try {
    if (!id) {
      throw new Error(`Favor de indicar el id.`);
    }

    if (!date) {
      throw new Error(`Favor de indicar la fecha.`);
    }

    if (!status) {
      throw new Error(
        `Favor de indicar el estatus a asignar.(${STATUS.join(',')})`
      );
    }

    if (!STATUS.includes(status)) {
      throw new Error(
        `Favor de indicar estatus valido. (${REASONS.join(',')}).`
      );
    }

    const params = {
      ExpressionAttributeNames: {
        '#SES': 'SESstatus',
      },
      ExpressionAttributeValues: {
        ':s': {
          S: status,
        },
      },
      Key: {
        SESMessageId: {
          S: id,
        },
        SnsPublishTime: {
          S: date,
        },
      },
      TableName: 'SESNotifications',
      UpdateExpression: 'SET  #SES = :s',
    };

    const response = await docClient.updateItem(params).promise();

    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});

export default handler;
