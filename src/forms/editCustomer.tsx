import { APIService } from "../constants/api";
import CustomForm from "../components/common/customForm";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { IUser } from "../interface/definedTypes";
import TabComponent from "../components/common/tabsComponent";
import CommonAlert from "../components/common/commonAlert";
import { useLocation, useNavigate } from "react-router-dom";

function EditCustomer() {
  const location = useLocation();
  const customerData = location.state as any;
  const [mainLoader, setMainLoader] = useState(false);
  const [regions, setRegions] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    severity: "success",
    message: "",
  });
  const navigate = useNavigate();

  const header = useMemo(() => {
    return {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
  }, []);

  React.useEffect(() => {
    // get all regions and populate it
    const getAllRegions = async () => {
      const regions = await axios.get(`${APIService.api}/region`, header);
      setRegions(regions.data);
      regions.data.forEach((x: any) => {
        x["type"] = "region";
      });
    };
    getAllRegions();
  }, [header]);

  const handleSubmit = (val: IUser) => {
    const dob = new Date(val["date_of_birth"]);
    const formattedDate = `${dob.getFullYear()}-${
      dob.getMonth() + 1
    }-${dob.getDate()}`;
    const body = {
      ...val,
      aadhar_number: val["aadhar_number"].toString(),
      date_of_birth: formattedDate,
      type: "customer",
      password: val["pan"].toUpperCase(),
      photo: "",
    };
    postData({ ...body, id: customerData.id });
  };

  const postData = (payload: any) => {
    setMainLoader(true);
    axios
      .post(`${APIService.api}/user/update`, payload, header)
      .then((response: any) => {
        setAlert({
          show: true,
          severity: "success",
          message: "Edited Customer Successfuly",
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
      })
      .finally(() => {
        setMainLoader(false);
      });
  };

  let formProps = {
    formHeading: "Edit Customer",
    formData: [
      {
        id: "name",
        type: "text",
        validation: (val: any) => {},
        label: "Client Name",
        required: true,
        value: "",
        options: [],
      },
      {
        id: "contact_number",
        type: "number",
        validation: (val: any) => {},
        label: "Contact Number",
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
        value: customerData.region,
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
        value: "",
        options: [],
      },
    ],
    handleSubmitAction: handleSubmit,
    initialValues: {
      name: customerData.name,
      contact_number: customerData.contact_number,
      email: customerData.email,
      region: customerData.region,
      address: customerData.address,
      pan: customerData.pan,
      aadhar_number: customerData.aadhar_number,
      date_of_birth: customerData.date_of_birth.split("T")[0],
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

export default EditCustomer;
