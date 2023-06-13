import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { APIService } from "../../constants/api";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {IChit} from "../../interface/definedTypes";
import { excel } from "../../excelexport";

export default function ChitGrid() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false)

  const navigate = useNavigate();

  React.useEffect(() => {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    async function getAllChits() {
      setLoading(true)
      try {
        const response = await axios.get(`${APIService.api}/chits`, header);
        if (response.status === 200) {
          response.data.forEach((element: any) => {
            element.id = element._id;
            element.start = new Date(element.start_date).toDateString();
            // element.installment = "tbc";
            element.installment = `${element.number_of_installments} months`;
            element.participants = element.clients.length;
            // element.status = "tbc";
          });
          setRows(response.data);
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    }
    getAllChits();
  }, []);

  const downloadToExcel = async () => {
    await excel(rows);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Chit Name",
      width: 150,
      editable: false,
      renderCell: (params) => {
        return (
          <div>
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
                // 
                navigate(`/chit/${params.row.id}`, {state: chitDetails});
              }}
            >
              {" "}
              {params.row.name}{" "}
            </Button>
          </div>
        );
      },
    },
    {
      field: "start",
      headerName: "Start Date",
      width: 200,
      editable: false,
    },
    {
      field: "amount",
      headerName: "Chit Amount",
      width: 150,
      editable: false,
    },
    {
      field: "installment",
      headerName: "Installments",
      width: 180,
      editable: false,
    },
    // {
    //   field: "number_of_installments",
    //   headerName: "Count",
    //   width: 120,
    //   editable: false,
    // },
    {
      field: "installment_amount",
      headerName: "Installment Amount",
      width: 150,
      editable: false,
    },
    {
      field: "participants",
      headerName: "Participants",
      width: 130,
      editable: false,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 130,
    //   editable: false,
    // },
  ];

  return (
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
    // <div></div>
  );
}
