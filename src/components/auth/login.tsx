import { Grid } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIService } from "../../constants/api";
import CommonAlert from "../common/commonAlert";
import CustomForm from "../common/customForm";

export default function Login(props: any) {
  const [mainLoader, setMainLoader] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    severity: "success",
    message: "",
  });
  let navigate = useNavigate();

  const handleSubmit = (val: any) => {
    const body = {
      ...val,
      contact_number: Number(val["contact_number"]),
    };
    setMainLoader(true);
    axios
      .post(`${APIService.api}/login`, body)
      .then((response: any) => {
        if (response.data.error) {
          setMainLoader(false);
          setAlert({
            show: true,
            severity: "error",
            message: response.data.error.message,
          });
          setTimeout(() => {
            setAlert({
              show: false,
              severity: "success",
              message: "",
            });
          }, 5000);
        } else {
          setMainLoader(false);
          setAlert({
            show: true,
            severity: "success",
            message: "Loggedin Successfully",
          });
          localStorage.setItem(
            "chit_app_user",
            JSON.stringify(response.data.user)
          );
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
          setTimeout(() => {
            setAlert({
              show: false,
              severity: "success",
              message: "",
            });
          }, 3000);
        }
      })
      .catch((error: any) => {
        setMainLoader(false);

        let errorMsg = "";
        const detailsError = error.response.data.msg;
        if(detailsError.message !== undefined){
          errorMsg = detailsError.message
        }else {
          errorMsg = "Internal Server Error - Contact Admin"
        }

        setAlert({
          show: true,
          severity: "error",
          message: errorMsg,
        });
        setTimeout(() => {
          setAlert({
            show: false,
            severity: "success",
            message: "",
          });
        }, 3000);
        console.log(error);
      });
  };

  let formProps = {
    formHeading: "Login",
    formData: [
      {
        id: "contact_number",
        type: "tel",
        validation: (val: any) => {},
        label: "User ID",
        required: true,
        value: "",
        options: [],
      },
      {
        id: "password",
        type: "password",
        validation: (val: any) => {},
        label: "Password",
        required: true,
        value: "",
        options: [],
      },
    ],
    handleSubmitAction: handleSubmit,
    initialValues: {
      contact_number: "",
      password: "",
    },
    loader: mainLoader,
  };

  return (
    <React.Fragment>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        // style={{ minHeight: "100vh" }}
      >
        <Grid item xs={2}>
          <CustomForm {...formProps} />
        </Grid>
      </Grid>
      <CommonAlert alert={alert} />
    </React.Fragment>
  );
}
