
export interface Admin {
  id: string;
  country: string;
  companyName: string;
  companyAddress: string;
  email: string;
  companyLogoId: {
    url: "string";
  };
  website: string;
  panNo: string;
  registrationDocumentId: {
    url: "string";
  };
  plan: {
    name: string;
  };
  paymentStatus: "pending" | "completed" | "failed";
  isActive: boolean;
  companyId: string;
}

export interface CompanyRepresentative {
    id: string;
    admin: string;
    name: string;
    contact: string;
    designation: string;
    email: string;
    proofDocumentId: string;
  }

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string;
}

export interface AdminFormData extends Omit<Admin, "id"> {}
export interface CompanyRepresentativeFormData
  extends Omit<CompanyRepresentative, "id"> {}
