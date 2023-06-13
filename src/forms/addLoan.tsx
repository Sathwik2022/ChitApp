import CustomForm from "../components/common/customForm";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIService } from "../constants/api";
import { ILoan, IUser } from "../interface/definedTypes";
import TabComponent from "../components/common/tabsComponent";
import CommonAlert from "../components/common/commonAlert";
import { useNavigate } from "react-router-dom";

function AddLoan() {
  const [mainLoader, setMainLoader] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [agents, setAgents] = useState([]);
  const [regions, setRegions] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    severity: "success",
    message: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (val: any) => {
    customerData.forEach((customer: IUser) => {
      if (customer._id === val.client_id) {
        val["client"] = { id: customer._id, name: customer.name };
      }
    });
    agents.forEach((agent: any) => {
      if (agent.id === val.agent_id) {
        val["agent"] = { id: agent.id, name: agent.name };
      }
    });
    delete val["client_id"];
    delete val["agent_id"];
    const dob = new Date(val["issued_date"]);
    const formattedDate = `${dob.getFullYear()}-${
      dob.getMonth() + 1
    }-${dob.getDate()}`;
    const body = {
      ...val,
      issued_date: formattedDate,
    };
    delete body.client_name;
    if (body.repayment_type === "") {
      setAlert({
        show: true,
        severity: "info",
        message: "Please select repayment type!",
      });
      setTimeout(() => {
        setAlert({
          show: false,
          severity: "info",
          message: "",
        });
      }, 2000);
    }
    postData(body);
  };

  const postData = (payload: ILoan) => {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    setMainLoader(true);
    axios
      .post(`${APIService.api}/loan`, payload, header)
      .then((response: any) => {
        setMainLoader(false);
        setAlert({
          show: true,
          severity: "success",
          message: "Added a Loan Successfuly",
        });
        setTimeout(() => {
          setAlert({
            show: false,
            severity: "success",
            message: "",
          });
          navigate("/dashboard");
        }, 1000);
      })
      .catch((error: any) => {
        setMainLoader(false);
        let errorMsg = "";
        const detailsError = error.response.data.msg;
        if(detailsError.code !== undefined){
          let temp: any = Object.keys(detailsError.keyValue).toString();
          errorMsg = temp.replace("_", " ") + " already exists "
        } else if(detailsError.message !== undefined){
          errorMsg = detailsError.message
        }else {
          errorMsg = "Internal Server Error - Contact Admin"
        }
        setAlert({
          show: true,
          severity: "error",
          message: errorMsg,
        });
        setTimeout(() => {
          setAlert({
            show: false,
            severity: "error",
            message: "",
          });
        }, 1000);
      });
  };

  useEffect(() => {
    let header = {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    async function getCustomerDetails() {
      axios
        .get(`${APIService.api}/users/customer`, header)
        .then((response: any) => {
          setCustomerData(response.data);
          // setMainLoader(false)
        })
        .catch((error: any) => {
          // setMainLoader(false);
          console.log(error);
        });
    }
    const getAllRegions = async () => {
      const regions = await axios.get(`${APIService.api}/region`, header);
      regions.data.forEach((x: any) => {
        x["type"] = "region";
      });
      setRegions(regions.data);
    };
    async function getAllAgents() {
      axios
        .get(`${APIService.api}/users/agent`, header)
        .then((response: any) => {
          const res: any = [];
          response.data.forEach((ele: any) => {
            res.push({
              name: ele.name,
              contact_number: ele.contact_number,
              aadhar_number: ele.aadhar_number,
              pan: ele.pan,
              address: ele.address,
              region: ele.region,
              joining_date: ele.joining_date,
              date_of_birth: ele.date_of_birth,
              email: ele.email,
              id: ele._id,
              type: "agent",
              disabled: ele.disabled ? ele.disabled : false,
              onClick: () => {},
            });
          });
          setAgents(res);
        })
        .catch((error: any) => {
          // setMainLoader(false);
          console.log(error);
        });
    }
    getAllAgents();
    getAllRegions();
    getCustomerDetails();
  }, []);

  let formProps = {
    formHeading: "Add Loan",
    formData: [
      {
        id: "loan_number",
        type: "string",
        validation: (val: any) => {},
        label: "Loan Number",
        required: true,
        value: "",
        options: [],
      },
      {
        id: "amount",
        type: "number",
        validation: (val: any) => {},
        label: "Loan Amount",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "payable",
        type: "number",
        validation: (val: any) => {},
        label: "Payable Amount",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "issued_date",
        type: "date",
        validation: (val: any) => {},
        label: "Issued Date",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "repayment_type",
        type: "repay",
        validation: (val: any) => {},
        label: "Repayment Cycle",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "client_id",
        type: "select",
        validation: (val: any) => {},
        label: "Client Name",
        required: false,
        value: "",
        options: customerData,
      },
      {
        id: "region",
        type: "select-region",
        validation: (val: any) => {},
        label: "Region",
        required: false,
        value: "",
        options: regions,
      },
      {
        id: "agent_id",
        type: "select-agent",
        validation: (val: any) => {},
        label: "Agent",
        required: false,
        value: "",
        options: agents,
      },
    ],
    handleSubmitAction: handleSubmit,
    initialValues: {
      loan_number: "",
      amount: "",
      payable: "",
      issued_date: "",
      repayment_type: "",
      region: "",
      client_id: "",
      agent_id: "",
    },
    loader: mainLoader,
  };

  return (
    <React.Fragment>
      <TabComponent />
      <CustomForm {...formProps} />
      <CommonAlert alert={alert} />
    </React.Fragment>
  );
}

export default AddLoan;
