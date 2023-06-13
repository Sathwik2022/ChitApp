import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { APIService } from "../../constants/api";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { excelWrite } from "../../excelexport";

export default function CustomerReportGrid() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false)

  const userType = JSON.parse(
    window.localStorage.getItem("chit_app_user")!
  ).type;
  const region = JSON.parse(
    window.localStorage.getItem("chit_app_user")!
  ).region;
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
    async function getCustomerDetails() {
      setLoading(true)
      axios
        .get(api, header)
        .then(async (response: any) => {
          const res: any = [];

          for (let i = 0; i < response.data.length; i++) {
            const customer = response.data[i];
            // get all loans
            const customerLoans = await getCustomerLoans(customer._id);

            for (let l = 0; l < customerLoans.length; l++) {
              const currentLoan = customerLoans[l];
              const loanTransactions = await getTransactions(
                currentLoan._id,
                customer._id
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
              currentLoan["name"] = currentLoan["client"]["name"];
              currentLoan["client_id"] = currentLoan["client"]["id"];
              currentLoan["id"] = currentLoan._id;
              currentLoan["start_date"] = new Date(
                currentLoan["issued_date"]
              ).toDateString();
              res.push(currentLoan);
            }

            const customerChits = await getCustomerChits(customer._id);

            for (let c = 0; c < customerChits.length; c++) {
              const currentChit = customerChits[c];
              const chitTransactions = await getTransactions(
                currentChit._id,
                customer._id
              );
              let paid = 0;
              chitTransactions.forEach((ct: any) => {
                if(ct.type === "chit"){
                  paid += ct.received_amount;
                }
              });
              currentChit["id"] = currentChit._id;
              currentChit["name"] = customer.name;
              currentChit["client_id"] = customer._id;
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

          //   response.data.forEach((ele: any) => {
          //     res.push({
          //       name: ele.name,
          //       contact_number: ele.contact_number,
          //       aadhar_number: ele.aadhar_number,
          //       pan: ele.pan,
          //       address: ele.address,
          //       region: ele.region,
          //       id: ele._id,
          //       number_of_installments: ele.number_of_installments,
          //       type: "customer",
          //       disabled: ele.disabled ? ele.disabled : false,
          //       date_of_birth: ele.date_of_birth,
          //       email: ele.email,
          //       onClick: () => {},
          //     });
          //   });
          const x = res.filter(
            (v: any, i: any, a: any) =>
              a.findIndex((v2: any) => v2.id === v.id) === i
          );
          setLoading(false)
          setRows(x);
        })
        .catch((error: any) => {
          // setMainLoader(false);
          console.log(error);
          setLoading(false)
        });
    }
    async function getCustomerChits(customerId: string) {
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

    async function getCustomerLoans(customerId: string) {
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

    async function getTransactions(loanOrChitId: string, customerId: string) {
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

    getCustomerDetails();
  }, [region, userType, header]);

  const downloadToExcel = async () => {
    await excelWrite(rows);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Customer",
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
                navigate(`/customer/${params.row.client_id}`);
              }}
            >
              <Typography>{params.row.name}</Typography>
            </Button>
          );

        }
      },
    },
    {
      field: "loan_chit",
      headerName: "Loan or Chit",
      width: 150,
      editable: false,
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
      width: 200,
      editable: false,
    },
    {
      field: "payable",
      headerName: "Payable",
      width: 200,
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
    </React.Fragment>
  );
}
