import React from 'react';
import Image from 'next/image';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Router from 'next/router';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useSession, signIn, signOut } from 'next-auth/client';

import RejectBounces from './reject-bonces';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Eficiencia Informativa
      </Link>{' '}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.palette.secondary.main },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Index() {
  const classes = useStyles();
  const [session, loading] = useSession();

  if (loading) {
    return null;
  }

  if (session) {
    return (
      <>
        <RejectBounces></RejectBounces>
      </>
    );
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Image
            className={classes.logo}
            src="/images/logos/eficiencia.png"
            alt="logo"
            width="300"
            height="50"
          />
          <Typography component="h1" variant="h5">
            Bienvenido
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() =>
              signIn('cognito', {
                callbackUrl: `${window.location.origin}/reject-bonces`,
              })
            }
          >
            Iniciar Sesión
          </Button>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
}