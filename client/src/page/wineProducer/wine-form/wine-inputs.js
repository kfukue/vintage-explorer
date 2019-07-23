import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
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

export const WineInputs = props => {
  const classes = useStyles();
  const {
    values : { 
      name,
      description,
      sku,
      vintage,
      totalSupply,
      price,
      totalSales,
      open,
      snackbarMsg,
      totalNumberOfWines,
      latestNumberWineId
    },
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    setFieldTouched,
    handleSubmit,
    showProgress,
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <TextField
                id="description"
                name="description"
                className={classes.textField}
                helperText={touched.description ? errors.description : ""}
                error={touched.description && Boolean(errors.description)}
                label="Description"
                value={description || ''}
                onChange={change.bind(null, "description")}
              />
            </Grid>
        </Grid>
        <Grid item container
          direction="row">
          <Grid item xs={6}>
            <TextField
              id="sku"
              name="sku"
              className={classes.textField}
              helperText={touched.sku ? errors.sku : ""}
              error={touched.sku && Boolean(errors.sku)}
              label="SKU"
              value={sku || ''}
              onChange={change.bind(null, "sku")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="vintage"
              name="vintage"
              className={classes.textField}
              helperText={touched.vintage ? errors.vintage : ""}
              error={touched.sku && Boolean(errors.vintage)}
              label="Vintage"
              value={vintage || ''}
              onChange={change.bind(null, "vintage")}
            />
          </Grid>
        </Grid>
        <Grid item container
          direction="row">
          <Grid item xs={6}>
            <TextField
              id="totalSupply"
              name="totalSupply"
              className={classes.textField}
              helperText={touched.totalSupply ? errors.totalSupply : ""}
              error={touched.sku && Boolean(errors.sku)}
              label="Total Supply"
              value={totalSupply || ''}
              onChange={change.bind(null, "totalSupply")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="price"
              name="price"
              className={classes.textField}
              helperText={touched.price ? errors.price : ""}
              error={touched.sku && Boolean(errors.price)}
              label="Price in Eth"
              value={price || ''}
              onChange={change.bind(null, "price")}
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