export interface IChit {
  _id: string | undefined;
  name: string;
  chit_number: string;
  clients: string[];
  amount: number;
  start_date: Date;
  number_of_installments: number;
  installment_amount: number;
}

export interface ILoan {
  _id: string | undefined;
  loan_number: string;
  amount: number;
  payable: number;
  issued_date: Date | string;
  repayment_type: string;
  region: string;
  number_of_installments: number;
  client: { name: string; id: string };
  agent: { name: string; id: string };
}

export interface IUser {
  _id: string | undefined;
  email: string;
  password: string;
  name: string;
  type: string;
  contact_number: number;
  region: string;
  address: string;
  pan: string;
  aadhar_number: string;
  date_of_birth: Date | string;
  photo: string;
  joining_date: Date | string | undefined;
  disabled: boolean | undefined;
  account_number: number | string | undefined;
  witness_1: string | undefined;
  contact_number_witness_1: number | string | undefined;
  witness_2: string | undefined;
  contact_number_witness_2: number | string | undefined;
}

export interface ITransaction {
  _id: string | undefined;
  transaction_number: string;
  client_id: string;
  created: Date;
  received_amount: number;
  received_date: Date;
  received_by: string;
  agent_id: string;
  type: string;
}

export interface ITransactionHistory {
  _id: string | undefined;
  type: string;
  name: string;
  transaction_number: string;
}
