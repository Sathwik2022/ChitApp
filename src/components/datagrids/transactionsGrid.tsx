import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import TabComponent from "../common/tabsComponent";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function TransactionsGrid() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const location = useLocation();
  const data = location.state as any;


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

    let counter = 0;
    let tempRows: any = [];
    data.details.forEach((element: any) => {
        if(element.type === "chit" || element.type === "loan"){
          let tempElement = element;
          tempElement["counter"] = ++counter;
          tempElement["id"] = element._id;
          tempElement["customer_name"] = element.client.name;
          tempElement["received_on"] = new Date(element.received_date).toDateString();
  
          let tempArr = data.details.filter((item : any) => element.transaction_for === item.transaction_number);

          if(tempArr.length){
            tempElement["settled_amount"] = tempArr[0].received_amount;
            tempElement["settled_on"] = new Date(tempArr[0].received_date).toDateString();
            tempElement["balance"] = element.received_amount - tempArr[0].received_amount;
          } else {
            tempElement["settled_amount"] = data.isAdmin ? element.received_amount : 0;
            tempElement["settled_on"] = data.isAdmin ? new Date(element.received_date).toDateString() : " - ";
            tempElement["balance"] = data.isAdmin ? 0 : element.received_amount;
          }

          tempRows.push(tempElement)
        }
    });
    setRows(tempRows);
  }, [data]);

  const columns: GridColDef[] = [
    {
        field: "counter",
        headerName: "S.NO",
        width: 80,
        editable: false,
      },
    {
      field: "customer_name",
      headerName: "Customer Name",
      width: 200,
      editable: false,
      renderCell: (params) => {
          return (
            <Button
              onClick={() => {
                // go to customer details
                navigate(`/customer/${params.row.client.id}`);
              }}
            >
              <Typography>{params.row.customer_name}</Typography>
            </Button>
          );
      },
    },
    {
      field: "region",
      headerName: "Region",
      width: 200,
      editable: false,
    },
    {
      field: "type",
      headerName: "Type",
      width: 110,
      editable: false,
    },
    {
      field: "received_amount",
      headerName: "Amount Collected",
      width: 160,
      editable: false,
    },
    {
      field: "received_on",
      headerName: "Collected Date",
      width: 160,
      editable: false,
    },
    {
      field: "settled_amount",
      headerName: "Amount Settled",
      width: 160,
      editable: false,
    },
    {
      field: "settled_on",
      headerName: "Settled Date",
      width: 160,
      editable: false,
    },
    {
      field: "balance",
      headerName: "Remaining Balance",
      width: 160,
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
        />
      </Box>
    </React.Fragment>
    // <div></div>
  );
}
