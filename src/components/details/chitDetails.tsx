import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { APIService } from "../../constants/api";
import { IChit, ITransaction } from "../../interface/definedTypes";
import { styled } from "@mui/material/styles";
import CommonAlert from "../common/commonAlert";
import CommonDialog from "../common/dialog";
import MembersList from "../common/listComponent";
import TabComponent from "../common/tabsComponent";
import IconButton from "@mui/material/IconButton";
import AddCircle from "@mui/icons-material/AddCircle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
// import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SimpleDialog from "../common/simpleDialog";

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export function ChitDetails() {
  const data = useLocation().state as IChit;
  const [members, setMembers] = useState<object[]>([]);
  const [membersInfoTable, setMembersInfoTable] = useState<object[]>([]);

  const [openSimpleDialog, setOpenSimpleDialog] = React.useState(false);
  const [loanTransactions, setLoanTransactions] = React.useState<ITransaction[]>([]);

  const [allCustomers, setAllCustomers] = useState<object[]>([]);

  const [withdrawalTransactions, setWithdrawalTransactions] = useState<
    ITransaction[]
  >([]);
  const [clientId, setClientId] = useState<string>("");
  const [client_name, setClientName] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  const [openBiddingDialog, setOpenBiddingDialog] = useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [openDeleteMemberDialog, setOpenDeleteMemberDialog] = useState(false);
  const [loading, setLoading] = useState(true)

  const [mainLoader, setMainLoader] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    severity: "success",
    message: "",
  });

  const [expanded, setExpanded] = useState<boolean>(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  let header = {
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("token"),
    },
  };
  useEffect(() => {
    const users: object[] = [];

    const mTable: object[] = [];

    async function getUser(user_id: string) {
      try {
        const response = await axios.get(
          `${APIService.api}/user/${user_id}`,
          header
        );
        if (response.status === 200) {
          return response.data.name;
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function assignMembers() {
      try {

        for (const client_id of data.clients as string[]) {
          const u = await getUser(client_id);
          users.push({ name: u, _id: client_id });
          const chitTransactions = await getTransactions(data._id,client_id);
          let paid = 0;
          let currentChit:any = [];
          let tHistory:any = [];
          chitTransactions.forEach((ct: any) => {
            if(ct.type === "chit"){
              paid += ct.received_amount;
              tHistory.push({received_amount:ct.received_amount,received_date:ct.received_date,_id:ct._id,received_by:ct.agent.name})
            }
          });
          currentChit["id"] = client_id;
          currentChit["chitName"] = data.name;
          currentChit["custName"] = u;
          currentChit["start_date"] = new Date(data.start_date).toDateString();
          currentChit["amount"] = data.amount;
          currentChit["payable"] = data.amount;
          currentChit["paid"] = paid;
          currentChit["pending"] = data.amount - paid;
          currentChit["tNum"] = data._id;
          currentChit["history"] = tHistory;

          mTable.push(currentChit);
        }
        setMembersInfoTable(mTable);
        setMembers(users);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    async function getWithdrawalTransactions() {
      try {
        const response = await axios.get(
          `${APIService.api}/transactions/chit/withdrawal/all/${data._id}`,
          header
        );
        if (response.status === 200) {
          setWithdrawalTransactions(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function getAllUsers() {
      try {
        const response = await axios.get(
          `${APIService.api}/users/customer`,
          header
        );
        if (response.status === 200) {
          setAllCustomers(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function getTransactions(loanOrChitId: string | undefined, customerId: string | undefined) {
      try {
        const response = await axios.get(
          `${APIService.api}/transactions/${loanOrChitId}/${customerId}`,
          header
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }

    assignMembers();
    getWithdrawalTransactions();
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.clients]);

  const handleSubmit = async (form: any) => {
    const currentuser = JSON.parse(
      localStorage.getItem("chit_app_user") || "{}"
    );
    const user = await axios.get(`${APIService.api}/user/${clientId}`, header);
    form["client"] = {
      id: user.data._id,
      name: user.data.name,
    };
    form["transaction_number"] = data._id;
    form["agent"] = { id: currentuser._id, name: currentuser.name };
    form["type"] = "chit";
    form["region"] = user.data.region;
    delete form["member_name"];
    postData(form);
  };

  const postData = (form: any) => {
    setMainLoader(true);
    axios
      .post(`${APIService.api}/transaction`, form, header)
      .then((response: any) => {
        setOpenDialog(false);
        setOpenBiddingDialog(false);
        setMainLoader(false);
        setAlert({
          show: true,
          severity: "success",
          message: "Updated Successfuly",
        });
        setTimeout(() => {
          setAlert({
            show: false,
            severity: "success",
            message: "",
          });
        }, 3000);
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

  const handleSubmitBidding = async(form: any) => {
    const currentuser = JSON.parse(
      localStorage.getItem("chit_app_user") || "{}"
    );
    const user = await axios.get(`${APIService.api}/user/${form.client_id}`, header);
    form["client"] = {
      id: user.data._id,
      name: user.data.name,
    };
    form["transaction_number"] = data._id;
    form["agent"] = { id: currentuser._id, name: currentuser.name };
    form["type"] = "withdrawal";
    form["transaction_type"] = "withdrawal";
    form["region"] = user.data.region;
    delete form["clients"];
    postData(form);
  };

  let biddingFormProps = {
    formHeading: "",
    formData: [
      {
        id: "client_id",
        type: "select",
        validation: (val: any) => {},
        label: "Select Member",
        required: true,
        value: "",
        options: members,
      },
      {
        id: "received_amount",
        type: "number",
        validation: (val: any) => {},
        label: "Withdrawn Amount",
        required: true,
        value: "",
        options: [],
        readOnly: false,
      },
      {
        id: "received_date",
        type: "date",
        validation: (val: any) => {},
        label: "Withdrawn Date",
        required: true,
        value: "",
        options: [],
        readOnly: false,
      },
    ],
    handleSubmitAction: handleSubmitBidding,
    initialValues: {
      clients: "",
      received_amount: "",
      received_date: "",
      client_id: "",
    },
    loader: mainLoader,
  };

  let formProps = {
    formHeading: "",
    formData: [
      {
        id: "member_name",
        type: "text",
        validation: (val: any) => {},
        label: "Member Name",
        required: true,
        value: "",
        options: [],
        readOnly: true,
      },
      {
        id: "received_amount",
        type: "number",
        validation: (val: any) => {},
        label: "Received Amount",
        required: true,
        value: "",
        options: [],
        readOnly: false,
      },
      {
        id: "received_date",
        type: "date",
        validation: (val: any) => {},
        label: "Received Date",
        required: true,
        value: "",
        options: [],
        readOnly: false,
      },
    ],
    handleSubmitAction: handleSubmit,
    initialValues: {
      member_name: client_name,
      received_amount: "",
      received_date: "",
      client_id: "",
    },
    loader: mainLoader,
    dateMax: new Date().toISOString().slice(0, 10),
  };

  let deleteFormProps = {
    formHeading: "Delete Member",
    formData: [
      {
        id: "client_id",
        type: "select",
        validation: (val: any) => {},
        label: "Member Name",
        required: true,
        value: "",
        options: members,
      },
    ],
    handleSubmitAction: async (form: any) => {
      const updated = members.filter(
        (member: any) => member._id !== form["client_id"]
      );
      const newMembers = updated.map((member: any) => member._id) as [];
      const response = await axios.post(
        `${APIService.api}/update_chit/clients`,
        {
          chit_id: data._id,
          clients: newMembers,
        },
        header
      );
      if (response.status === 200) {
        setOpenDeleteMemberDialog(false);
        data.clients = newMembers;
        setAlert({
          show: true,
          severity: "success",
          message: "Updated Successfuly",
        });
        setTimeout(() => {
          setAlert({
            show: false,
            severity: "success",
            message: "",
          });
        }, 3000);
      } else {
        // some error
        setAlert({
          show: true,
          severity: "error",
          message: "Internal Server Error - Contact Admin",
        });
        setTimeout(() => {
          setAlert({
            show: false,
            severity: "success",
            message: "",
          });
        }, 3000);
      }
    },
    initialValues: {
      client_id: "",
    },
    loader: mainLoader,
    dateMax: new Date().toISOString().slice(0, 10),
  };

  let addMemberFormProps = {
    formHeading: "Add Member",
    formData: [
      {
        id: "client_id",
        type: "select",
        validation: (val: any) => {},
        label: "Member Name",
        required: true,
        value: "",
        options: allCustomers,
      },
    ],
    handleSubmitAction: async (form: any) => {
      const newMembers = members.map((member: any) => member._id) as any[];
      const found = newMembers.find(
        (member: string) => member === form["client_id"]
      );
      if (found) {
        setOpenAddMemberDialog(false);
      } else {
        newMembers.push(form["client_id"]);
        const response = await axios.post(
          `${APIService.api}/update_chit/clients`,
          {
            chit_id: data._id,
            clients: newMembers,
          },
          header
        );
        if (response.status === 200) {
          setOpenAddMemberDialog(false);
          data.clients = newMembers;
          setAlert({
            show: true,
            severity: "success",
            message: "Updated Successfuly",
          });
          setTimeout(() => {
            setAlert({
              show: false,
              severity: "success",
              message: "",
            });
          }, 3000);
        } else {
          // some error
          setAlert({
            show: true,
            severity: "error",
            message: "Internal Server Error - Contact Admin",
          });
          setTimeout(() => {
            setAlert({
              show: false,
              severity: "success",
              message: "",
            });
          }, 3000);
        }
      }
    },
    initialValues: {
      client_id: "",
    },
    loader: mainLoader,
    dateMax: new Date().toISOString().slice(0, 10),
  };

  return (
    <div>
      <TabComponent />
      <CommonAlert alert={alert} />

      <Card sx={{ width: "auto", mt: 3 }}>
        <CardHeader title={data.name} subheader={data.chit_number} />
        <CardContent>

        <Box sx={{ display: 'flex',justifyContent: 'space-between' }}>
          <Typography variant="body1" gutterBottom component="div">
            <b>Date </b> <p>{new Date(data.start_date).toDateString()}</p>
          </Typography>

          <Typography variant="subtitle1" gutterBottom component="div">
            <b>Amount</b> <p>&#x20b9; {data.amount}</p>
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            <b>Installments</b> <p>{data.number_of_installments}</p>
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            <b>Members</b> <p>{members.length}</p>
          </Typography>
          </Box>
          <Typography
            sx={{ m: 2 }}
            variant="subtitle1"
            gutterBottom
            component="div"
            align="center"
          >
             <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => {
                  setOpenBiddingDialog(true);
                }}
              >
                <AddCircle />
              </IconButton>
            <b>Bidding Info</b>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Typography>

        </CardContent>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
              <b>Bidding History:</b>
            </Typography>
            {withdrawalTransactions.length > 0 &&
              withdrawalTransactions.map((withdrawalTransaction: any) => {
                return (
                  <ListItem key={withdrawalTransaction._id}>
                    <ListItemText
                      primary={`Rs. ${withdrawalTransaction.received_amount} withdrawn by ${withdrawalTransaction.client.name}`}
                      secondary={`On ${new Date(
                        withdrawalTransaction.received_date
                      ).toDateString()}, paid by ${
                        withdrawalTransaction.agent.name
                      }`}
                    />
                  </ListItem>
                );
              })}

            {withdrawalTransactions.length === 0 && (
              <Typography paragraph>No Transactions</Typography>
            )}
          </CardContent>
        </Collapse>
      </Card>

      {/* <Grid container> */}
        {/* <Grid item md={4} lg={4} sm={4} xs={4}>
        </Grid> */}
        {/* <Grid item md={4} lg={4} sm={4} xs={4}> */}

          <Typography
            sx={{ m: 2 }}
            variant="subtitle1"
            gutterBottom
            component="div"
            align="center"
          >
              <IconButton
                onClick={() => {
                  // add person
                  setOpenAddMemberDialog(true);
                }}
              >
              <PersonAddAlt1Icon />
            </IconButton>
            <b>Members Info</b>
          </Typography>
        {/* </Grid> */}
        {/* <Grid item md={4} lg={4} sm={4} xs={4}>
          <IconButton
            onClick={() => {
              // remove person
              setOpenDeleteMemberDialog(true);
            }}
          >
            <PersonRemoveIcon />
          </IconButton>
        </Grid> */}
      {/* </Grid> */}
      <MembersList
        membersInfoTable={membersInfoTable}
        setOpenDialog={setOpenDialog}
        setClientId={setClientId}
        setClientName={setClientName}
        loading={loading}
        formProps={deleteFormProps}
        setOpenSimpleDialog={setOpenSimpleDialog}
        setLoanTransactions={setLoanTransactions}
        withdrawalTransactions={withdrawalTransactions}
      />
      <CommonDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        cust_id={data._id}
        formProps={formProps}
      />

      <CommonDialog
        openDialog={openBiddingDialog}
        setOpenDialog={setOpenBiddingDialog}
        customTitle="Chit Reward"
        formProps={biddingFormProps}
      />

      <CommonDialog
        openDialog={openAddMemberDialog}
        setOpenDialog={setOpenAddMemberDialog}
        // cust_id={data._id}
        formProps={addMemberFormProps}
      />

      <CommonDialog
        openDialog={openDeleteMemberDialog}
        setOpenDialog={setOpenDeleteMemberDialog}
        // cust_id={data._id}
        formProps={deleteFormProps}
      />

      <SimpleDialog
        openSimpleDialog={openSimpleDialog}
        setOpenSimpleDialog={setOpenSimpleDialog}
        title="Transaction History"
        loanTransactions={loanTransactions}
      />

    </div>
  );
}
