export interface IFSCDetails {
  IFSC: string;
  BANK: string;
  BRANCH: string;
  ADDRESS: string;
  CITY: string;
  DISTRICT: string;
  STATE: string;
  CONTACT?: string;
  IMPS?: boolean;
  RTGS?: boolean;
  NEFT?: boolean;
  UPI?: boolean;
}

export interface IFSCDocument extends IFSCDetails {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExternalAPIResponse {
  success: boolean;
  data?: IFSCDetails;
  error?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}