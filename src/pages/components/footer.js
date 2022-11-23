import Image from 'next/image';

import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';

import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      color: '#FFF',
      background: '#1e3647',
      bottom: 0,
      width: '100%',
    },
    contenedor: {
      display: 'flex',
      justifyContent: 'center',
      padding: '2em',
      margin: 'auto',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },

    efinfo: {
      float: 'left',
      width: '50%',
      justifyContent: 'center',
      textAlign: 'center',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    copy: {
      fontSize: '1em',
    },
    soporte: {
      width: '50%',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
      },
    },
    item: {
      marginTop: '0',
      color: 'primary',
      display: 'flex',
    },
    email: {
      fontSize: '15px',
      marginLeft: '0.5em',
    },
  })
);

function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.root}>
      <div className={classes.contenedor}>
        <div className={classes.efinfo}>
          <Image
            className={classes.logo}
            src="/images/logos/eficiencia.png"
            alt="logo"
            width="250"
            height="50"
          />
          <div className={classes.copy}>EFINFO © 2021</div>
        </div>
        <div className={classes.soporte}>
          <div className={classes.item}>
            <EmailIcon></EmailIcon>
            <Typography variant="h6" className={classes.email}>
              gabriela.cuellar.efinfo@gmail.com
            </Typography>
          </div>
          <div className={classes.item}>
            <EmailIcon></EmailIcon>
            <Typography variant="h6" className={classes.email}>
              dadne.cruz.efinfo@gmail.com
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
