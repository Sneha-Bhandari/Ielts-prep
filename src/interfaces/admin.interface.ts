// // src/interfaces/admin.interface.ts - Updated to match API response
// export interface CompanyDocument {
//     documentUrl: string;
//     documentName: string;
//     documentType: string;
//   }

//   export interface PersonDocument {
//     documentUrl: string;
//     documentName: string;
//     documentType: string;
//   }

//   export interface Person {
//     id?: string;
//     name: string;
//     email: string;
//     contact: string;
//     designation: string;
//     proofDocument?: string | null;
//     proofDocumentKey?: string | null;
//     adminId?: string;
//   }

//   export interface Plan {
//     id: string;
//     planType: "basic" | "standard" | "premium";
//     startDate: string;
//     endDate: string;
//     amount: number;
//     features: string[];
//   }

//   export interface Payment {
//     id: string;
//     amount: number;
//     currency: string;
//     status: "paid" | "pending" | "failed";
//     transactionId: string;
//     paymentDate: string;
//     paymentMethod: string;
//   }

//   // Main Company Interface (matches API response)
//   export interface Company {
//     country: string;
//     companyName: string;
//     companyAddress: string;
//     email: string;
//     companyLogo: string | null;
//     companyLogoKey: string | null;
//     website: string | null;
//     panNo: string;
//     registrationDocument: string | null;
//     registrationDocumentKey: string | null;
//     plan: string;
//     paymentStatus: "pending" | "completed" | "failed";
//     isActive: boolean;
//   }

//   // Admin Interface (matches API admin object)
//   export interface Admin {
//     admin: string;
//     name: string;
//     contact: string;
//     designation: string;
//     email: string;
//     proofDocument: string | null;
//     proofDocumentKey: string | null;
//   }

//   // Complete Admin for store (combines company + admin + person)
//   export interface CompleteAdmin {
//     id: string;
//     // Company fields
//     country: string;
//     companyName: string;
//     companyAddress: string;
//     email: string;
//     companyLogo: string | null;
//     companyLogoKey: string | null;
//     website: string | null;
//     panNo: string;
//     registrationDocument: string | null;
//     registrationDocumentKey: string | null;
//     plan: string;
//     paymentStatus: "pending" | "completed" | "failed";
//     isActive: boolean;
//     // Admin fields
//     admin: string;
//     name: string;
//     contact: string;
//     designation: string;
//     proofDocument: string | null;
//     proofDocumentKey: string | null;
//     // Person (optional)
//     person?: Person | null;
//   }

// src/interfaces/admin.interface.ts

// src/interfaces/admin.interface.ts
 
export interface Admin {
  id: string;
  country: string;
  companyName: string;
  companyAddress: string;
  email: string;
  companyLogo: {
    url: "string";
  };
  website: string;
  panNo: string;
  registrationDocument: {
    url: "string";
  };
  plan: {
    name: string;
  };
  paymentStatus: "pending" | "completed" | "failed";
  isActive: boolean;
}

export interface CompanyRepresentative {
    id: string;
    admin: {
      id: string;
    };
    name: string;
    contact: string;
    designation: string;
    email: string;
    proofDocumentId: {
      id: string;
      url: string;
    } | null;
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
