import React from "react";
import { Alert } from "@mui/material";

export default function CommonAlert(props: any) {
  return (
    <React.Fragment>
      {props.alert.show ? (
        <Alert variant="filled" severity={props.alert.severity}>
          {props.alert.message}
        </Alert>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </React.Fragment>
  );
}
