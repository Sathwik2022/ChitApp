import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { APIService } from "../../constants/api";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HistoryIcon from "@mui/icons-material/History";
import IconButton from "@mui/material/IconButton";
import CommonDialog from "../common/dialog";
import CommonAlert from "../common/commonAlert";
import { ITransactionHistory } from "../../interface/definedTypes";
import { writeToExcel } from "../../excelexport";


export default function CustomerGrid() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [trigger, setTrigger] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mainLoader, setMainLoader] = React.useState(false);
  const [clientId, setClientId] = React.useState("");
  const [customer, setCustomer] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(false);

  const enableOrDisable = (userId: string) => {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };

    axios
      .post(`${APIService.api}/disable`, { user_id: userId }, header)
      .then((_) => {
        setTrigger(!trigger);
      });
  };
  const userType = JSON.parse(
    window.localStorage.getItem("chit_app_user")!
  ).type;
  const userId = JSON.parse(window.localStorage.getItem("chit_app_user")!)._id;
  const region = JSON.parse(
    window.localStorage.getItem("chit_app_user")!
  ).region;
  const userName = JSON.parse(
    window.localStorage.getItem("chit_app_user")!
  ).name;
  const [alert, setAlert] = React.useState({
    show: false,
    severity: "success",
    message: "",
  });
  const header = React.useMemo(() => {
    return {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
  }, []);

  React.useEffect(() => {

    let api = `${APIService.api}/users/customer`;

    if (userType === "agent") {
      api = `${APIService.api}/customers/${region}`;
    }
    async function getAgentDetails() {
      setLoading(true)
      axios
        .get(api, header)
        .then((response: any) => {
          const res: any = [];
          response.data.forEach((ele: any) => {
            res.push({
              name: ele.name,
              contact_number: ele.contact_number,
              aadhar_number: ele.aadhar_number,
              pan: ele.pan,
              address: ele.address,
              region: capitalizeFirstLetter(ele.region),
              id: ele._id,
              number_of_installments: ele.number_of_installments,
              type: "customer",
              disabled: ele.disabled ? ele.disabled : false,
              date_of_birth: ele.date_of_birth,
              email: ele.email,
              onClick: () => {},
            });
          });
          setRows(res);
          setLoading(false)
        })
        .catch((error: any) => {
          // setMainLoader(false);
          setLoading(false)
          console.log(error);
        });
    }
    getAgentDetails();
  }, [trigger, region, userType, header]);
  
  const columns: GridColDef[] = [

    // {
    //   field: "id",
    //   headerName: "Info",
    //   width: 90,
    //   sortable: false,
    //   editable: false,
    //   filterable: false,
    //   renderCell: (params) => {
    //     return (
    //       <IconButton
    //         color="primary"
    //         aria-label="info-icon"
    //         onClick={() => {
    //           // go to customer details
    //           navigate(`/customer/${params.row.id}`);
    //         }}
    //       >
    //         <InfoIcon />
    //       </IconButton>
    //     );
    //   },
    // },
    {
      field: "name",
      headerName: "Customer Name",
      width: 200,
      editable: false,
      renderCell: (params) => {
        if (params.row.disabled) {
          return <Typography color="error">{params.row.name}</Typography>;
        } else {
          return (
            <Button
              onClick={() => {
                // go to customer details
                navigate(`/customer/${params.row.id}`);
              }}
            >
              <Typography>{params.row.name}</Typography>
            </Button>
          );

        }
      },
    },
    {
      field: "contact_number",
      headerName: "Phone No.",
      width: 150,
      editable: false,
    },
    {
      field: "aadhar_number",
      headerName: "Aadhaar",
      width: 110,
      editable: false,
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      editable: false,
    },
    {
      field: "region",
      headerName: "Region",
      width: 220,
      editable: false,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      editable: false,
      renderCell: (params) => {
        return (
          <React.Fragment>
            {userType === "admin" && (
              <React.Fragment>
                <Button
                  onClick={() => {
                    enableOrDisable(params.row.id);
                  }}
                  variant="outlined"
                  color={params.row.disabled ? "info" : "error"}
                  //   disabled={buttonDisabled}
                >
                  {params.row.disabled ? "enable" : "disable"}
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  onClick={() => {
                    const state = {
                      name: params.row.name,
                      contact_number: params.row.contact_number,
                      aadhar_number: params.row.aadhar_number,
                      pan: params.row.pan,
                      address: params.row.address,
                      region: params.row.region,
                      id: params.row.id,
                      date_of_birth: params.row.date_of_birth,
                      email: params.row.email,
                    };
                    navigate("/editCustomer", { state });
                  }}
                  variant="outlined"
                  color="success"
                >
                  Edit
                </Button>
                <IconButton
                  color="primary"
                  aria-label="info-icon"
                  onClick={() => {
                    const transactionDetails = {
                      _id: params.row.id,
                      name: params.row.name,
                      type:"all",
                      transaction_number:""
                    } as ITransactionHistory;
                    navigate(`/transactionHistory/${params.row.id}`, {state: transactionDetails});
                  }}
                >
                  <HistoryIcon />
                </IconButton>
              </React.Fragment>
            )}
            {userType === "agent" && (
              <React.Fragment>
                <Button
                  onClick={async () => {
                    // get customer chits and loans here
                    const chits = await axios.get(
                      `${APIService.api}/chits/${params.row.id}`,
                      header
                    );
                    const loans = await axios.get(
                      `${APIService.api}/loans/${params.row.id}`,
                      header
                    );
                    setCustomer({
                      ...params.row,
                      chits: chits.data,
                      loans: loans.data,
                    });
                    setTimeout(() => {
                      setClientId(params.row.id);
                      setOpenDialog(true);
                    }, 2000);
                  }}
                  variant="outlined"
                  color="success"
                >
                  Receive Money
                </Button>
              </React.Fragment>
            )}
          </React.Fragment>
        );
      },
    },
    // {
    //   field: "transaction_history",
    //   headerName: "Transaction History",
    //   width: 150,
    //   editable: false,
    //   renderCell: (params) => {
    //     return (
    //       <IconButton
    //         color="primary"
    //         aria-label="info-icon"
    //         onClick={() => {
    //           const transactionDetails = {
    //             _id: params.row.id,
    //             name: params.row.name,
    //             type:"all",
    //             transaction_number:""
    //           } as ITransactionHistory;
    //           navigate(`/transactionHistory/${params.row.id}`, {state: transactionDetails});
    //         }}
    //       >
    //         <HistoryIcon />
    //       </IconButton>
    //     );
    //   },
    // },
  ];

  const handleSubmit = (form: any) => {
    form["client"] = {id:clientId,name:customer.name};
    const splitString = form["loan_chit"].split("-");
    form["type"] = splitString[0];
    form["transaction_number"] = splitString[1];
    form["agent"] = {id:userId,name:userName};
    form["region"] = customer.region;
    form["settlement"] = true;
    form["transaction_for"] = "";
    delete form["member_name"];
    delete form["collected_by"];
    delete form["loan_chit"];
    postData(form);
  };

  const populateLoanAndChitDetails = () => {
    const populateArray = [] as Record<string, string>[];
    if (customer) {
      if (customer.chits && customer.loans) {
        customer.chits.forEach((chit: any) => {
          populateArray.push({ _id: chit._id, name: chit.name, type: "chit" });
        });
        customer.loans.forEach((loan: any) => {
          populateArray.push({
            _id: loan._id,
            name: `Loan ${loan.loan_number}`,
            type: "loan",
          });
        });
      }
    }
    return populateArray;
  };

  const formProps = {
    formHeading: "Update Customer Payment",
    formData: [
      {
        id: "member_name",
        type: "text",
        validation: (val: any) => {},
        label: "Customer Name",
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
      },
      {
        id: "received_date",
        type: "date",
        validation: (val: any) => {},
        label: "Received Date",
        required: true,
        value: "",
        options: [],
      },
      {
        id: "collected_by",
        type: "text",
        validation: (val: any) => {},
        label: "Collected By",
        required: true,
        value: "",
        options: [],
        readOnly: true,
      },
      {
        id: "loan_chit",
        type: "select",
        validation: (val: any) => {},
        label: "Loan / Chit",
        required: true,
        value: "",
        options: [
          // populate with loan or chit names / number
          ...populateLoanAndChitDetails(),
        ],
        // readOnly: true,
      },
    ],
    handleSubmitAction: handleSubmit,
    initialValues: {
      member_name: customer ? customer.name : "",
      received_amount: "",
      received_date: "",
      collected_by: userName,
    },
    loader: mainLoader,
    dateMax: new Date().toISOString().slice(0, 10),
  };

  const downloadToExcel = async () => {
    await writeToExcel(rows);
  };

  function capitalizeFirstLetter(str:string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

  const postData = (form: any) => {
    setMainLoader(true);
    axios
      .post(`${APIService.api}/transaction`, form, header)
      .then((response: any) => {
        setOpenDialog(false);
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

        let errorMsg = "";
        const detailsError = error.response.data.msg;
        if(detailsError.code !== undefined){
          let temp: any = Object.keys(detailsError.keyValue).toString();
          errorMsg = temp.replace("_", " ") + " already exists "
        } else if(detailsError.message !== undefined){
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

  return (
    <React.Fragment>
      <CommonAlert alert={alert} />
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          isRowSelectable={() => {
            return false;
          }}
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          loading={loading}
        />
        <Button onClick={downloadToExcel} variant="outlined">
                  Download
                </Button>
      </Box>
      <CommonDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        formProps={formProps}
      />
    </React.Fragment>
  );
}