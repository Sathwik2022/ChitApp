import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
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
import TableHead from "@mui/material/TableHead";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { IChit, ILoan } from "../../../interface/definedTypes";
import { Typography } from "@mui/material";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
 
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
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

interface IDetailsTableProps {
  tableHeaders: string[];
  tableData: Record<string, any>[];
  type: string;
}

export default function DetailsTable(props: IDetailsTableProps) {
  const rows = props.tableData;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderRow = (key: string, row: Record<string, any>) => {
    if (props.type === "customerLoan") {
      return (
        <TableRow key={key}>
          <TableCell> 
            <Button
              onClick={() => {
                const loanDetails = {
                  _id: row._id,
                  loan_number: row.loan_number,
                  amount: row.amount,
                  issued_date: row.issued_date,
                  repayment_type: row.repayment_type,
                  region: row.region,
                  client: row.client,
                  agent: row.agent,
                } as ILoan;

                navigate(`/loan/${row._id}`, {state: loanDetails})
              }}
            >
              <Typography>{row.repayment_type} </Typography>
            </Button>
          </TableCell>
          <TableCell> {new Date(row.issued_date).toDateString()} </TableCell>
          <TableCell> {row.amount} </TableCell>
          <TableCell> {row.payable} </TableCell>
          <TableCell> {row.paid ? row.paid : 0} </TableCell>
          <TableCell> {row.pending ? row.pending : 0} </TableCell>
        </TableRow>
      );
    } else if (props.type === "customerChit") {
      return (
        <TableRow key={key}>
          <TableCell>            
            <Button
              onClick={() => {
                const chitDetails = {
                  _id: row._id,
                  name: row.name,
                  chit_number: row.chit_number,
                  clients: row.clients,
                  amount: row.amount,
                  start_date: row.start_date,
                  number_of_installments: row.number_of_installments,
                } as IChit;

                navigate(`/chit/${row._id}`, {state: chitDetails})
              }}
            >
              <Typography>{row.name} </Typography>
            </Button>
          </TableCell>
          <TableCell> {row.amount} </TableCell>
          <TableCell> {row.installments_paid} </TableCell>
          <TableCell> {row.paid ? row.paid : 0} </TableCell>
          <TableCell> {row.pending ? row.pending : 0} </TableCell>
          <TableCell> {row.withdrawn ? row.withdrawn : 0} </TableCell>
        </TableRow>
      );
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            {/* <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            {props.tableHeaders.map((header) => (
              <TableCell> {header} </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) =>
            // <TableRow key={row.name}>
            //   <TableCell component="th" scope="row">
            //     {row.name}
            //   </TableCell>
            //   <TableCell style={{ width: 160 }} align="right">
            //     {row.calories}
            //   </TableCell>
            //   <TableCell style={{ width: 160 }} align="right">
            //     {row.fat}
            //   </TableCell>
            // </TableRow>
            renderRow(row._id, row)
          )}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
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
  );
}
