import { Loai } from "@/types/loais";

export interface LoaiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loai?: Loai | null;
}