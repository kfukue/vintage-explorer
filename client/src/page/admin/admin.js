import React, { Component } from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import MenuIcon from '@material-ui/icons/Menu';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import * as Wine from '../../constants/wine'
import WineProducerForm from '../wineProducer/wineProducer-form/wineProducer-form';
import withStyles from "@material-ui/core/styles/withStyles";
const ranges = [
  {
    value: Wine.WineTypes.Red,
    label: Wine.WineTypes.Red,
  },
  {
    value: Wine.WineTypes.White,
    label: Wine.WineTypes.White,
  },
  {
    value: Wine.WineTypes.Rose,
    label: Wine.WineTypes.Rose,
  },
  {
    value: Wine.WineTypes.Sparkling,
    label: Wine.WineTypes.Sparkling,
  },
];



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
    constructor(props){
      super(props);
      // this.state = {value: ''};
      // this.handleChange = this.handleChange.bind(this);
      // this.handleSubmit = this.handleSubmit.bind(this);
      // this.values = React.useState({
      //   amount: '',
      //   password: '',
      //   weight: '',
      //   weightRange: '',
      //   showPassword: false,
      // });
    }

  // handleChange(event) {
  //   this.setState({value: event.target.value});
  // }

  // handleSubmit(event) {
  //   alert('A name was submitted: ' + this.state.value);
  //   event.preventDefault();
  // }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
          <Grid container spacing={1}
          direction="row"
          justify="center"
          alignItems="center">
            <Grid item xs>
              <WineProducerForm>

              </WineProducerForm>
            </Grid>
              {/* <TextField
                label="Name"
                id="simple-start-adornment"
                className={clsx(classes.margin, classes.textField)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                }}
              />
              <TextField
                select
                label="With Select"
                className={clsx(classes.margin, classes.textField)}
                value={values.weightRange}
                onChange={handleChange('weightRange')}
              >
                {ranges.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="adornment-amount">Amount</InputLabel>
                <Input
                  id="adornment-amount"
                  value={values.amount}
                  onChange={handleChange('amount')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
              </FormControl>
              <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                <Input
                  id="adornment-weight"
                  value={values.weight}
                  onChange={handleChange('weight')}
                  endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                  aria-describedby="weight-helper-text"
                  inputProps={{
                    'aria-label': 'Weight',
                  }}
                />
                <FormHelperText id="weight-helper-text">Weight</FormHelperText>
              </FormControl>
              <Grid item xs>
                <Paper className={classes.paper}>show value {values.weightRange}</Paper>
              </Grid>
              <Grid item  xs>
                <Button label="Submit" type="submit">
                  Submit
                </Button>
              </Grid> */}
          </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Admin);
