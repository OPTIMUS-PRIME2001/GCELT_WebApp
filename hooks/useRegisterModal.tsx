// control open and close of register modals
import { create } from 'zustand';
type Variant = 'LOGIN' | 'REGISTER';

interface RegisterModalStore {
  isOpen: boolean;
  variant: Variant;
  onOpen: (variant: string | any) => void;
  onClose: () => void;
}

export const useRegisterModal = create<RegisterModalStore>((set) => ({
  isOpen: false,
  variant: 'LOGIN',
  onOpen: (variant) => set({ isOpen: true, variant }),
  onClose: () => set({ isOpen: false })
}));