import { Ho } from "@/types/hos";

export interface HoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ho?: Ho | null;
  viewMode?: boolean;
}