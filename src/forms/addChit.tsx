import CustomForm from "../components/common/customForm";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIService } from "../constants/api";
import { IChit } from "../interface/definedTypes";
import TabComponent from "../components/common/tabsComponent";
import CommonAlert from "../components/common/commonAlert";
import { useNavigate } from "react-router-dom";

function AddChit() {
  const [mainLoader, setMainLoader] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    severity: "success",
    message: "",
  });
  const [customerData, setCustomerData] = useState([]);
  const navigate=useNavigate();

  let header = {
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("token"),
    },
  };
  useEffect(() => {
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
    getCustomerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (val: IChit) => {
    postData(val);
  };

  const postData = (payload: IChit) => {
    setMainLoader(true);
    axios
      .post(`${APIService.api}/chit`, payload, header)
      .then((response: any) => {
        setMainLoader(false);
        setAlert({
          show: true,
          severity: "success",
          message: "Added a Chit Successfuly",
        });
        setTimeout(() => {
          setAlert({
            show: false,
            severity: "success",
            message: "",
          });
          navigate('/dashboard')
        }, 3000);
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
            severity: "success",
            message: "",
          });
        }, 3000);
        console.log(error);
      });
  };

  let formProps = {
    formHeading: "Add Chit",
    formData: [
      {
        id: "name",
        type: "string",
        validation: (val: any) => {},
        label: "Chit Name",
        required: true,
        value: "",
        options: [],
      },
      {
        id: "chit_number",
        type: "number",
        validation: (val: any) => {},
        label: "Chit Number",
        required: true,
        value: "",
        options: [],
      },
      {
        id: "clients",
        type: "multiselect",
        validation: (val: any) => {},
        label: "Clients",
        required: false,
        value: "",
        options: customerData,
      },
      {
        id: "amount",
        type: "number",
        validation: (val: any) => {},
        label: "Chit Amount",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "start_date",
        type: "date",
        validation: (val: any) => {},
        label: "Start Date",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "number_of_installments",
        type: "number",
        validation: (val: any) => {},
        label: "No of Installments",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "installment_amount",
        type: "number",
        validation: (val: any) => {},
        label: "Installment Amount ",
        required: false,
        value: "",
        options: [],
      },
    ],
    handleSubmitAction: handleSubmit,
    initialValues: {
      name: "",
      chit_number: "",
      clients: [],
      amount: "",
      start_date: "",
      number_of_installments: "",
      installment_amount: "",
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

export default AddChit;
