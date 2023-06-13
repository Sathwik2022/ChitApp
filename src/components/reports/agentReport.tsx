import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  reportDetailsReducer,
  IReportState,
  ReportActions,
} from "../../reducers/reportsReducer";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { APIService } from "../../constants/api";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function TablePaginationActions(props: any) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function AgentReport(props: { stateObject: any }) {
  const initState: IReportState = {
    payload: [],
    loading: false,
    error: null,
  };
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reportDetailsReducer, initState);

  function callApiFunction(from: string, to: string) {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    async function makeAPICall() {
      try {
        dispatch({ type: ReportActions.CALL_API, payload: [], error: "" });
        const response = await axios.get(
          `${APIService.api}/filter_transactions/agent/${from}/${to}`,
          header
        );
        if (response.status === 200) {
          dispatch({
            type: ReportActions.SUCCESS,
            payload: response.data,
            error: "",
          });
        }
      } catch (error: any) {
        dispatch({
          type: ReportActions.ERROR,
          payload: [],
          error: error.message,
        });
      }
    }
    makeAPICall();
  }

  useEffect(() => {
    let fromDate: string = "";
    let toDate: string = "";
    if (
      props.stateObject.filterDate !== "custom" &&
      props.stateObject.filterDate !== "day"
    ) {
      // today - same from,to

      if (
        props.stateObject.filterDate === "today" ||
        props.stateObject.filterDate === "yesterday"
      ) {
        fromDate = props.stateObject.singleDay.toString();
        toDate = "none";
      } else if (props.stateObject.filterDate === "month") {
        const todayMonth = new Date();
        fromDate = new Date(
          todayMonth.getFullYear(),
          todayMonth.getMonth(),
          1
        ).toString();
        toDate = todayMonth.toString();
      } else if (props.stateObject.filterDate === "last-month") {
        const date = new Date();
        fromDate = new Date(
          date.getFullYear(),
          date.getMonth() - 1,
          1
        ).toString();
        toDate = new Date(date.getFullYear(), date.getMonth(), 0).toString();
      }
    } else if (props.stateObject.filterDate === "day") {
      fromDate = props.stateObject.singleDay.toString();
      toDate = "none";
    } else if (props.stateObject.filterDate === "custom") {
      fromDate = props.stateObject.fromDate.toString();
      toDate = props.stateObject.toDate.toString();
    }
    if (fromDate !== "") {
      callApiFunction(fromDate, toDate);
    }
  }, [props.stateObject]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (state.payload ? state.payload.length : 0)
        )
      : 0;

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderData = () => {
    if (state.payload !== null && !state.loading) {
      if (state.payload.length > 0) {
        return (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell> S.No </TableCell>
                  <TableCell> Name </TableCell>
                  <TableCell> Amount Collection </TableCell>
                  <TableCell> Amount Settled </TableCell>
                  <TableCell> Unsettled Amount </TableCell>
                </TableRow>
              </TableHead>
              {state.payload.length > 0 && (
                <TableBody>
                  {(rowsPerPage > 0
                    ? state.payload.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : state.payload
                  ).map((transaction: any) => {
                    return (
                      <TableRow key={transaction._id}>
                        <TableCell component="th" scope="row">
                          {transaction.count}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Button
                            onClick={() => {
                              navigate(`/agent/${transaction._id}`);
                            }}
                            >
                            <Typography>{transaction.name}</Typography>
                          </Button>
                        </TableCell>
                        <TableCell style={{ width: 180 }}>
                          {transaction.collected > 0 && (
                            <React.Fragment>
                              Rs{" "}
                              <Button
                                onClick={() => {
                                  navigate(
                                    `/collection/details/${transaction._id}`,
                                    { state: transaction }
                                  );
                                }}
                              >
                                {transaction.collected}
                              </Button>
                            </React.Fragment>
                          )}
                          {transaction.collected === 0 && (
                            <div>Rs {transaction.collected}</div>
                          )}
                        </TableCell>
                        <TableCell style={{ width: 180 }}>
                          {transaction.settled > 0 && (
                            <React.Fragment>
                              Rs{" "}
                              <Button
                                onClick={() => {
                                  navigate(
                                    `/collection/details/${transaction._id}`,
                                    { state: transaction }
                                  );
                                }}
                              >
                                {transaction.settled}
                              </Button>
                            </React.Fragment>
                          )}
                          {transaction.settled === 0 && (
                            <div>Rs {transaction.settled}</div>
                          )}
                        </TableCell>
                        <TableCell style={{ width: 180 }}>
                          {transaction.balance > 0 && (
                            <React.Fragment>
                              Rs{" "}
                              <Button
                                onClick={() => {
                                  navigate(
                                    `/collection/details/${transaction._id}`,
                                    { state: transaction }
                                  );
                                }}
                              >
                                {transaction.balance}
                              </Button>
                            </React.Fragment>
                          )}
                          {transaction.balance === 0 && (
                            <div>Rs {transaction.balance}</div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              )}

              {state.payload.length === 0 && (
                <TableBody>
                  <TableRow>
                    <TableCell>No Data Available</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              )}

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      10,
                      15,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={5}
                    count={state.payload.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        );
      } else return <Typography>No data available</Typography>;
    } else if (state.loading) {
      return <CircularProgress />;
    } else if (!state.payload && state.error !== "") {
      return (
        <Typography sx={{ color: "red" }}>
          <>{state.error}</>
        </Typography>
      );
    }
    return <span></span>;
  };

  return <div>{renderData()}</div>;
}
