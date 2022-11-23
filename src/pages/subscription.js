import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';

import Image from 'next/image';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    margin: 50,
    padding: theme.spacing(2),
    minHeight: 'calc(70vh)',
    textAlign: 'center',
  },
  title: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1),
      fontSize: theme.typography.h4.fontSize,
      textAlign: 'center',
    },
  },
  toolBar: {
    display: 'flex',

    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(0),
    },
  },
  footer: {
    position: 'fixed',
    flexGrow: 1,
    color: '#006194',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
  },
}));

export default function Subscription() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const { email } = router.query;

  function unsuscription(email) {
    fetch('/api/supresslist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, reason: 'COMPLAINT' }),
    })
      .then((response) => response.json())
      .then(({ error }) => {
        if (error) {
          enqueueSnackbar(`${error}`, {
            variant: 'error',
            persist: true,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
        } else {
          enqueueSnackbar('Anulación de envió de correo exitoso.', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
        }
      })
      .catch((error) => {
        image.png;
        enqueueSnackbar(`${error.message}`, {
          variant: 'error',
          persist: true,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      });
  }

  useEffect(() => {
    if (email) unsuscription(email);
  }),
    [email];

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static" style={{ backgroundColor: 'inherit' }}>
          <Toolbar className={classes.toolBar}>
            <div>
              <Image
                className={classes.logo}
                src="/images/logos/eficiencia.png"
                alt="logo"
                width="250"
                height="50"
              />
            </div>
          </Toolbar>
        </AppBar>
        <div
          style={{ backgroundColor: '#DB1718', width: '100%', height: '10px' }}
        ></div>
        <div
          style={{ backgroundColor: '#006194', width: '100%', height: '10px' }}
        ></div>
      </div>
      <div className={classes.container}>
        <Typography gutterBottom variant="h4" className={classes.title}>
          Suscripción
        </Typography>

        <Grid style={{ marginTop: '50px' }}>
          <Box>
            <Typography gutterBottom variant="h5">
              Lamentamos que no quieras seguir recibiendo nuestros correos.
            </Typography>
            <Typography gutterBottom variant="body1" className={classes.title}>
              La suscripción para el correo:
              <span style={{ color: '#006194' }}> {email}</span>, ha sido
              anulada.
            </Typography>
          </Box>
        </Grid>
      </div>
      <div>
        <footer className={classes.footer}>
          <div>
            <div>
              <Typography gutterBottom variant="body1">
                atencionaclientes@eficienciainformativa.com
              </Typography>
              <Typography gutterBottom variant="body1">
                Teléfono: 52 41 59 70
              </Typography>
            </div>
            <div
              style={{
                backgroundColor: '#DB1718',
                width: '100%',
                height: '10px',
              }}
            ></div>
            <div
              style={{
                backgroundColor: '#006194',
                width: '100%',
                height: '10px',
              }}
            ></div>
          </div>
        </footer>
      </div>
    </>
  );
}
