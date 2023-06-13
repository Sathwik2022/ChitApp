import { Tab, Tabs, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { APIService } from "../../constants/api";
import { IUser } from "../../interface/definedTypes";
import CustomForm from "../common/customForm";
import TabComponent from "../common/tabsComponent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import DetailsTable from "./tables/detailsTable";
import CircularProgress from '@mui/material/CircularProgress';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function CustomerDetails() {
  let params = useParams();
  const pathData = useLocation();

  const cust_id = params.cust_id;
  const [chitRes, setChitRes] = useState<any>({loading:true,data:[]});
  const [loanRes, setLoanRes] = useState<any>({loading:true,data:[]});
  const [customerDetails, setCustomerDetails] = useState<IUser>();
  const [agentReport, setAgentReportData] = useState([]);
  const [value, setValue] = React.useState(0);
  const [mainLoader, setMainLoader] = useState(false);
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(true);
  // const [alert, setAlert] = useState({
  //   show: false,
  //   severity: "success",
  //   message: "",
  // });
  const currentuser = JSON.parse(localStorage.getItem("chit_app_user") || "{}");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  let header = {
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("token"),
    },
  };
  useEffect(() => {
    async function getChitDetails() {
      axios
        .get(`${APIService.api}/chits/${cust_id}`, header)
        .then(async (response: any) => {
          // const chitTransactions = [];
          for (let i = 0; i < response.data.length; i++) {
            const chitTransactions = await getTransactions(response.data[i]._id);
            let paid = 0;
            let withdrawn="no";
            chitTransactions.forEach((ct: any) => {
              if(ct.type === "chit"){
                paid+=ct.received_amount;
              }
              if(ct["transaction_type"]==="withdrawal") {
                withdrawn = "yes";
              }
            });
           response.data[i]["paid"] = paid; 
           response.data[i]["pending"] = response.data[i].amount - paid;
           response.data[i]["count_left"] = (response.data[i].amount - paid) / paid;
           response.data[i]["withdrawn"] = withdrawn;
           response.data[i]["installments_paid"] = Math.floor(paid/response.data[i].installment_amount);
          }
          // console.log(chitTransactions);
          setChitRes({loading:false,data:response.data});
          // setCustomerData(response.data);
          // setMainLoader(false)
        })
        .catch((error: any) => {
          // setMainLoader(false);
          console.log(error);
        });
    }

    async function getLoanDetails() {
      axios
        .get(`${APIService.api}/loans/${cust_id}`, header)
        .then(async (response: any) => {
          // console.log(response.data);

          for (let i = 0; i < response.data.length; i++) {
            const loanTransactions = await getTransactions(response.data[i]._id);
              // const interest = response.data[i].amount * (response.data[i].rate_of_interest)/100;
              let paid = 0;
              let pending = 0;
              loanTransactions.forEach((lt: any) => {
                paid += lt.received_amount;
              });
              if(paid>0) {
                // pending = ((interest * response.data[i].number_of_installments) + response.data[i].amount) - paid;
                pending = response.data[i]["payable"]-paid;
              }
              // response.data[i]["payable"] = interest * response.data[i].number_of_installments + response.data[i].amount;
              response.data[i]["paid"] = paid;
              response.data[i]["pending"] = pending;
          }

          // console.log(response.data);
          setLoanRes({loading:false,data:response.data});
          // setCustomerData(response.data);
          // setMainLoader(false)
        })
        .catch((error: any) => {
          // setMainLoader(false);
          console.log(error);
        });
    }

    async function getUser() {
      try {
        const response = await axios.get(
          `${APIService.api}/user/${cust_id}`,
          header
        );
        if (response.status === 200) {
          setChecked(!response.data.disabled);
          setCustomerDetails(response.data);
          setDisabled(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function getTransactions(loanOrChitId: string) {
      try {
        const response = await axios.get(
          `${APIService.api}/transactions/${loanOrChitId}/${cust_id}`,
          header
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }

    getChitDetails();
    getLoanDetails();
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cust_id]);

  // const handleSubmit = (form: any) => {
  //   form["client_id"] = cust_id;
  //   form["transaction_number"] = transactionNumber;
  //   form["agent_id"] = currentuser._id;
  //   form["type"] = value === 0 ? "chit" : "loan";
  //   delete form["member_name"];
  //   postData(form);
  // };

  // const postData = (form: any) => {
  //   setMainLoader(true);
  //   axios
  //     .post(`${APIService.api}/transaction`, form, header)
  //     .then((response: any) => {
  //       setOpenDialog(false);
  //       setMainLoader(false);
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

  const handleGetAgentReport = (form: any) => {
    setMainLoader(true);
    const formattedDate = form.date.split("-");
    const newDate =
      formattedDate[1] + "-" + formattedDate[2] + "-" + formattedDate[0];
    axios
      .get(`${APIService.api}/transactions/agent/${cust_id}/${newDate}`, header)
      .then((response: any) => {
        setAgentReportData(response.data);
        setMainLoader(false);
      })
      .catch((error: any) => {
        setMainLoader(false);
        console.log(error);
      });
  };

  let agentReportFormProps = {
    formHeading: `Daily Collection of ${customerDetails?.name}`,
    formData: [
      {
        id: "date",
        type: "date",
        validation: (val: any) => {},
        label: "Date",
        required: true,
        value: "",
        options: [],
      },
    ],
    handleSubmitAction: handleGetAgentReport,
    initialValues: {
      date: "",
    },
    loader: mainLoader,
  };

  const headerProps = {
    heading: `Hi! ${currentuser.name}`,
  };

  async function toggleDisabled(
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    setDisabled(true);
    // api call
    try {
      setChecked(event.target.checked);
      await axios.post(
        `${APIService.api}/disable`,
        { user_id: customerDetails?._id },
        header
      );
    } catch (error) {
      setChecked(!event.target.checked);
    } finally {
      setDisabled(false);
    }
  }

  return (
    <div>
      <TabComponent {...headerProps} />
      {/* <CommonAlert alert={alert} /> */}

      {pathData.pathname.split("/")[1] === "customer" ? (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Chits" {...a11yProps(0)} />
              <Tab label="Loans" {...a11yProps(1)} />
              <Tab label="User" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {chitRes.loading ? <CircularProgress /> : chitRes.data.length ? (
              <React.Fragment>
                {/* {chitRes?.map((row, index) => {
                  return (
                    <Box sx={{ mt: 2, mb: 2 }} key={index}>
                      <CommonCard
                        mainLoader={mainLoader}
                        setTransactionNumber={setTransactionNumber}
                        id={row["_id"]}
                        setOpenDialog={setOpenDialog}
                        cust_id={cust_id}
                        name={row["name"]}
                        number={row["chit_number"]}
                        date={row["start_date"]}
                        amount={row["amount"]}
                        number_of_installments={row["number_of_installments"]}
                        memberName={customerDetails?.name}
                        setMemberName={setMemberName}
                      />
                    </Box>
                  );
                })} */}
                <DetailsTable
                  tableHeaders={[
                    "Chit Name",
                    "Amount",
                    "Installments Paid",
                    "Paid Amount",
                    "Pending Amount",
                    "Withdrawn",
                  ]}
                  tableData={chitRes.data}
                  type="customerChit"
                />
              </React.Fragment>
            ) : (
              <div>
                <Typography variant="h6" gutterBottom component={"span"}>
                  No Chits
                </Typography>
              </div>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {loanRes.loading ? <CircularProgress /> : loanRes.data.length ? (
              <React.Fragment>
                <DetailsTable
                  tableHeaders={[
                    "Type",
                    "Date",
                    "Amount",
                    "Payable",
                    "Paid",
                    "Pending",
                  ]}
                  tableData={loanRes.data}
                  type="customerLoan"
                />
              </React.Fragment>
            ) : (
              <div>
                <Typography variant="h6" gutterBottom component={"span"}>
                  No Loans
                </Typography>
              </div>
            )}{" "}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <CommonUserDetails
              customerDetails={customerDetails}
              currentUser={currentuser}
            />
          </TabPanel>
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Collection" {...a11yProps(0)} />
              <Tab label="User" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div>
              <CustomForm {...agentReportFormProps} />
              <List>
                {agentReport.map((ele, index) => {
                  return (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Received amount Rs.${ele["received_amount"]}`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CommonUserDetails
              customerDetails={customerDetails}
              currentUser={currentuser}
              checked={checked}
              toggleDisabled={toggleDisabled}
              disabled={disabled}
            />
          </TabPanel>
        </Box>
      )}
      {/* <CommonDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        cust_id={cust_id}
        formProps={formProps}
      /> */}
    </div>
  );
}

function CommonUserDetails(props: any) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom component={"div"}>
        Details:
      </Typography>

      <Typography variant="subtitle1" gutterBottom component={"div"}>
        <u>Name</u>: {props.customerDetails?.name}
      </Typography>

      <Typography variant="subtitle1" gutterBottom component={"div"}>
        <u>UserID / Phone</u>: {props.customerDetails?.contact_number}
      </Typography>

      {props.customerDetails?.joining_date && (
        <Typography variant="subtitle1" gutterBottom component={"div"}>
          <u>Joining Date</u>:{" "}
          {new Date(
            props.customerDetails?.joining_date as string
          ).toDateString()}
        </Typography>
      )}

      <Typography variant="subtitle1" gutterBottom component={"div"}>
        <u>Date of Birth</u>:{" "}
        {new Date(
          props.customerDetails?.date_of_birth as string
        ).toDateString()}
      </Typography>

      <Typography variant="subtitle1" gutterBottom component={"div"}>
        <u>Address</u>: {props.customerDetails?.address}
      </Typography>

      {props.currentUser?.type === "admin" && (
        <React.Fragment>
          <Typography variant="subtitle1" gutterBottom component={"div"}>
            <u>Aadhar number</u>: {props.customerDetails?.aadhar_number}
          </Typography>

          <Typography variant="subtitle1" gutterBottom component={"div"}>
            <u>Password / PAN</u> : {props.customerDetails?.pan}
          </Typography>

          {props.customerDetails.type === "agent" && (
            <FormControlLabel
              control={
                <Switch
                  checked={props.checked}
                  onChange={props.toggleDisabled}
                  disabled={props.disabled}
                />
              }
              label={props.checked ? "Agent is Active" : "Agent is disabled"}
            />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
