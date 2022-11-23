import React, { useState } from 'react';

import {
  ThemeProvider,
  createTheme,
  withStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import NavbarLink from './navbar-link';
import NavbarMobile from './navbar-mobile';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { useSession, signOut } from 'next-auth/client';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});
const styles = (theme) => ({
  palette: {
    type: 'dark',
  },
  root: {
    position: 'absolute',
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1em',
    },
  },
  buttonBar: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    display: 'flex',
    fontSize: '1em',
  },
  NavbarLink: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '1em',
    },
  },
  button: {
    '&:hover': {
      backgroundColor: '#9F1915  !important',
    },
    fontSize: '10px',
    display: 'flex',
    justifyContent: 'center',
    marginRight: '5em',
  },
  activeLinkAdmin: {
    diplay: 'none',
  },
});

const NavbarMenu = (props) => {
  const [session, loading] = useSession();
  const [rolUser, setRolUser] = useState([]);

  if (loading) {
    return null;
  }

  if (session) {
    var user = session.user.name; /* required */

    const rolSession = () => {
      fetch('/api/userSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      })
        .then((response) => response.json())
        .then(({ error, rol }) => {
          if (error) {
            console.error(error);
          } else {
            // console.log('Sesion',rol);
            setRolUser(rol);
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    };

    const rol = rolSession();
    return (
      <div className={props.classes.root}>
        <ThemeProvider theme={theme}>
          <NavbarMobile>
            <NavbarLink url={'/reject-bonces'}>
              <AllInboxIcon />
              Correos rebotados
            </NavbarLink>
            <NavbarLink url={'/supresslist'}>
              <ClearAllIcon />
              Lista de supresion
            </NavbarLink>
            {rolUser == 'ADMINISTRADOR' && (
              <NavbarLink url={'/admin'}>
                <ClearAllIcon />
                Usurios
              </NavbarLink>
            )}

            <Button
              className={props.classes.button}
              onClick={() => signOut()}
              color="inherit"
            >
              <ExitToAppIcon />
              Cerrar sesion
            </Button>
          </NavbarMobile>
        </ThemeProvider>
        <div className={props.classes.buttonBar}>
          <NavbarLink url={'/reject-bonces'}>Correos rebotados</NavbarLink>
          <NavbarLink url={'/supresslist'}>Lista de supresión</NavbarLink>
          {rolUser == 'ADMINISTRADOR' && (
            <NavbarLink url={'/admin'}>Usuarios</NavbarLink>
          )}

          <Button
            className={props.classes.button}
            color="inherit"
            onClick={() =>
              signOut({
                callbackUrl: `${window.location.origin}/api/auth/logout`,
              })
            }
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    );
  }
};

export default withStyles(styles)(NavbarMenu);
