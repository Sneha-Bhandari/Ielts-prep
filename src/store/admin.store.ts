// src/store/admin.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Admin, CompanyRepresentative } from "../interfaces/admin.interface";

interface AdminStore {
  admins: Admin[];
  representatives: CompanyRepresentative[];
  currentAdmin: Admin | null;
  companyId: string | null;

  // Admin actions
  addAdmin: (admin: Admin) => void;
  updateAdmin: (id: string, admin: Admin) => void;
  deleteAdmin: (id: string) => void;
  clearAdmins: () => void;
  setAdmins: (admins: Admin[]) => void;
  setCurrentAdmin: (admin: Admin) => void;
  setCompanyId: (companyId: string) => void;

  // Representative actions
  addRepresentative: (representative: CompanyRepresentative) => void;
  updateRepresentative: (id: string, representative: CompanyRepresentative) => void;
  deleteRepresentative: (id: string) => void;
  clearRepresentatives: () => void;

  // Helper methods
  getCompanyId: () => string | null;
  getCurrentAdmin: () => Admin | null;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      admins: [],
      representatives: [],
      currentAdmin: null,
      companyId: null,

      // Admin actions
      setAdmins: (admins) => {
        set({ admins });
        // If admins exist and no currentAdmin is set, set the first one
        const state = get();
        if (admins.length > 0 && !state.currentAdmin) {
          const firstAdmin = admins[0];
          set({ 
            currentAdmin: firstAdmin, 
            companyId: firstAdmin.companyId || firstAdmin.id 
          });
        }
      },

      setCurrentAdmin: (admin) => {
        set({ 
          currentAdmin: admin, 
          companyId: admin.companyId || admin.id 
        });
      },

      setCompanyId: (companyId) => {
        set({ companyId });
      },

      addAdmin: (admin) =>
        set((state) => ({
          admins: [...state.admins, admin],
          // If this is the first admin, set as current
          ...(state.admins.length === 0 ? { 
            currentAdmin: admin, 
            companyId: admin.companyId || admin.id 
          } : {}),
        })),

      updateAdmin: (id, updatedAdmin) =>
        set((state) => ({
          admins: state.admins.map((admin) =>
            admin.id === id ? updatedAdmin : admin
          ),
          // Update current admin if it's the one being updated
          ...(state.currentAdmin?.id === id ? { 
            currentAdmin: updatedAdmin,
            companyId: updatedAdmin.companyId || updatedAdmin.id
          } : {}),
        })),

      deleteAdmin: (id) =>
        set((state) => ({
          admins: state.admins.filter((admin) => admin.id !== id),
          // Clear current admin if deleted
          ...(state.currentAdmin?.id === id ? { 
            currentAdmin: null, 
            companyId: null 
          } : {}),
        })),

      clearAdmins: () =>
        set({ admins: [], currentAdmin: null, companyId: null }),

      // Representative actions
      addRepresentative: (representative) =>
        set((state) => ({
          representatives: [...state.representatives, representative],
        })),

      updateRepresentative: (id, updatedRepresentative) =>
        set((state) => ({
          representatives: state.representatives.map(
            (representative) =>
              representative.id === id ? updatedRepresentative : representative
          ),
        })),

      deleteRepresentative: (id) =>
        set((state) => ({
          representatives: state.representatives.filter(
            (representative) => representative.id !== id
          ),
        })),

      clearRepresentatives: () =>
        set({ representatives: [] }),

      // Helper methods
      getCompanyId: () => {
        const state = get();
        return state.companyId || state.currentAdmin?.companyId || state.currentAdmin?.id || null;
      },

      getCurrentAdmin: () => {
        return get().currentAdmin;
      },
    }),
    {
      name: "admin-storage",
      partialize: (state) => ({
        admins: state.admins,
        representatives: state.representatives,
        currentAdmin: state.currentAdmin,
        companyId: state.companyId,
      }),
    }
  )
);