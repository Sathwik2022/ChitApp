import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import AddCardIcon from "@mui/icons-material/AddCard";
import { Divider, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Users } from "../components/users/users";
import { ChitsAndLoans } from "../components/chits_loans/chits_loans";
import { Reports } from "../components/reports/reports";


export default function Dashboard() {
  const w = Number(window.localStorage.getItem("tab"));
  const [value, setValue] = React.useState(w ? w :0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [users, setUsers] = React.useState(false);
  const [chitsOrLoans, setChitsOrLoans] = React.useState(false);
  const [reports, setReports] = React.useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const currentuser = JSON.parse(localStorage.getItem("chit_app_user") || "{}");
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
    

    const genRandomKey = async () => {
      switch (value) {
        case 0:
          localStorage.removeItem("chit_or_loan");
          localStorage.removeItem("report_type");
          setChitsOrLoans(false);
          setReports(false);
          setUsers(true);
          return;
        case 1:
          localStorage.removeItem("chit_or_loan");
          localStorage.removeItem("cust_or_agent");
          setChitsOrLoans(false);
          setReports(true);
          setUsers(false);
          return;
        case 2:
          localStorage.removeItem("cust_or_agent");
          localStorage.removeItem("report_type");
          setChitsOrLoans(true);
          setReports(false);
          setUsers(false);
          return;
        default:
          setUsers(true);
          return;
      }
    };
    genRandomKey();
  }, [value]);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <div>
      <CssBaseline />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>
          <Typography variant="h6" gutterBottom component={"div"}>
            {currentuser.name}
          </Typography>
        </MenuItem>
        <MenuItem>
        <MenuItem />
        <MenuItem>
        </MenuItem>
          <Typography variant="subtitle1" gutterBottom component={"div"}>
            Change Region
          </Typography>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="subtitle1" gutterBottom component={"div"}>
            {currentuser.type} from {currentuser.region}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            window.localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
      <List>
        {reports ? <Reports toggleSidebar={handleClick} /> : <span></span>}
        {users ? <Users toggleSidebar={handleClick} /> : <span></span>}
        {chitsOrLoans ? (
          <ChitsAndLoans toggleSidebar={handleClick} />
        ) : (
          <span></span>
        )}
      </List>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        {(() => {
          switch (currentuser.type) {
            case "admin":
              return (
                <BottomNavigation
                  showLabels
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                    window.localStorage.setItem("tab",`${newValue}`);
                  }}
                >
                  <BottomNavigationAction
                    label="Users"
                    icon={<SupervisedUserCircleIcon />}
                  />
                  <BottomNavigationAction
                    label="Reports"
                    icon={<AddCardIcon />}
                  />
                  <BottomNavigationAction
                    label="Chits/Loans"
                    icon={<AccountBalanceIcon />}
                  />
                </BottomNavigation>
              );
            case "agent":
              return (
                <BottomNavigation
                  showLabels
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                    window.localStorage.setItem("tab",`${newValue}`);
                  }}
                >
                  <BottomNavigationAction
                    label="Users"
                    icon={<SupervisedUserCircleIcon />}
                  />
                  <BottomNavigationAction
                    style={{ display: "none" }}
                    label="Reports"
                    icon={<AddCardIcon />}
                  />
                  <BottomNavigationAction
                    label="Chits/Loans"
                    icon={<AccountBalanceIcon />}
                  />
                </BottomNavigation>
              );
            case "customer":
              navigate(`/customer/${currentuser._id}`);
              return;
            default:
              return null;
          }
        })()}
      </Paper>
      </div>
    </Box>
  );
}
