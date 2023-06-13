import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { AgentTable } from "../../tables/agentTable";
import { CustomerTable } from "../../tables/customerTable";
import TabComponent from "../common/tabsComponent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

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

export function Users(props: { toggleSidebar: Function }) {
  const navigate = useNavigate();
  const custOrAgent: any = localStorage.getItem("cust_or_agent");
  const [value, setValue] = React.useState(custOrAgent === null ? 0 : 1);
  const currentuser = JSON.parse(localStorage.getItem("chit_app_user") || "{}");
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    newValue === 1 ? localStorage.setItem("cust_or_agent","1") : localStorage.removeItem("cust_or_agent");
    setValue(newValue);
  };

  const renderLayout = (label: string, type: string) => {
    return (
      <Grid container rowSpacing={2}>
        <Grid item xs={12} md={12}>
          <Button
            variant="outlined"
            onClick={() => {
              if (type === "customer") {
                navigate("/addCustomer");
              } else {
                navigate("/addAgent");
              }
            }}
          >
            {" "}
            {label}{" "}
          </Button>
        </Grid>
        <Grid item xs={12} md={12}>
          {type === "customer" && <CustomerTable />}
          {type === "agent" && <AgentTable />}
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      <TabComponent heading={"Users"} toggleSidebar={props.toggleSidebar} />
      {/* <Box sx={{ width: "100%" }}> */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="user tabs">
          <Tab label="Customers" {...a11yProps(0)} />
          {currentuser.type==='admin'?  <Tab label="Agents" {...a11yProps(1)} /> :<span></span> }
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {renderLayout("Add Customer +", "customer")}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {renderLayout("Add Collection Agent +", "agent")}
      </TabPanel>
      {/* </Box> */}
    </div>
  );
}
