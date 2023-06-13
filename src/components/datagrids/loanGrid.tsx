import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { APIService } from "../../constants/api";
import { IconButton } from "@mui/material";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import PaidIcon from '@mui/icons-material/Paid';
import HistoryIcon from "@mui/icons-material/History";
import CommonDialog from "../common/dialog";
import SimpleDialog from "../common/simpleDialog";
import { ILoan, ITransaction } from "../../interface/definedTypes";
import { writeExcel } from "../../excelexport";

export default function LoanGrid() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false)
  const [currentLoanDetails, setCurrentLoanDetails] = React.useState({
    _id: "",
    region: "",
    client: "",
  })
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSimpleDialog, setOpenSimpleDialog] = React.useState(false);
  const [mainLoader, setMainLoader] = React.useState(false);
  const [memberName, setMemberName] = React.useState("");

  const hideActions:boolean = Number(window.localStorage.getItem("tab")) === 1? true : false;

  const [loanTransactions, setLoanTransactions] = React.useState<ITransaction[]>([]);

  const [alert, setAlert] = React.useState({
    show: false,
    severity: "success",
    message: "",
  });

  const handleSubmit = (form: any) => {
    const currentuser = JSON.parse(
      localStorage.getItem("chit_app_user") || "{}"
    );

    form["client"] = currentLoanDetails.client;
    form["transaction_number"] = currentLoanDetails._id;
    form["agent"] = { id: currentuser._id, name: currentuser.name };
    form["region"] = currentLoanDetails.region;
    form["type"] = "loan";
    delete form["member_name"];

    postData(form);
  };

  const postData = (form: any) => {
    setMainLoader(true);
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    axios
      .post(`${APIService.api}/transaction`, form, header)
      .then((response: any) => {
        setMainLoader(false);
        setOpenDialog(false);
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
    ],
    handleSubmitAction: handleSubmit,
    initialValues: {
      member_name: memberName,
      received_amount: "",
      received_date: "",
    },
    loader: mainLoader,
    dateMax: new Date().toISOString().slice(0, 10),
  };

  React.useEffect(() => {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    async function getAllLoans() {
      setLoading(true)
      try {
        const response = await axios.get(`${APIService.api}/loans`, header);
        if (response.status === 200) {
          for (let i = 0; i < response.data.length; i++) {
            const current = response.data[i];
            const loanTransactions = await getTransactions(
              current._id,
              current.client.id
            );
            // const interest =
            //   (response.data[i].amount * response.data[i].rate_of_interest) /
            //   100;
            let paid = 0;
            let pending = 0;
            let tHistory:any = [];
            
            loanTransactions.forEach((lt: any) => {
              paid += lt.received_amount;
              tHistory.push({received_amount:lt.received_amount,received_date:lt.received_date,_id:lt._id,received_by:lt.agent.name})
            });
            if (paid > 0) {
              // pending =
              //   interest * response.data[i].number_of_installments +
              //   response.data[i].amount -
              //   paid;

              pending = response.data[i]["payable"]-paid;
            }
            // response.data[i]["payable"] =
            //   interest * response.data[i].number_of_installments +
            //   response.data[i].amount;
            response.data[i]["history"] = tHistory;
            response.data[i]["paid"] = paid;
            response.data[i]["pending"] = pending;
            response.data[i].id = response.data[i]._id;
            response.data[i].receiver_id = response.data[i].client.id;
            response.data[i].receiver = response.data[i].client.name;
            response.data[i].start = new Date(
              response.data[i].issued_date
            ).toDateString();
          }

          setRows(response.data);
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    }

    async function getTransactions(loanOrChitId: string, customer_id: string) {
      try {
        const response = await axios.get(
          `${APIService.api}/transactions/${loanOrChitId}/${customer_id}`,
          header
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }

    getAllLoans();
  }, []);

  const downloadToExcel = async () => {
    await writeExcel(rows);
  };

  const columns: GridColDef[] = [
    // {
    //   field: "info",
    //   headerName: "Info",
    //   width: 50,
    //   editable: false,
    //   renderCell: (params) => {
    //     return (
    //       <IconButton
    //         onClick={() => {
    //           const loanDetails = {
    //             _id: params.row.id,
    //             loan_number: params.row.loan_number,
    //             amount: params.row.amount,
    //             issued_date: params.row.issued_date,
    //             repayment_type: params.row.repayment_type,
    //             region: params.row.region,
    //             client: params.row.client,
    //             agent: params.row.agent,
    //           } as ILoan;
    //           navigate(`/loan/${params.row._id}`, { state: loanDetails });
    //         }}
    //       >
    //         <InfoIcon />
    //       </IconButton>
    //     );
    //   },
    // },
    {
      field: "repayment_type",
      headerName: "Type",
      width: 130,
      editable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              const loanDetails = {
                _id: params.row.id,
                loan_number: params.row.loan_number,
                amount: params.row.amount,
                issued_date: params.row.issued_date,
                repayment_type: params.row.repayment_type,
                region: params.row.region,
                client: params.row.client,
                agent: params.row.agent,
              } as ILoan;
              navigate(`/loan/${params.row._id}`, { state: loanDetails });
            }}
          >
            {params.row.repayment_type}
          </Button>
        );
      },
    },
    {
      field: "receiver",
      headerName: "Reciever",
      width: 170,
      editable: false,
      renderCell: (params) => {
          return (
            <Button
              onClick={() => {
                // go to customer details
                navigate(`/customer/${params.row.receiver_id}`);
              }}
            >
              <Typography>{params.row.receiver}</Typography>
            </Button>
          );
      },
    },
    {
      field: "start",
      headerName: "Start Date",
      width: 180,
      editable: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      editable: false,
    },
    {
      field: "payable",
      headerName: "Amount Payable",
      width: 130,
      editable: false,
    },
    {
      field: "paid",
      headerName: "Amount Paid",
      width: 130,
      editable: false,
    },
    {
      field: "pending",
      headerName: "Pending",
      width: 100,
      editable: false,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 120,
      editable: false,
      hide: hideActions,
      renderCell: (params) => {
        return (
          <>
          <IconButton
          aria-label="add to favorites"
          onClick={() => {
            setCurrentLoanDetails({
              _id: params.row.id,
              region: params.row.region,
              client: params.row.client,
            });
            setMemberName(params.row.receiver);
            setOpenDialog(true);
          }}
        >
          <PaidIcon />
        </IconButton>

        <IconButton
            color="primary"
            aria-label="info-icon"
            onClick={() => {
              console.log(753,params.row.history)
              setLoanTransactions(params.row.history);
              setOpenSimpleDialog(true);
            }}
          >
            <HistoryIcon />
          </IconButton>
        </>
        );
      },
    },
  ];

  return <>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            isRowSelectable={() => {
              return false;
            }}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
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
        <SimpleDialog
          openSimpleDialog={openSimpleDialog}
          setOpenSimpleDialog={setOpenSimpleDialog}
          title="Transaction History"
          loanTransactions={loanTransactions}
        />
    </>

    // <div></div>
  
}
