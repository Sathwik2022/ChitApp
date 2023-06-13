import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router-dom";
import { ILoan, IUser, ITransaction } from "../../interface/definedTypes";
import axios from "axios";
import { APIService } from "../../constants/api";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function LoanCard(props: any) {
  const data = useLocation().state as ILoan;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const [loanTransactions, setLoanTransactions] = useState<ITransaction[]>([]);
  const [receivedAmount, setReceivedAmount] = React.useState<number>(0);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    async function getUser() {
      try {
        const response = await axios.get(
          `${APIService.api}/user/${data.client.id}`,
          header
        );
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function getLoanTransactionsOfUser() {
      try {
        const response = await axios.get(
          `${APIService.api}/transactions/${data._id}/${data.client.id}`,
          header
        );
        if (response.status === 200) {
          const sum = response.data.reduce((accumulator: any, object: any) => {
            return accumulator + object.received_amount;
          }, 0);
          setReceivedAmount(sum);
          setLoanTransactions(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
    getLoanTransactionsOfUser();
  }, [data.client.id, data._id, props.mainLoader]);

  return (
    <Card sx={{ width: "auto", mt: 3 }}>
      <CardHeader
        title={`Name: ${user?.name}`}
        subheader={`Issued on: ${new Date(data.issued_date).toDateString()}`}
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary">
          Loan: {data.loan_number}{" "}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Amount:&nbsp;&#x20b9; {data.amount}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Repayment Type:&nbsp;Per {data.repayment_type}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Amount Paid: &#x20b9;  {receivedAmount}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Pending Amount: &#x20b9;  {data.amount - receivedAmount}
        </Typography>
      </CardContent>
      {/* <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={() => {
            props.setMemberName(user?.name);
            props.setOpenDialog(true);
          }}
        >
          <EditIcon />
        </IconButton>
        <Typography variant="body1" color="text.secondary">
          More Details:
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions> */}
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Transaction History:</Typography>

          {loanTransactions.length > 0 &&
            loanTransactions.map((loanTransaction: ITransaction) => {
              return (
                <ListItem key={loanTransaction._id}>
                  <ListItemText
                    primary={`Rs. ${loanTransaction.received_amount}`}
                    secondary={new Date(
                      loanTransaction.received_date
                    ).toDateString()}
                  />
                </ListItem>
              );
            })}

          {loanTransactions.length === 0 && (
            <Typography paragraph>No Transactions</Typography>
          )}
        </CardContent>
      </Collapse> */}
    </Card>
  );
}
