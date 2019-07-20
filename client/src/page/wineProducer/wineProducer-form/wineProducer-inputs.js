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
  
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
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

  button: {
    margin: theme.spacing(1),
  },
}));

export const WineProducerInputs = props => {
  const classes = useStyles();
  const {
    values: { name, website, wineProducer },
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    setFieldTouched,
    handleSubmit
  } = props;
 
  const change = (name, e) => {

    handleChange(e);
    setFieldTouched(name, true, false);
 
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item container
          direction="row">
            <Grid item xs={12}>
              <TextField
                id="name"
                name="name"
                className={classes.textField}
                helperText={touched.name ? errors.name : ""}
                error={touched.name && Boolean(errors.name)}
                label="Name"
                value={name || ''}
                onChange={change.bind(null, "name")}
              />
            </Grid>
        </Grid>
        <Grid item container
          direction="row">
            <Grid item xs={12}>
              <TextField
                id="website"
                name="website"
                className={classes.textField}
                helperText={touched.website ? errors.website : ""}
                error={touched.website && Boolean(errors.website)}
                label="Website"
                value={website || ''}
                onChange={change.bind(null, "website")}
              />
            </Grid>
        </Grid>
        <Grid item container
          direction="row">
          <Grid item xs={12}>
            <TextField
              id="wineProducer"
              name="wineProducer"
              className={classes.textField}
              helperText={touched.wineProducer ? errors.wineProducer : ""}
              error={touched.wineProducer && Boolean(errors.wineProducer)}
              label="Wine Producer Ethereum Address"
              value={wineProducer || ''}
              onChange={change.bind(null, "website")}
            />
          </Grid>
        </Grid>
        <Grid item container
          direction="row">
          <Grid item xs={12}>
            <Button
              type="submit"
              
              color="primary"
              disabled={!isValid}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
 };