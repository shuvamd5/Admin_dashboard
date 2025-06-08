export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  birthDate?: string;
  joinedDate?: string;
  isSubscribed?: boolean;
  isActive?: boolean;
}

export interface CustomerRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  isActive: boolean;
  dateOfBirth: string;
  storeId: string;
}