import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { APIService } from "../../constants/api";
import { Button, Typography } from "@mui/material";
import CommonDialog from "../common/dialog";
import CommonAlert from "../common/commonAlert";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { writetoExcel } from "../../excelexport";

export default function SettlementGrid() {
  const [rows, setRows] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mainLoader, setMainLoader] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const [agentId, setAgentId] = React.useState({ name: "", id: "" });
  const [loading, setLoading] = React.useState(false)
  const [region, setRegion] = React.useState("");
  const [transactionsArr, setTransactionsArr] = React.useState([]);
  const [transactionsId, setTransactionsId] = React.useState("");
  const navigate = useNavigate();

  const header = React.useMemo(() => {
    return {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
  }, []);

  const [alert, setAlert] = React.useState({
    show: false,
    severity: "success",
    message: "",
  });

  React.useEffect(() => {
    async function getAgentDetails() {
      setLoading(true)
      axios
        .get(`${APIService.api}/users/agent`, header)
        .then(async (response: any) => {
          let res: any = [];
          let tDetails: any = [];
          for (let i = 0; i < response.data.length; i++) {
            const currentAgent = response.data[i];
            const allTransactions = await getAllTransactionsOfAgent(
              currentAgent._id
            );

            // group all transactions by date

            // allTransactions.forEach((transaction: any) => {
            //   transaction["date"] = new Date(
            //     transaction.received_date
            //   ).toDateString();
            // });

            // const dateObject = {} as any;
            // allTransactions.forEach((transaction: any) => {
            //   if (dateObject[`${transaction["date"]}`]) {
            //     dateObject[`${transaction["date"]}`].push(transaction);
            //   } else {
            //     dateObject[`${transaction["date"]}`] = [transaction] as any;
            //   }
            // });

            allTransactions.forEach((transaction: any) => {

              tDetails.push(transaction)

              let loanAmountCollected = transaction.type === "loan" ? transaction.received_amount : 0;
              let chitAmountCollected = transaction.type === "chit" ? transaction.received_amount : 0;

              // dateObject[property].forEach((details: any) => {
              //   if (details.type === "loan") {
              //     loanAmountCollected += details.received_amount;
              //   } else if (details.type === "chit") {
              //     chitAmountCollected += details.received_amount;
              //   } else if (details.type === "settlement") {
              //     amountSettled += details.received_amount;
              //   }
              // });

              const resObject = {
                name: currentAgent.name,
                date:  new Date(transaction.received_date).toDateString(),
                region: capitalizeFirstLetter(currentAgent.region),
                chit_amount: chitAmountCollected,
                loan_amount: loanAmountCollected,
                id: transaction._id,
                agentId: currentAgent._id,
              };

              if(transaction.settlement){
                res.push(resObject)
              } 

              // res = res.filter((v: any,i: any, a:any)=>a.findIndex((v2: any)=>(v2.id!==v.id))===i)
              // res.push(resObject);
            })
          }
          setLoading(false)
          setRows(res);
          setTransactionsArr(tDetails);
        })
        .catch((error: any) => {
          // setMainLoader(false);
          console.log(error);
          setLoading(false)
        });
    }

    async function getAllTransactionsOfAgent(agent_id: string) {
      try {
        const response = await axios.get(
          `${APIService.api}/all_transactions/agent/${agent_id}`,
          header
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }

    getAgentDetails();
  }, [header, trigger]);

  const handleSubmit = (form: any) => {

    const tempUuId = uuidv4();

    let oldForm: any = transactionsArr.filter((item : any) => item._id === transactionsId)

    oldForm[0].settlement = false;
    oldForm[0].transaction_for = tempUuId;

    form["client"] = {id:agentId.id,name:agentId.name};
    form["type"] = "settlement";
    form["transaction_number"] = tempUuId;
    form["agent"] = {id:agentId.id,name:agentId.name};
    form["region"] = region;

    // const d = new Date();
    // const date = `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
    delete form["collected_by"];
    delete form["loan_chit"];
    postData(form, oldForm[0]);
  };

  const postData = (form: any, form2: any) => {
    setMainLoader(true);
    axios
      .post(`${APIService.api}/transaction`, form, header)
      .then((response) => {

        axios
        .post(`${APIService.api}/transaction`, form2, header)
        .then((response) => {
        }).catch((error: any) => {

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

        });

        setMainLoader(false);
        setOpenDialog(false);
        setTrigger(!trigger);
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
        setRegion("");
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
        setRegion("");
      });
  };

  const formProps = {
    formHeading: "Amount Settlement",
    formData: [
      {
        id: "received_amount",
        type: "number",
        validation: (val: any) => {},
        label: "Approve Amount",
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
        id: "received_date",
        type: "date",
        validation: (val: any) => {},
        label: "Settlement Date",
        required: true,
        value: "",
        options: [],
      },
    ],
    handleSubmitAction: handleSubmit,
    initialValues: {
      received_amount: "",
      collected_by: agentId.name,
    },
    loader: mainLoader,
    dateMax: new Date().toISOString().slice(0, 10),
  };

  const downloadToExcel = async () => {
    await writetoExcel(rows);
  };
  function capitalizeFirstLetter(str:string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 170,
      editable: false,
    },
    {
      field: "name",
      headerName: "Agent",
      width: 180,
      editable: false,
      renderCell: (params) => {
        if (params.row.disabled) {
          return <Typography color="error">{params.row.name}</Typography>;
        } else {
          return (
            <Button
              onClick={() => {
                // go to customer details
                navigate(`/agent/${params.row.agentId}`);
              }}
            >
              <Typography>{params.row.name}</Typography>
            </Button>
          );

        }
      },
    },
    {
      field: "region",
      headerName: "Region",
      width: 170,
      editable: false,
    },
    {
      field: "chit_amount",
      headerName: "Chit amount collected",
      width: 210,
      editable: false,
    },
    {
      field: "loan_amount",
      headerName: "Loan amount collected",
      width: 210,
      editable: false,
    },
    {
      field: "amount_settled",
      headerName: "Settle Amount",
      width: 170,
      editable: false,
      renderCell: (params) => {
          return (
            <Button
              variant="contained"
              onClick={() => {
                setAgentId({
                  name: params.row.name,
                  id: params.row.agentId,
                });
                setRegion(params.row.region)
                setTransactionsId(params.row.id);
                setOpenDialog(true);
              }}
            >
              Settle Amount
            </Button>
          );
      },
    },
  ];

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
    </React.Fragment>
  );
}
