import { create } from "zustand";

interface MockTestState {
  selectedMockTestId: string | null;

  setSelectedMockTestId: (
    id: string
  ) => void;
}

export const useMockTestStore =
  create<MockTestState>((set) => ({
    selectedMockTestId: null,

    setSelectedMockTestId: (id) =>
      set({
        selectedMockTestId: id,
      }),
  }));