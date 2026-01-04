import { VungPhanBo } from "@/types/vung-phan-bo";

export interface VungPhanBoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vungPhanBo?: VungPhanBo | null;
  viewMode?: boolean;
}
