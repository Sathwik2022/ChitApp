import React from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IconButton, Toolbar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "./logo1.png"

export default function TabComponent(props: any) {
  const navigate = useNavigate();
  const currentuser = JSON.parse(localStorage.getItem("chit_app_user") || "{}");
  

  return (
    <div>
      <Box sx={{ flexGrow: 1, pt: 0 }}>
        <AppBar position="static" >
          <Toolbar>
            {props.heading === "Reports" ||
            props.heading === "Users" ||
            props.heading === "Chits And Loans" ||
            currentuser.type === "customer" ? (
              <React.Fragment>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {props.heading}
                  <img src={logo} alt="Logo" />
                </Typography>
                {currentuser.type !== "customer" ? (
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ ml: 2 }}
                    onClick={props.toggleSidebar}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ ml: 2 }}
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                    }}
                  >
                    <LogoutIcon />
                  </IconButton>
                )}
              </React.Fragment>
            ) : (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => navigate(-1)}
              >
                <ArrowBack />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
