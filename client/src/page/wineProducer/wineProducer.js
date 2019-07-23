import React, { Component } from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import WineForm from './wine-form/wine-form';
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },

  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    flexBasis: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
});


class WineProducer extends Component {
  constructor(props, state){
    super(props);
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
          <Grid container spacing={1}
          direction="row"
          justify="center"
          alignItems="center">
            <Grid item xs>
              <WineForm {...this.props}>
              </WineForm>
            </Grid>
          </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(WineProducer);