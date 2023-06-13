import Excel from "exceljs";
import FileSaver from "file-saver";

//Customer Excel

export async function writeToExcel (
    postData: any
    ) {
    const workbook = new Excel.Workbook();
    const worksheetCustomers = workbook.addWorksheet("Customers");

    const columnsForCustomers = [
        {key: "name", header: "Customer Name" },
        {key: "contact_number", header: "Phone Number"},
        {key: "aadhar_number", header: "Aadhar Number"},
        {key: "address", header: "Address"},
        {key: "region", header: "Region"}
    ];

    worksheetCustomers.columns = columnsForCustomers;

    postData.forEach((pd:any) => {
        worksheetCustomers.addRow({
            name: pd["name"],
            contact_number: pd["contact_number"],
            aadhar_number: pd["aadhar_number"],
            address: pd["address"],
            region: capitalizeFirstLetter(pd["region"]),
        });
    });

    const  buffer = await workbook.xlsx.writeBuffer();
    const fileType = 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([buffer], {type: fileType });
    FileSaver.saveAs(blob, "Customer.xlsx");
    // console.log("USER DATA - ", postData);
}

function capitalizeFirstLetter(str:string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//Agent Excel

export async function excelToWrite (
    postData: any
    ) {
    const workbook = new Excel.Workbook();
    const worksheetAgents = workbook.addWorksheet("Agents");

    const columnsForAgents = [
        {key: "name", header: "Agent" },
        {key: "contact_number", header: "Phone Number"},
        {key: "region", header: "Region"},
        {key: "joining_date", header: "Joining Date"}
    ];

    worksheetAgents.columns = columnsForAgents;

    postData.forEach((pd:any) => {
        worksheetAgents.addRow({
            name: pd["name"],
            contact_number: pd["contact_number"],
            aadhar_number: pd["region"],
            address: pd["joining_date"],
            region: capitalizeFirstLetter(pd["region"]),
        });
    });

    const  buffer = await workbook.xlsx.writeBuffer();
    const fileType = 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([buffer], {type: fileType });
    FileSaver.saveAs(blob, "Agent.xlsx");
    // console.log("USER DATA - ", postData);
}

//Chit Excel

export async function excel (
    postData: any
    ) {
    const workbook = new Excel.Workbook();
    const worksheetChits = workbook.addWorksheet("Chits");

    const columnsForChits = [
        {key: "name", header: "Chit Name" },
        {key: "start", header: "Start Date"},
        {key: "amount", header: "Chit Amount"},
        {key: "installment", header: "Installments"},
        {key: "installment_amount", header: "Installment Amount"},
        {key: "participants", header: "Participants"}
    ];

    worksheetChits.columns = columnsForChits;

    postData.forEach((pd:any) => {
        worksheetChits.addRow({
            name: pd["name"],
            start: pd["start"],
            amount: pd["amount"],
            installment: pd["installment"],
            installment_amount: pd["installment_amount"],
            participants: pd["participants"],
        });
    });

    const  buffer = await workbook.xlsx.writeBuffer();
    const fileType = 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([buffer], {type: fileType });
    FileSaver.saveAs(blob, "Chit.xlsx");
    // console.log("USER DATA - ", postData);
}

//Customer Report Excel

export async function excelWrite (
    postData: any
    ) {
    const workbook = new Excel.Workbook();
    const worksheetCustomerReport = workbook.addWorksheet("Customer Report");

    const columnsForCustomerReport = [
        {key: "name", header: "Customer" },
        {key: "loan_chit", header: "Loan or Chit"},
        {key: "start_date", header: "Start Date"},
        {key: "amount", header: "Chit Amount"},
        {key: "payable", header: "Payable"},
        {key: "paid", header: "Paid"},
        {key: "pending", header: "Pending"}
    ];

    worksheetCustomerReport.columns = columnsForCustomerReport;

    postData.forEach((pd:any) => {
        worksheetCustomerReport.addRow({
            name: pd["name"],
            loan_chit: pd["loan_chit"],
            start_date: pd["start_date"],
            amount: pd["amount"],
            payable: pd["payable"],
            paid: pd["paid"],
            pending: pd["pending"],
        });
    });

    const  buffer = await workbook.xlsx.writeBuffer();
    const fileType = 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([buffer], {type: fileType });
    FileSaver.saveAs(blob, "Customer Report.xlsx");
    // console.log("USER DATA - ", postData);
}

//Loan Excel

export async function writeExcel (
    postData: any
    ) {
    const workbook = new Excel.Workbook();
    const worksheetLoan = workbook.addWorksheet("Loan");

    const columnsForLoan = [
        {key: "repayment_type", header: "Type" },
        {key: "receiver", header: "Receiver"},
        {key: "start", header: "Start Date"},
        {key: "amount", header: "Chit Amount"},
        {key: "payable", header: "Amount Payable"},
        {key: "paid", header: "Paid"},
        {key: "pending", header: "Pending"}
    ];

    worksheetLoan.columns = columnsForLoan;

    postData.forEach((pd:any) => {
        worksheetLoan.addRow({
            repayment_type: pd["repayment_type"],
            receiver: pd["receiver"],
            start: pd["start"],
            amount: pd["amount"],
            payable: pd["payable"],
            paid: pd["paid"],
            pending: pd["pending"],
        });
    });

    const  buffer = await workbook.xlsx.writeBuffer();
    const fileType = 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([buffer], {type: fileType });
    FileSaver.saveAs(blob, "Loan.xlsx");
    // console.log("USER DATA - ", postData);
}

//Settlement Excel

export async function writetoExcel (
    postData: any
    ) {
    const workbook = new Excel.Workbook();
    const worksheetSettlement = workbook.addWorksheet("Settlement");

    const columnsForSettlement = [
        {key: "date", header: "Date" },
        {key: "name", header: "Agent"},
        {key: "region", header: "region"},
        {key: "chit_amount", header: "Chit Amount Collected"},
        {key: "loan_amount", header: "Loan Amount Collected"},
    ];

    worksheetSettlement.columns = columnsForSettlement;

    postData.forEach((pd:any) => {
        worksheetSettlement.addRow({
            date: pd["date"],
            name: pd["name"],
            region: capitalizeFirstLetter(pd["region"]),
            chit_amount: pd["chit_amount"],
            loan_amount: pd["loan_amount"],
        });
    });

    const  buffer = await workbook.xlsx.writeBuffer();
    const fileType = 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([buffer], {type: fileType });
    FileSaver.saveAs(blob, "Settlement.xlsx");
    // console.log("USER DATA - ", postData);
}
