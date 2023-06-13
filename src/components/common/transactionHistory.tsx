import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useLocation, useParams } from "react-router-dom";
import TabComponent from "../common/tabsComponent";
import axios from "axios";
import { APIService } from "../../constants/api";
import { Typography } from "@mui/material";
import { ITransactionHistory, IChit, ILoan } from "../../interface/definedTypes";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function TransactionHistory() {
  const navigate = useNavigate();
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false)
    let params = useParams();
    const data = useLocation().state as ITransactionHistory;
    const cust_id = params.id;
    const type = data.type;
    const transaction_number = data.transaction_number;
    const cust_name = data.name;

  const header = React.useMemo(() => {
    return {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
  }, []);


  React.useEffect(() => {
    // let header = {
    //   headers: {
    //     Authorization: "Bearer " + window.localStorage.getItem("token"),
    //   },
    // };
    // async function getAllChits() {
    //   try {
    //     const response = await axios.get(`${APIService.api}/chits`, header);
    //     if (response.status === 200) {
    //       response.data.forEach((element: any) => {
    //         element.id = element._id;
    //         element.start = new Date(element.start_date).toDateString();
    //         element.installment = "tbc";
    //         element.duration = `${element.number_of_installments} months`;
    //         element.participants = element.clients.length;
    //         element.status = "tbc";
    //       });
    //       setRows(response.data);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // getAllChits();


    async function getCustomerChits(customerId: string | undefined) {
        try {
          const chits = await axios.get(
            `${APIService.api}/chits/${customerId}`,
            header
          );
          return chits.data;
        } catch (error) {
          console.log(error);
        }
      }
  
      async function getCustomerLoans(customerId: string | undefined) {
        try {
          const loans = await axios.get(
            `${APIService.api}/loans/${customerId}`,
            header
          );
          return loans.data;
        } catch (error) {
          console.log(error);
        }
      }
  
      async function getTransactions(loanOrChitId: string, customerId: string | undefined) {
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

      async function getAllTransactionDetails() {
        setLoading(true)
        const res: any = [];

        if(type === "all" || type === "chit"){
          let customerChits = await getCustomerChits(cust_id);

          if(type === "chit"){
            customerChits = customerChits.filter((val: any) => val._id === transaction_number);
          }

          for (let i = 0; i < customerChits.length; i++) {
              const currentChit = customerChits[i];
              const chitTransactions = await getTransactions(
                currentChit._id,
                cust_id
              );
              let paid = 0;
              chitTransactions.forEach((ct: any) => {
                if(ct.type === "chit"){
                  paid += ct.received_amount;
                }
              });
              currentChit["id"] = currentChit._id;
              currentChit["cust_name"] = cust_name;
              currentChit["loan_chit"] = "Chit";
              currentChit["start_date"] = new Date(
                currentChit["start_date"]
              ).toDateString();
              currentChit["payable"] = currentChit["amount"];
              currentChit["paid"] = paid;
              currentChit["pending"] = currentChit["amount"] - paid;
              res.push(currentChit);
            }
        }
        
        if(type === "all" || type === "loan"){

            let customerLoans = await getCustomerLoans(cust_id);

            if(type === "loan"){
              customerLoans = customerLoans.filter((val: any) => val._id === transaction_number);
            }
            
            for (let i = 0; i < customerLoans.length; i++) {
              const currentLoan = customerLoans[i];
              const loanTransactions = await getTransactions(
                currentLoan._id,
                cust_id
              );
              // const interest =
              //   (currentLoan.amount * currentLoan.rate_of_interest) / 100;
              let paid = 0;
              let pending = 0;
              loanTransactions.forEach((lt: any) => {
                if(lt.type === "loan"){
                  paid += lt.received_amount;
                }
              });
              if (paid > 0) {
                // pending =
                //   interest * currentLoan.number_of_installments +
                //   currentLoan.amount -
                //   paid;
                pending = currentLoan["payable"] - paid;
              }
              // currentLoan["payable"] =
              //   interest * currentLoan.number_of_installments +
              //   currentLoan.amount;
              currentLoan["paid"] = paid;
              currentLoan["pending"] = pending;
              currentLoan["loan_chit"] = "Loan";
              currentLoan["name"] = currentLoan.loan_number;
              currentLoan["cust_name"] = currentLoan["client"]["name"];
              currentLoan["id"] = currentLoan._id;
              currentLoan["start_date"] = new Date(
                currentLoan["issued_date"]
              ).toDateString();
              res.push(currentLoan);
            }
          }

          const x = res.filter(
            (v: any, i: any, a: any) =>
              a.findIndex((v2: any) => v2.id === v.id) === i
          );
          setRows(x);
          setLoading(false);
      }

    getAllTransactionDetails()

  }, [cust_id,header]);

  const columns: GridColDef[] = [
    {
      field: "cust_name",
      headerName: "Customer",
      width: 180,
      editable: false,
      renderCell: (params) => {
        if (params.row.disabled) {
          return <Typography color="error">{params.row.cust_name}</Typography>;
        } else {
          return (
            <Button
              onClick={() => {
                // go to customer details
                navigate(`/customer/${cust_id}`);
              }}
            >
              <Typography>{params.row.cust_name}</Typography>
            </Button>
          );

        }
      },
    },
    {
      field: "loan_chit",
      headerName: "Type",
      width: 100,
      editable: false,
      hide:type === "all" ? false : true,
    },
    {
      field: "name",
      headerName: "Type Name",
      width: 150,
      editable: false,
      hide:type === "all" ? false : true,
      renderCell: (params) => {
          return (
            <Button
              onClick={() => {
                const chitDetails = {
                  _id: params.row.id,
                  name: params.row.name,
                  chit_number: params.row.chit_number,
                  clients: params.row.clients,
                  amount: params.row.amount,
                  start_date: params.row.start_date,
                  number_of_installments: params.row.number_of_installments,
                } as IChit;

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

                params.row.loan_chit === "Chit"? navigate(`/chit/${params.row.id}`, {state: chitDetails}) :  navigate(`/loan/${params.row.id}`, { state: loanDetails })
              }}
            >
              <Typography>{params.row.name}</Typography>
            </Button>
          );
      },
    },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 200,
      editable: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 160,
      editable: false,
    },
    {
      field: "payable",
      headerName: "Payable",
      width: 180,
      editable: false,
    },
    {
      field: "paid",
      headerName: "Paid",
      width: 180,
      editable: false,
    },
    {
      field: "pending",
      headerName: "Pending",
      width: 180,
      editable: false,
    },
  ];

  return (
    <React.Fragment>
          <TabComponent />
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
      </Box>
    </React.Fragment>
    // <div></div>
  );
}
