import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit"; // import axios from "axios";
import axios from "axios";
import { APIService } from "../../constants/api";
import { ListItem, ListItemText } from "@mui/material";
import { ITransaction } from "../../interface/definedTypes";
// import { APIService } from "../constants/api";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function CommonCard(props: any) {
  const [Transactions, setTransactions] = React.useState<ITransaction[]>([]);
  const [receivedAmount, setReceivedAmount] = React.useState<number>(0);

  const currentuser = JSON.parse(localStorage.getItem("chit_app_user") || "{}");
  React.useEffect(() => {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    async function getTransactionsOfUser() {
      try {
        const response = await axios.get(
          `${APIService.api}/transactions/${props.id}/${props.cust_id}`,
          header
        );
        if (response.status === 200) {
          const sum = response.data.reduce((accumulator: any, object: any) => {
            return accumulator + object.received_amount;
          }, 0);
          setReceivedAmount(sum);
          setTransactions(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTransactionsOfUser();
  }, [props.id, props.cust_id, props.mainLoader]);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
      <Card sx={{ maxWidth: 345, pb: 2 }}>
        <CardHeader
          title={props.memberName}
          subheader={`Date: ${props.date.split("T")[0]}`}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Number: {props.number}
          </Typography>
          {props.name ? (
            <Typography variant="body2" color="text.secondary">
              Name: {props.name}
            </Typography>
          ) : (
            <span></span>
          )}
          <Typography variant="body2" color="text.secondary">
            Amount: &#x20b9;  {props.amount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No. of Installments: {props.number_of_installments}
          </Typography>
          {props.repayment_type ? (
            <Typography variant="body2" color="text.secondary">
              Repayment Type: {props.repayment_type}
            </Typography>
          ) : (
            <React.Fragment></React.Fragment>
          )}

          {props.rate_of_interest ? (
            <Typography variant="body2" color="text.secondary">
              Rate of Interest: {props.rate_of_interest}
            </Typography>
          ) : (
            <React.Fragment></React.Fragment>
          )}
          <Typography variant="body2" color="text.secondary">
            Amount Paid: &#x20b9;  {receivedAmount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending Amount: &#x20b9;  {props.amount - receivedAmount}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {currentuser.type !== "customer" ? (
            <IconButton
              aria-label="add to favorites"
              onClick={() => {
                props.setTransactionNumber(props.id);
                props.setMemberName(props.memberName);
                props.setOpenDialog(true);
              }}
            >
              <EditIcon />
            </IconButton>
          ) : (
            <span></span>
          )}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Transaction History:</Typography>
            {Transactions.length > 0 &&
              Transactions.map((loanTransaction: ITransaction) => {
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
            {Transactions.length === 0 && (
              <Typography paragraph>No Transactions</Typography>
            )}
          </CardContent>
        </Collapse>
      </Card>
  );
}
