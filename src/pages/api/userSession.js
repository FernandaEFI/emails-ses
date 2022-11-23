import AWS from 'aws-sdk';
import nextConnect from 'next-connect';
const handler = nextConnect();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});
AWS.config.apiVersions = {
  cognitoidentityserviceprovider: '2016-04-18',
  // other service API versions
};
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

handler.post(async (req, res) => {
  const { user } = req.body;
  try {
    var params = {
      UserPoolId: process.env.USER_POOL_ID /* required */,
      Username: user /* required */,
    };
    var data = await cognitoidentityserviceprovider
      .adminGetUser(params)
      .promise();
    const userAttributes = data.UserAttributes;
    for (var atributes of userAttributes) {
      if (atributes.Name == 'custom:rol') {
        var rol = atributes.Value;
      }
    }
    //console.log('data', rol);
    res.status(200).json({ rol: rol });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});

export default handler;
