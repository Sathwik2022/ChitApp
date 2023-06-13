import { APIService } from "../constants/api";
import CustomForm from "../components/common/customForm";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { IUser } from "../interface/definedTypes";
import TabComponent from "../components/common/tabsComponent";
import CommonAlert from "../components/common/commonAlert";
import { useNavigate } from "react-router-dom";

function AddCustomer() {
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
  }, []);
  const [mainLoader, setMainLoader] = useState(false);
  const [regions, setRegions] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    severity: "success",
    message: "",
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    // get all regions and populate it
    const getAllRegions = async () => {
      const regions = await axios.get(`${APIService.api}/region`, header);
      regions.data.forEach((x: any) => {
        x["type"] = "region";
      });
      setRegions(regions.data);
    };
    getAllRegions();
  }, [header]);

  const handleSubmit = (val: IUser) => {

    if( val["account_number"] === "" || val["witness_1"] === "" || val["contact_number_witness_1"] === "" || val["witness_2"] === "" || val["contact_number_witness_2"] === "") {
      setAlert({
        show: true,
        severity: "error",
        message: "Some Mandatory Fields are not Filled",
      });
      setTimeout(() => {
        setAlert({
          show: false,
          severity: "success",
          message: "",
        });
        navigate("/dashboard");
      }, 1000);
    }else {
      const dob = new Date(val["date_of_birth"]);
      const formattedDate = `${dob.getFullYear()}-${
        dob.getMonth() + 1
      }-${dob.getDate()}`;
      const body = {
        ...val,
        aadhar_number: val["aadhar_number"].toString(),
        date_of_birth: formattedDate,
        type: "customer",
        password: val["aadhar_number"].toString().toUpperCase(),
        photo: "",
      };
      postData(body);
    }

  };

  const postData = (payload: IUser) => {
    setMainLoader(true);
    axios
      .post(`${APIService.api}/user`, payload, header)
      .then((response: any) => {
        setMainLoader(false);
        setAlert({
          show: true,
          severity: "success",
          message: "Added a Customer Successfuly",
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
        console.log(error);
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
      });
  };

  let formProps = {
    formHeading: "Add Customer",
    formData: [
      {
        id: "account_number",
        type: "number",
        validation: (val: any) => {},
        label: "Account No.",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "name",
        type: "text",
        validation: (val: any) => {},
        label: "Name",
        required: true,
        value: "",
        options: [],
      },
      {
        id: "contact_number",
        type: "number",
        validation: (val: any) => {},
        label: "Mobile No.",
        required: true,
        value: "",
        options: [],
      },
      {
        id: "email",
        type: "email",
        validation: (val: any) => {},
        label: "Email ID",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "region",
        type: "select",
        validation: (val: any) => {},
        label: "Region",
        required: false,
        value: "",
        options: regions,
      },
      {
        id: "address",
        type: "text",
        validation: (val: any) => {},
        label: "Address",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "pan",
        type: "string",
        validation: (val: any) => {},
        label: "PAN Number",
        required: false,
        value: "",
        options: [],
      },

      {
        id: "aadhar_number",
        type: "number",
        validation: (val: any) => {},
        label: "Aadhar Number",
        required: false,
        value: "",
        options: [],
      },

      {
        id: "date_of_birth",
        type: "date",
        validation: (val: any) => {},
        label: "Date of Birth",
        required: false,
        value: "22/12/2000",
        options: [],
      },
      {
        id: "witness_1",
        type: "string",
        validation: (val: any) => {},
        label: "Witness 1",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "contact_number_witness_1",
        type: "number",
        validation: (val: any) => {},
        label: "PH. No. ( Witness 1 )",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "witness_2",
        type: "string",
        validation: (val: any) => {},
        label: "Witness 2",
        required: false,
        value: "",
        options: [],
      },
      {
        id: "contact_number_witness_2",
        type: "number",
        validation: (val: any) => {},
        label: "PH. No. ( Witness 2 )",
        required: false,
        value: "",
        options: [],
      },
    ],
    handleSubmitAction: handleSubmit,
    initialValues: {
      name: "",
      contact_number: "",
      email: "",
      region: "",
      address: "",
      pan: "",
      aadhar_number: "",
      date_of_birth: "",
      // photo: "",
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

export default AddCustomer;
