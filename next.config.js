module.exports = {
  reactStrictMode: true,
  webpack5: false,

  env: {
    REGION: process.env.REGION,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    TABLE_NAME: process.env.TABLE_NAME,
    USER_POOL_ID: process.env.USER_POOL_ID,
    GROUP_NAME: process.env.GROUP_NAME,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
    COGNITO_LOGOUT_URL: process.env.COGNITO_LOGOUT_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};
