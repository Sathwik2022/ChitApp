import { APIService } from "../constants/api";
import CustomForm from "../components/common/customForm";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { IUser } from "../interface/definedTypes";
import TabComponent from "../components/common/tabsComponent";
import CommonAlert from "../components/common/commonAlert";
import { useLocation, useNavigate } from "react-router-dom";

function EditCollectionAgent() {
  const location = useLocation();
  const agentData = location.state as any;
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
      regions.data.forEach((x: any) => {
        x["type"] = "region";
      });
      setRegions(regions.data);
    };
    getAllRegions();
  }, [header]);

  const handleSubmit = (val: IUser) => {
    val["type"] = "agent";
    val["password"] = val["pan"].toUpperCase();
    const dob = new Date(val["date_of_birth"]);
    const formattedDate =
      Number(dob.getMonth() + 1) +
      "/" +
      Number(dob.getDate()) +
      "/" +
      dob.getFullYear();
    val["date_of_birth"] = formattedDate;
    val["photo"] = "";
    val["aadhar_number"] = val["aadhar_number"].toString();
    postData({ ...val, id: agentData.id });
  };

  const postData = (payload: any) => {
    setMainLoader(true);
    axios
      .post(`${APIService.api}/user/update`, payload, header)
      .then((response: any) => {
        setAlert({
          show: true,
          severity: "success",
          message: "Added a Agent Successfuly",
        });
        setTimeout(() => {
          setAlert({
            show: false,
            severity: "success",
            message: "",
          });
          navigate("/dashboard");
        }, 3000);
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
    formHeading: "Edit Collection Agent",
    formData: [
      {
        id: "name",
        type: "text",
        validation: (val: any) => {},
        label: "Agent Name",
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
        value: agentData.region,
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

      {
        id: "joining_date",
        type: "date",
        validation: (val: any) => {},
        label: "Joining Date",
        required: false,
        value: "",
        options: [],
      },

      // {
      //   id: "photo",
      //   type: "image",
      //   validation: (val: any) => {},
      //   label: "Photo",
      //   required: false,
      //   value: "",
      //   options: [],
      // },
    ],
    handleSubmitAction: handleSubmit,
    // initialValues: {
    //   name: "",
    //   contact_number: "",
    //   email: "",
    //   region: "",
    //   address: "",
    //   pan: "",
    //   aadhar_number: "",
    //   date_of_birth: "",
    //   // photo: "",
    // },
    initialValues: {
      name: agentData.name,
      contact_number: agentData.contact_number,
      email: agentData.email,
      region: agentData.region,
      address: agentData.address,
      pan: agentData.pan,
      aadhar_number: agentData.aadhar_number,
      date_of_birth: agentData.date_of_birth.split("T")[0],
      joining_date: agentData.joining_date,
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

export default EditCollectionAgent;
