import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import TabComponent from "../common/tabsComponent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { ChitTable } from "../../tables/chitTable";
import { LoanTable } from "../../tables/loanTable";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function ChitsAndLoans(props: { toggleSidebar: Function }) {
  const navigate = useNavigate();
  const chitOrLoan: any = localStorage.getItem("chit_or_loan");
  const [value, setValue] = React.useState(chitOrLoan === null ? 0 : 1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    newValue === 1 ? localStorage.setItem("chit_or_loan","1") : localStorage.removeItem("chit_or_loan");
    setValue(newValue);
  };

  const renderLayout = (label: string, type: string) => {

    return (
      <Grid container rowSpacing={2}>
        <Grid item xs={12} md={12}>
          <Button
            variant="outlined"
            onClick={() => {
              if (type === "chit") {
                navigate("/addChit");
              } else {
                navigate("/addLoan");
              }
            }}
          >
            {" "}
            {label}{" "}
          </Button>
        </Grid>
        <Grid item xs={12} md={12}>
          {type === "chit" && <ChitTable />}
          {type === "loan" && <LoanTable />}
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      <TabComponent
        heading={"Chits And Loans"}
        toggleSidebar={props.toggleSidebar}
      />
      {/* <Box sx={{ width: "100%" }}> */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="user tabs">
          <Tab label="Chits" {...a11yProps(0)} />
          <Tab label="Loans" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {renderLayout("Add Chit +", "chit")}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {renderLayout("Add Loan +", "loan")}
      </TabPanel>
      {/* </Box> */}
    </div>
  );
}
