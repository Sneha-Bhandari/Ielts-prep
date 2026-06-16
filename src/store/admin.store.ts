// // store/admin.store.ts
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import type { CompleteAdmin, Person, Plan, Payment } from "../interfaces/admin.interface";

// interface AdminStore {
//   admins: CompleteAdmin[];
//   addAdmin: (admin: CompleteAdmin) => void;
//   updateAdmin: (id: string, admin: CompleteAdmin) => void;
//   deleteAdmin: (id: string) => void;
//   addPerson: (adminId: string, person: Person) => void;
//   updatePerson: (adminId: string, person: Person) => void;
//   deletePerson: (adminId: string) => void;
//   updatePlan: (adminId: string, plan: string) => void;
//   updatePayment: (adminId: string, paymentStatus: CompleteAdmin["paymentStatus"]) => void;
//   updateStatus: (adminId: string, isActive: boolean) => void;
//   getAdminByEmail: (email: string) => CompleteAdmin | undefined;
// }

// export const useAdminStore = create<AdminStore>()(
//   persist(
//     (set, get) => ({
//       admins: [],

//       addAdmin: (admin) =>
//         set((state) => ({ admins: [...state.admins, admin] })),

//       updateAdmin: (id, updatedAdmin) =>
//         set((state) => ({
//           admins: state.admins.map((a) => (a.id === id ? updatedAdmin : a)),
//         })),

//       deleteAdmin: (id) =>
//         set((state) => ({
//           admins: state.admins.filter((a) => a.id !== id),
//         })),

//       addPerson: (adminId, person) =>
//         set((state) => {
//           const adminExists = state.admins.some((a) => a.id === adminId);
          
//           if (!adminExists) {
//             console.error("Cannot add person: Admin does not exist");
//             return state;
//           }
          
//           const admin = state.admins.find((a) => a.id === adminId);
//           if (admin?.person) {
//             console.error("Cannot add person: Admin already has a person");
//             return state;
//           }
          
//           return {
//             admins: state.admins.map((a) =>
//               a.id === adminId ? { ...a, person: { ...person, adminId } } : a
//             ),
//           };
//         }),

//       updatePerson: (adminId, updatedPerson) =>
//         set((state) => {
//           const admin = state.admins.find((a) => a.id === adminId);
          
//           if (!admin) {
//             console.error("Cannot update person: Admin does not exist");
//             return state;
//           }
          
//           if (!admin.person) {
//             console.error("Cannot update person: No person exists for this admin");
//             return state;
//           }
          
//           return {
//             admins: state.admins.map((a) =>
//               a.id === adminId ? { ...a, person: { ...updatedPerson, adminId } } : a
//             ),
//           };
//         }),

//       deletePerson: (adminId) =>
//         set((state) => {
//           const adminExists = state.admins.some((a) => a.id === adminId);
          
//           if (!adminExists) {
//             console.error("Cannot delete person: Admin does not exist");
//             return state;
//           }
          
//           return {
//             admins: state.admins.map((a) =>
//               a.id === adminId ? { ...a, person: null } : a
//             ),
//           };
//         }),

//       updatePlan: (adminId, plan) =>
//         set((state) => ({
//           admins: state.admins.map((a) =>
//             a.id === adminId ? { ...a, plan } : a
//           ),
//         })),

//       updatePayment: (adminId, paymentStatus) =>
//         set((state) => ({
//           admins: state.admins.map((a) =>
//             a.id === adminId ? { ...a, paymentStatus } : a
//           ),
//         })),

//       updateStatus: (adminId, isActive) =>
//         set((state) => ({
//           admins: state.admins.map((a) =>
//             a.id === adminId ? { ...a, isActive } : a
//           ),
//         })),

//       getAdminByEmail: (email) => {
//         return get().admins.find((admin) => admin.email === email);
//       },
//     }),
//     { name: "admin-storage" }
//   )
// );

// src/store/admin.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Admin,
  CompanyRepresentative,
} from "../interfaces/admin.interface";

interface AdminStore {
  admins: Admin[];
  representatives: CompanyRepresentative[];

  // Admin actions (Company registration)
  addAdmin: (admin: Admin) => void;
  updateAdmin: (id: string, admin: Admin) => void;
  deleteAdmin: (id: string) => void;
  clearAdmins: () => void;

  // Representative actions
  addRepresentative: (representative: CompanyRepresentative) => void;
  updateRepresentative: (id: string, representative: CompanyRepresentative) => void;
  deleteRepresentative: (id: string) => void;
  clearRepresentatives: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admins: [],
      representatives: [],

      // Admin actions
      addAdmin: (admin) =>
        set((state) => ({
          admins: [
            ...state.admins,
            admin,
          ],
        })),

      updateAdmin: (id, updatedAdmin) =>
        set((state) => ({
          admins: state.admins.map(
            (admin) =>
              admin.id === id
                ? updatedAdmin
                : admin
          ),
        })),

      deleteAdmin: (id) =>
        set((state) => ({
          admins:
            state.admins.filter(
              (admin) =>
                admin.id !== id
            ),
        })),

      clearAdmins: () =>
        set({
          admins: [],
        }),

      // Representative actions
      addRepresentative: (representative) =>
        set((state) => ({
          representatives: [
            ...state.representatives,
            representative,
          ],
        })),

      updateRepresentative: (id, updatedRepresentative) =>
        set((state) => ({
          representatives: state.representatives.map(
            (representative) =>
              representative.id === id
                ? updatedRepresentative
                : representative
          ),
        })),

      deleteRepresentative: (id) =>
        set((state) => ({
          representatives:
            state.representatives.filter(
              (representative) =>
                representative.id !== id
            ),
        })),

      clearRepresentatives: () =>
        set({
          representatives: [],
        }),
    }),
    {
      name: "admin-storage",
    }
  )
);