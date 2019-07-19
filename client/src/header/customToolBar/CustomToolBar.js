import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { UPortButton } from 'rimble-ui';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();

  return (
      <div className={classes.root}>
        <HideOnScroll {...props}>
          <AppBar>
            <Toolbar>
              <UPortButton>Connect with uPort</UPortButton>
              <Typography variant="h6" className={classes.title}>
                <Link to="/">Home</Link>
              </Typography>
              <Typography variant="h6" className={classes.title}>
                <Link to="/wineProducers">Wine Prodcuers</Link>
              </Typography>
              <Typography variant="h6" className={classes.title}>
                <Link to="/admin">Admin</Link>
              </Typography>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
      </div>
  );
}