async function handleLogout(req, res) {
  // Uncomment for FusionAuth
  // res.redirect(`http://${process.env.FUSIONAUTH_DOMAIN}/oauth2/logout?client_id=${process.env.FUSIONAUTH_CLIENT_ID}`);

  // Uncomment for Cognito
  res.redirect(
    `https://${process.env.COGNITO_DOMAIN}/logout?client_id=${process.env.COGNITO_CLIENT_ID}&logout_uri=${process.env.COGNITO_LOGOUT_URL}`
  );
}

export default async function logout(req, res) {
  try {
    await handleLogout(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
