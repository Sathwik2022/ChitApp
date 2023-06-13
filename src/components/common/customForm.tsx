import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { Autocomplete } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function CustomForm(props: any) {
  const [selectedVal, setSelectedVal] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");
  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit: (values, actions) => {
      props.handleSubmitAction(values);
    },
  });

  React.useEffect(() => {
    props.formData.forEach((fd: any) => {
      if (fd.type === "select" && fd.id === "region") {
        if (fd.options.length > 0) {
          const forId = fd.options.find((x: any) => x.name === fd.value);
          if (forId) {
            setSelectedVal(forId._id);
          }
        }
      }
    });
  }, [props.formData]);

  const enterVal = (val: any): string => {
    if (val.type) {
      if (val.type === "loan") {
        return `loan-${val._id}`;
      } else if (val.type === "chit") {
        return `chit-${val._id}`;
      } else if (val.type === "region") {
        return val.name;
      } else if (val.type === "agent") {
        return val.id;
      }
    }
    return val._id;
  };

  const renderTextField = (ele: any) => {
    switch (ele.type) {
      case "image":
        return (
          <div>
            <label>{ele.label}</label>
            <input type="file" />
          </div>
        );
      case "repay":
        return (
          <div>
            <FormControl required={true}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Repayment Type
              </FormLabel>
              <RadioGroup
                aria-required="true"
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={selectedRadio}
                onChange={(event) => {
                  setSelectedRadio(event.target.value);
                  formik.values[ele.id] = event.target.value;
                }}
              >
                <FormControlLabel
                  value="daily"
                  control={<Radio />}
                  label="Daily"
                />
                <FormControlLabel
                  value="weekly"
                  control={<Radio />}
                  label="Weekly"
                />
                <FormControlLabel
                  value="monthly"
                  control={<Radio />}
                  label="Monthly"
                />
              </RadioGroup>
            </FormControl>
          </div>
        );
      case "select":
        return (
          <div>
            <TextField
              id={ele.id}
              select
              value={selectedVal}
              label={ele.label}
              variant="standard"
              fullWidth
              onChange={(event) => {
                setSelectedVal(event.target.value);
                formik.values[ele.id] = event.target.value;
              }}
              required={ele.required}
            >
              {ele.options.map((val: any, index: number) => {
                return (
                  <MenuItem value={enterVal(val)} key={index}>
                    {val.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </div>
        );
        case "select-region":
        return (
          <div>
            <TextField
              id={ele.id}
              select
              value={selectedRegion}
              label={ele.label}
              variant="standard"
              fullWidth
              onChange={(event) => {
                setSelectedRegion(event.target.value);
                formik.values[ele.id] = event.target.value;
              }}
              required={ele.required}
            >
              {ele.options.map((val: any, index: number) => {
                return (
                  <MenuItem value={val.name} key={index}>
                    {val.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </div>
        );
        case "select-agent":
        return (
          <div>
            <TextField
              id={ele.id}
              select
              value={selectedAgent}
              label={ele.label}
              variant="standard"
              fullWidth
              onChange={(event) => {
                setSelectedAgent(event.target.value);
                formik.values[ele.id] = event.target.value;
              }}
              required={ele.required}
            >
              {ele.options.map((val: any, index: number) => {
                return (
                  <MenuItem value={val.id} key={index}>
                    {val.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </div>
        );
      case "multiselect":
        return (
          <Autocomplete
            multiple
            options={ele.options}
            getOptionLabel={(option: any) => option.name}
            // defaultValue={[top100Films[13]]}
            onChange={(event, value: any) => {
              const idVals = value.map((x: any) => x._id);
              formik.values[ele.id] = idVals;
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label={ele.label} />
            )}
          />
        );
      default:
        return (
          <TextField
            type={ele.type}
            name={ele.id}
            fullWidth
            label={ele.label}
            onChange={formik.handleChange}
            // error={
            //   formik.touched[ele.id] && Boolean(formik.errors[ele.id])
            // }
            value={formik.values[ele.id]}
            variant="standard"
            required={ele.required}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: props.dateMax,
              readOnly: ele.readOnly,
            }}
          />
        );
    }
  };

  return (
    <div>
      <Box p={2}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={props.loader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          alignItems="center"
        >
          {props.formHeading}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            {props.formData.map((ele: any, index: number) => {
              return <div key={index}>{renderTextField(ele)}</div>;
            })}
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Stack>
        </form>
        {/* </Formik> */}
      </Box>
    </div>
  );
}

export default CustomForm;
