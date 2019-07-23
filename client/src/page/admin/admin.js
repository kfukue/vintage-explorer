import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import WineProducerForm from './wineProducer-form/wineProducer-form';
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

class Admin extends Component {
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
              <WineProducerForm {...this.props}>
              </WineProducerForm>
            </Grid>
          </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Admin);
