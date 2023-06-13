import React, { useState } from "react";
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
import { IChit, ILoan, IUser } from "../../interface/definedTypes";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { APIService } from "../../constants/api";

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

export default function CustomPaginationActionsTable(props: {
  heading: string;
  headers: string[];
  body: IChit[] | ILoan[] | IUser[];
  toggleSidebar: any;
}) {
  let navigate = useNavigate();
  const rows = props.body;
  const [page, setPage] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const enableOrDisable = (userId: string, enableOrDisable: boolean) => {
    setButtonDisabled(true);

    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };

    axios
      .post(`${APIService.api}/disable`, { user_id: userId }, header)
      .then((response) => {
        setButtonDisabled(false);
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      });
  };

  const renderDisableEnableButton = (disabled: boolean, userId: string) => {
    return (
      <div>
        <Button
          onClick={() => {
            enableOrDisable(userId, disabled);
          }}
          variant="outlined"
          color={disabled ? "info" : "error"}
          disabled={buttonDisabled}
        >
          {" "}
          {disabled ? "enable" : "disable"}{" "}
        </Button>
        <Button sx={{ml: 2}} onClick={() => {}} variant="outlined" color="success">
          Edit
        </Button>
      </div>
    );
  };

  return (
    <div>
      {/* <TabComponent {...headerProps} /> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {props.headers.map((header) => {
                return <TableCell key={header}> {header} </TableCell>;
              })}
            </TableRow>
          </TableHead>
          {rows.length > 0 && (
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row) => {
                let iLoan = row as ILoan;
                let iChit = row as IChit;
                let iUser = row as IUser;

                if (iLoan.loan_number) {
                  return (
                    <TableRow
                      onClick={() => {
                        navigate(`/loan/${iLoan._id}`, {
                          state: iLoan,
                        });
                      }}
                      key={iLoan._id}
                    >
                      <TableCell component="th" scope="row">
                        {iLoan.loan_number}
                      </TableCell>
                      <TableCell style={{ width: 80 }}>
                        {iLoan.amount}
                      </TableCell>
                      <TableCell style={{ width: 140 }}>
                        {iLoan.client.name}
                      </TableCell>
                    </TableRow>
                  );
                } else if (iChit.start_date) {
                  return (
                    <TableRow
                      onClick={() => {
                        navigate(`/chit/${iChit._id}`, {
                          state: iChit,
                        });
                      }}
                      key={iChit.name}
                    >
                      <TableCell component="th" scope="row">
                        {iChit.name}
                      </TableCell>
                      <TableCell style={{ width: 80 }}>
                        {iChit.amount}
                      </TableCell>
                      <TableCell style={{ width: 140 }}>
                        {new Date(iChit.start_date).toDateString()}
                      </TableCell>
                    </TableRow>
                  );
                } else if (iUser.type==="agent") {
                  return (
                    <TableRow key={iUser.name}>
                    <TableCell
                      onClick={() => {
                        navigate(`/agent/${iUser._id}`);
                      }}
                      component="th"
                      scope="row"
                    >
                      {iUser.name}
                    </TableCell>
                    <TableCell>{iUser.contact_number}</TableCell>
                    <TableCell>{iUser.region}</TableCell>
                    <TableCell>{new Date(iUser.joining_date!).toDateString()}</TableCell>
                    <TableCell>
                      {renderDisableEnableButton(iUser.disabled!, iUser._id!)}
                    </TableCell>
                  </TableRow>
                  );
                }
                return (
                  <TableRow key={iUser.name}>
                    <TableCell
                      onClick={() => {
                        navigate(`/customer/${iUser._id}`);
                      }}
                      component="th"
                      scope="row"
                    >
                      {iUser.name}
                    </TableCell>
                    <TableCell>{iUser.contact_number}</TableCell>
                    <TableCell>{iUser.aadhar_number}</TableCell>
                    <TableCell>{iUser.pan}</TableCell>
                    <TableCell>{iUser.address}</TableCell>
                    <TableCell>{iUser.region}</TableCell>
                    <TableCell>
                      {renderDisableEnableButton(iUser.disabled!, iUser._id!)}
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

          {rows.length === 0 && (
            <TableBody>
              <TableRow>
                <TableCell>No Data Available</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          )}

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 15, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={rows.length}
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
    </div>
  );
}
