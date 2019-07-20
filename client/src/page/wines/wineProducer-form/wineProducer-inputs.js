import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import * as Wine from '../../../constants/wine'
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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
const useStyles = makeStyles(theme => ({
  

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
    padding: theme.spacing(1),
    flexBasis: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export const WineProducerInputs = props => {
  const classes = useStyles();
  const {
    values: { name, email, wineType },
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    setFieldTouched
  } = props;
 
  const change = (name, e) => {

    handleChange(e);
    setFieldTouched(name, true, false);
 
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submitted", wineType);
      }}
    >
      <Grid container spacing={1}
          direction="row"
          justify="center"
          alignItems="center">
        <Grid item xs>
          <TextField
            id="name"
            name="name"
            className={classes.textField}
            helperText={touched.name ? errors.name : ""}
            error={touched.name && Boolean(errors.name)}
            label="Name"
            value={name}
            onChange={change.bind(null, "name")}
          />
        </Grid>
      <TextField
        id="email"
        name="email"
        helperText={touched.email ? errors.email : ""}
        error={touched.email && Boolean(errors.email)}
        label="Email"
        fullWidth
        value={email}
        onChange={change.bind(null, "email")}
 
      />
      <TextField
        select
        label="Wine Type"
        className={clsx(classes.margin, classes.textField)}
        value={wineType}
        onChange={handleChange("wineType")}
      >
        {ranges.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button
        type="submit"
        fullWidth
        variant="raised"
        color="primary"
        disabled={!isValid}
      >
        Submit
      </Button>
      </Grid>
    </form>
  );
 };