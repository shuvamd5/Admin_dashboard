export interface RegisterPayload {
  storeName: string;
  domainName: string;
  userName: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  isStaff: boolean;
  isCustomer: boolean;
  dateJoined: string;
}

export interface CustomerRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  dateOfBirth: string;
  isActive: boolean;
  storeId: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  responseCode: string;
  responseMessage: string;
  token: string;
  storeId?: string;
}

export interface CustomerRegisterResponse {
  responseCode: string;
  responseMessage: string;
  customerId: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ApiResponse {
  responseCode: string;
  responseMessage: string;
}

export interface Store {
  storeId: string;
  storeName: string;
}