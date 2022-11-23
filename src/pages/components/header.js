import Image from 'next/image';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import NavbarMenu from './navbar-menu';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    logo: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    toolBar: {
      display: 'flex',

      [theme.breakpoints.down('xs')]: {
        gap: theme.spacing(0),
      },
    },
  })
);

function Header(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
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
          <NavbarMenu />
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default Header;
