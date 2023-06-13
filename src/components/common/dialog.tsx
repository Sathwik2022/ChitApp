import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CustomForm from "./customForm";

export default function CommonDialog(props: any) {
  const handleClose = () => {
    props.setOpenDialog(false);
  };

  return (
    <div>
      <Dialog open={props.openDialog} onClose={handleClose}>
        <DialogTitle id="responsive-dialog-title">
          {props.formProps.formHeading.includes("Member")
            ? "Members update"
            : props.customTitle === undefined ? "Collect Payment" : props.customTitle}
        </DialogTitle>
        <DialogContent>
          <CustomForm {...props.formProps} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
