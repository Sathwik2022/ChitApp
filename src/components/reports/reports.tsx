import { Tab, Tabs, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useReducer, useState } from "react";
import TabComponent from "../common/tabsComponent";
import Grid from "@mui/material/Grid";
import AgentReport from "./agentReport";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import {
  FilterActions,
  filtersReducer,
  IFilterState,
} from "../../reducers/filtersReducer";
import LoanGrid from "../datagrids/loanGrid";
import ChitGrid from "../datagrids/chitGrid";
import CustomerReportGrid from "../datagrids/customerReportGrid";
import SettlementGrid from "../datagrids/settlementGrid";

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

export function Reports(props: { toggleSidebar: Function }) {
  //   const navigate = useNavigate();
  const reportType: any = localStorage.getItem("report_type");
  const [value, setValue] = useState(reportType === null ? 0 : Number(reportType));
  const [stateObject, setStateObject] = useState({});

  const initState: IFilterState = {
    filterDate: "month",
    fromDate: null,
    toDate: null,
    singleDay: null,
  };
  const [state, dispatch] = useReducer(filtersReducer, initState);

  useEffect(() => {
    if (state.filterDate !== "custom" && state.filterDate !== "day") {
      setStateObject({ ...state });
    }
  }, [state]);

  const handleChangeFilter = (event: SelectChangeEvent<string>) => {
    const changedValue = event.target.value;
    switch (changedValue) {
      case "today":
        dispatch({
          type: FilterActions.TODAY,
          payload: { selectOption: changedValue, fdate: null, tdate: null },
        });
        break;
      case "yesterday":
        dispatch({
          type: FilterActions.YESTERDAY,
          payload: { selectOption: changedValue, fdate: null, tdate: null },
        });
        break;
      case "day":
        dispatch({
          type: FilterActions.DAY,
          payload: {
            selectOption: changedValue,
            fdate: state.fromDate,
            tdate: null,
          },
        });
        break;
      case "month":
        dispatch({
          type: FilterActions.THIS_MONTH,
          payload: { selectOption: changedValue, fdate: null, tdate: null },
        });
        break;
      case "last-month":
        dispatch({
          type: FilterActions.LAST_MONTH,
          payload: { selectOption: changedValue, fdate: null, tdate: null },
        });
        break;
      case "custom":
        dispatch({
          type: FilterActions.CUSTOM,
          payload: {
            selectOption: changedValue,
            fdate: state.fromDate,
            tdate: state.toDate,
          },
        });
        break;
      default:
        break;
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    newValue > 0 ? localStorage.setItem("report_type",""+newValue) : localStorage.removeItem("report_type");
    setValue(newValue);
    dispatch({
      type: FilterActions.RESET,
      payload: {},
    });
  };

  const renderLayout = (label: string, type: string) => {
    return (
      <Grid container rowSpacing={2}>
        <Grid item xs={5} md={5}>
          <Typography>
            <b> {label} </b>
          </Typography>
        </Grid>
        <Grid item xs={6} md={6}>
          <FormControl fullWidth>
            <InputLabel id="filter-date-label">Filter</InputLabel>
            <Select
              labelId="filter-date-label"
              id="filter-date"
              value={state.filterDate}
              label="Filter"
              onChange={handleChangeFilter}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="last-month">Last Month</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {state.filterDate === "custom" && (
          <Grid sx={{ mt: 2 }} container spacing={1}>
            <Grid item xs={5} md={5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  minDate={new Date("10-1-2022")}
                  maxDate={new Date()}
                  inputFormat="dd-MM-yyyy"
                  label="From"
                  value={state.fromDate}
                  onChange={(newValue: any) => {
                    dispatch({
                      type: FilterActions.FROM_DATE,
                      payload: {
                        selectOption: state.filterDate,
                        fdate: newValue,
                        tdate: null,
                      },
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={5} md={5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  minDate={state.fromDate}
                  disabled={state.fromDate === null}
                  maxDate={new Date()}
                  inputFormat="dd-MM-yyyy"
                  label="To"
                  value={state.toDate}
                  onChange={(newValue: any) => {
                    // setToDate(newValue);
                    dispatch({
                      type: FilterActions.TO_DATE,
                      payload: {
                        selectOption: state.filterDate,
                        fdate: state.fromDate,
                        tdate: newValue,
                      },
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={2} md={2}>
              <IconButton
                sx={{ marginTop: "3px" }}
                aria-label="send"
                size="large"
                color="primary"
                onClick={() => {
                  // range of dates
                  setStateObject({ ...state });
                }}
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
        {state.filterDate === "day" && (
          <Grid sx={{ mt: 2 }} container spacing={2}>
            <Grid item xs={5} md={5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  minDate={new Date("10-1-2022")}
                  maxDate={new Date()}
                  inputFormat="dd-MM-yyyy"
                  label="Day"
                  value={state.singleDay}
                  onChange={(newValue: any) => {
                    dispatch({
                      type: FilterActions.SINGLE_DAY,
                      payload: {
                        selectOption: state.filterDate,
                        fdate: newValue,
                        tdate: null,
                      },
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4} md={4}>
              <IconButton
                sx={{ marginTop: "3px" }}
                aria-label="send"
                size="large"
                color="primary"
                onClick={() => {
                  // particular day

                  setStateObject({ ...state });
                }}
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} md={12}>
          {type === "agent" && <AgentReport stateObject={stateObject} />}
          {/* {type === "region" && <AgentTable />} */}
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      <TabComponent heading={"Reports"} toggleSidebar={props.toggleSidebar} />
      {/* <Box sx={{ width: "100%" }}> */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="user tabs">
          <Tab label="Agents" {...a11yProps(0)} />
          <Tab label="Settlement" {...a11yProps(1)} />
          <Tab label="Loan" {...a11yProps(2)} />
          <Tab label="Chit" {...a11yProps(3)} />
          <Tab label="Customer" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {renderLayout("Agent Wise Collection", "agent")}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SettlementGrid />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <LoanGrid />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ChitGrid />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <CustomerReportGrid />
      </TabPanel>
      {/* </Box> */}
    </div>
  );
}
