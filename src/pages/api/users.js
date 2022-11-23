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

handler.get(async (req, res) => {
  try {
    var params = {
      GroupName: process.env.GROUP_NAME,
      UserPoolId: process.env.USER_POOL_ID,
    };
    var data = await cognitoidentityserviceprovider
      .listUsersInGroup(params)
      .promise();

    const rows = data.Users.map(
      ({ Attributes: attributeList, Username: id, UserStatus: status }) => {
        let json = [{}];

        for (var x of attributeList) {
          if (x.Name == 'custom:rol') {
            x.Name = 'rol';
          }
          json[0][x.Name] = x.Value;
        }

        for (var c of json) {
          var email = c.email;
          var nickname = c.nickname;
          var name = c.name;
          var rol = c.rol;
        }

        return { id, status, email, nickname, name, rol };
      }
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});

handler.post(async (req, res) => {
  const { name, nickname, email, password, rol } = req.body;

  try {
    if (!email) {
      throw new Error(`Favor de indicar el correo electronico.`);
    }
    if (!name) {
      throw new Error(`Favor de indicar el nombre.`);
    }
    if (!nickname) {
      throw new Error(`Favor de indicar el nickname.`);
    }
    if (!rol) {
      throw new Error(`Favor de indicar el rol.`);
    }
    if (!password) {
      throw new Error(`Favor de indicar el password.`);
    }

    var params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,

      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'name',
          Value: name,
        },
        {
          Name: 'custom:rol',
          Value: rol,
        },
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'nickname',
          Value: nickname,
        },
      ],
    };
    const data = await cognitoidentityserviceprovider
      .adminCreateUser(params)
      .promise();
    const userData = data.User;
    const dataUser = [userData].map(({ Username: id, UserStatus: status }) => {
      var params = {
        GroupName: process.env.GROUP_NAME,
        UserPoolId: process.env.USER_POOL_ID,
        Username: id,
      };
      cognitoidentityserviceprovider.adminAddUserToGroup(
        params,
        function (err, data) {
          if (err) {
            throw new Error(err, err.stack);
          } // successful response
        }
      );
      return { id, status };
    });

    res.status(200).json({ dataUser });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});
handler.put(async (req, res) => {
  const { idUser, rol } = req.body;

  try {
    if (!idUser) {
      throw new Error(`Favor de indicar el id de usuario.`);
    }
    if (!rol) {
      throw new Error(`Favor de indicar el rol.`);
    }

    var params = {
      UserAttributes: [
        {
          Name: 'custom:tipo_usuario',
          Value: rol,
        },
        /* more items */
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: idUser,
    };

    const response = await cognitoidentityserviceprovider
      .adminUpdateUserAttributes(params)
      .promise();

    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});

handler.delete(async (req, res) => {
  const { idUser } = req.body;

  try {
    if (!idUser) {
      throw new Error(`Favor de indicar el id de usuario.`);
    }

    var params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: idUser,
    };

    const response = await cognitoidentityserviceprovider
      .adminDeleteUser(params)
      .promise();

    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
  res.end();
});
export default handler;
