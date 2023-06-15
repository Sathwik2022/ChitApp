import React from "react";
//import List from "@mui/material/List";
//import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
//import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
//import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
//import { ITransactionHistory } from "../../interface/definedTypes";
import HistoryIcon from "@mui/icons-material/History";
import PaidIcon from '@mui/icons-material/Paid';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

export default function MembersList(props: {
  membersInfoTable: object[];
  setOpenDialog: any;
  setClientId: any;
  setClientName: any;
  loading:any;
  formProps:any;
  setOpenSimpleDialog:any;
  setLoanTransactions:any;
  withdrawalTransactions:any;
}) {
  const navigate = useNavigate();


  const handleTransactionClick = (historyArr : any) => {
    if(props.withdrawalTransactions.length > 0){
      let bHistory:any = [];
      let withdrawalTransactionArr = props.withdrawalTransactions.filter((item : any) => item.client._id === historyArr.id)
      if(withdrawalTransactionArr.length){
        bHistory.push({received_amount:withdrawalTransactionArr[0].received_amount,received_date:withdrawalTransactionArr[0].received_date,_id:withdrawalTransactionArr[0].client._id,received_by:withdrawalTransactionArr[0].agent.name,type:"withdrawn"})
        let newHistory = [...historyArr.history,...bHistory]
        props.setLoanTransactions(newHistory);
      } else {
        props.setLoanTransactions(historyArr.history);
      }
    } else {
      props.setLoanTransactions(historyArr.history);
    }
  }

  const columns: GridColDef[] = [
    // {
    //   field: "chitName",
    //   headerName: "Chit Name",
    //   width: 180,
    //   editable: false,
    // },
    {
      field: "custName",
      headerName: "Customer Name",
      width: 230,
      editable: false,
      renderCell: (params) => {
        return (
          <div>
              <Button onClick={() => {
                navigate(`/customer/${params.row.id}`)
              }} >
              {params.row.custName}
              </Button>
          </div>
        );
      },
    },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 170,
      editable: false,
    },
    {
      field: "payable",
      headerName: "Payable",
      width: 130,
      editable: false,
    },
    {
      field: "paid",
      headerName: "Paid",
      width: 130,
      editable: false,
    },
    {
      field: "pending",
      headerName: "Pending",
      width: 130,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              aria-label="add to favorites"
              onClick={() => {
                props.setClientId(params.row.id);
                props.setOpenDialog(true);
                props.setClientName(params.row.custName);
              }}
            >
              <PaidIcon />
            </IconButton>

            <IconButton
              color="primary"
              aria-label="info-icon"
              onClick={() => {
                handleTransactionClick(params.row)
                props.setOpenSimpleDialog(true);
              }}
              disabled={params.row.history.length === 0 ? true : false}
            >
              <HistoryIcon />
            </IconButton>

            <IconButton
              aria-label="add to favorites"
              onClick={() => {
                const formData = { client_id: params.row.id}
                props.formProps.handleSubmitAction(formData)
              }}
              disabled={params.row.history.length === 0 ? false : true}
            >
              <PersonRemoveIcon />
            </IconButton>
          </>
        );
      },
    },
  ];


  return (

    <Box sx={{ height: 400, width: "100%" }}>
    <DataGrid
      isRowSelectable={() => {
        return false;
      }}
      rows={props.membersInfoTable}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      loading={props.loading}
    />
  </Box>


    // <Paper sx={{ m: 2 }} style={{ maxHeight: 200, overflow: "auto" }}>
    //   <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
    //     {props.members.map((member: any, index: number) => {
    //       return (
    //         <ListItem key={index}>
    //           <Button variant="outlined" onClick={() => {
    //             navigate(`/customer/${member._id}`)
    //           }} >
    //           {member.name}
    //           </Button>
    //           <IconButton
    //             aria-label="add to favorites"
    //             onClick={() => {
    //               props.setClientId(member._id);
    //               props.setOpenDialog(true);
    //               props.setClientName(member.name);
    //             }}
    //           >
    //             <EditIcon />
    //           </IconButton>
    //         </ListItem>
    //       );
    //     })}
    //   </List>
    // </Paper>
  );
}
