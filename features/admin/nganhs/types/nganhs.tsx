import { Nganh } from "@/types/nganhs";

export interface NganhFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  nganh?: Nganh | null;
}