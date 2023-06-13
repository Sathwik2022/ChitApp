import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { ITransaction } from "../../interface/definedTypes";

export default function SimpleDialog(props: any) {
  const handleClose = () => {
    props.setOpenSimpleDialog(false);
  };

  return (
    <div>
      <Dialog open={props.openSimpleDialog} onClose={handleClose}>
        <DialogTitle id="responsive-dialog-title">
            {props.title}
        </DialogTitle>
        <DialogContent>
        {props.loanTransactions.length > 0 &&
            props.loanTransactions.map((loanTransaction: ITransaction) => {
              return (
                <ListItem key={loanTransaction._id}>
                  <ListItemText
                    primary={ loanTransaction.type === undefined ? `Rs. ${loanTransaction.received_amount}` : `Rs. ${loanTransaction.received_amount} - Withdrawn`}
                    secondary={ loanTransaction.received_by + ` - ` + new Date(
                      loanTransaction.received_date
                    ).toDateString()  
                  }
                  />
                </ListItem>
              );
            })}

          {props.loanTransactions.length === 0 && (
            <Typography paragraph>No Transactions</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
