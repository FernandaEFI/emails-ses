import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      color: '#fff',
    },
    link: {
      fontSize: '1em',
      marginRight: theme.spacing(30),
      marginRight: '5em',

      [theme.breakpoints.down('md')]: {
        fontSize: '1em',
        flexGrow: 1,
        marginRight: '2rem',
      },
    },
    activeLink: {
      textDecoration: 'underline',
      textDecorationColor: '#9F1915',
    },
  })
);

function NavbarLink({ children, url, text }) {
  const classes = useStyles();

  const router = useRouter();

  const [path, setPath] = useState('');

  useEffect(() => {
    if (router.isReady) {
      setPath(router.asPath);
    }
  }, [router]);

  return (
    <Link
      href={path === url ? '#' : url}
      className={`${classes.root} ${path === url ? classes.activeLink : ''}`}
    >
      <Typography variant="text" className={classes.link}>
        {children}
      </Typography>
    </Link>
  );
}
export default NavbarLink;
