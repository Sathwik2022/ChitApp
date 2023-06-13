import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { APIService } from "../../constants/api";
import Button from "@mui/material/Button";
import { IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { excelToWrite } from "../../excelexport";
import InfoIcon from "@mui/icons-material/Info";

export default function AgentGrid() {
  const [rows, setRows] = React.useState([]);
  const [trigger, setTrigger] = React.useState(false);
  const [loading, setLoading] = React.useState(false)

  const navigate = useNavigate();

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

  React.useEffect(() => {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    async function getAgentDetails() {
      setLoading(true)
      axios
        .get(`${APIService.api}/users/agent`, header)
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
              joining_date: ele.joining_date,
              date_of_birth: ele.date_of_birth,
              email: ele.email,
              id: ele._id,
              type: "agent",
              disabled: ele.disabled ? ele.disabled : false,
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
  }, [trigger]);

  const columns: GridColDef[] = [
    // {
    //   field: "info",
    //   headerName: "info",
    //   width: 90,
    //   renderCell: (params) => {
    //     return (
    //       <IconButton
    //         onClick={() => {
    //           navigate(`/agent/${params.row.id}`);
    //         }}
    //       >
    //         <InfoIcon />
    //       </IconButton>
    //     );
    //   },
    // },
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
                navigate(`/agent/${params.row.id}`);
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
      headerName: "Phone",
      width: 150,
      editable: false,
    },
    {
      field: "region",
      headerName: "Region",
      width: 210,
      editable: false,
    },
    {
      field: "joining_date",
      headerName: "Joining Date",
      width: 170,
      editable: false,
      renderCell: (params) => {
        return <div>{new Date(params.row.joining_date).toDateString()}</div>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      editable: false,
      renderCell: (params) => {
        return (
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
                  joining_date: params.row.joining_date,
                  email: params.row.email,
                };
                navigate("/editAgent", { state });
              }}
              variant="outlined"
              color="success"
            >
              Edit
            </Button>
          </React.Fragment>
        );
      },
    },
  ];

  const downloadToExcel = async () => {
    await excelToWrite(rows);
  };
  function capitalizeFirstLetter(str:string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

  return (
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
  );
}
