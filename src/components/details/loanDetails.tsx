import Grid from "@mui/material/Grid";
import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { APIService } from "../../constants/api";
import { ILoan } from "../../interface/definedTypes";
import CommonAlert from "../common/commonAlert";
import CommonDialog from "../common/dialog";
import LoanCard from "../common/loanCardComponent";
import TabComponent from "../common/tabsComponent";

export function LoanDetails() {
  const [openDialog, setOpenDialog] = useState(false);
  const data = useLocation().state as ILoan;
  const [mainLoader, setMainLoader] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    severity: "success",
    message: "",
  });

  // const handleSubmit = (form: any) => {
  //   const currentuser = JSON.parse(
  //     localStorage.getItem("chit_app_user") || "{}"
  //   );

  //   form["client"] = data.client;
  //   form["transaction_number"] = data._id;
  //   form["agent"] = { id: currentuser._id, name: currentuser.name };
  //   form["region"] = data.region;
  //   form["type"] = "loan";
  //   delete form["member_name"];

  //   postData(form);
  // };

  // const postData = (form: any) => {
  //   setMainLoader(true);
  //   let header = {
  //     headers: {
  //       Authorization: "Bearer " + window.localStorage.getItem("token"),
  //     },
  //   };
  //   axios
  //     .post(`${APIService.api}/transaction`, form, header)
  //     .then((response: any) => {
  //       setMainLoader(false);
  //       setOpenDialog(false);
  //       setAlert({
  //         show: true,
  //         severity: "success",
  //         message: "Updated Successfuly",
  //       });
  //       setTimeout(() => {
  //         setAlert({
  //           show: false,
  //           severity: "success",
  //           message: "",
  //         });
  //       }, 3000);
  //     })
  //     .catch((error: any) => {
  //       setMainLoader(false);
  //       setAlert({
  //         show: true,
  //         severity: "error",
  //         message: "There is some error",
  //       });
  //       setTimeout(() => {
  //         setAlert({
  //           show: false,
  //           severity: "success",
  //           message: "",
  //         });
  //       }, 3000);
  //       console.log(error);
  //     });
  // };

  // let formProps = {
  //   formHeading: "",
  //   formData: [
  //     {
  //       id: "member_name",
  //       type: "text",
  //       validation: (val: any) => {},
  //       label: "Member Name",
  //       required: true,
  //       value: "",
  //       options: [],
  //       readOnly: true,
  //     },
  //     {
  //       id: "received_amount",
  //       type: "number",
  //       validation: (val: any) => {},
  //       label: "Received Amount",
  //       required: true,
  //       value: "",
  //       options: [],
  //     },
  //     {
  //       id: "received_date",
  //       type: "date",
  //       validation: (val: any) => {},
  //       label: "Received Date",
  //       required: true,
  //       value: "",
  //       options: [],
  //     },
  //   ],
  //   handleSubmitAction: handleSubmit,
  //   initialValues: {
  //     member_name: memberName,
  //     received_amount: "",
  //     received_date: "",
  //   },
  //   loader: mainLoader,
  //   dateMax: new Date().toISOString().slice(0, 10),
  // };

  return (
    <React.Fragment>
      <TabComponent />
      <CommonAlert alert={alert} />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <LoanCard
            setOpenDialog={setOpenDialog}
            mainLoader={mainLoader}
            setMemberName={setMemberName}
          />
        </Grid>
      </Grid>
      {/* <CommonDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        formProps={formProps}
      /> */}
    </React.Fragment>
  );
}
