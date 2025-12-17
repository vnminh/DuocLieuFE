import { 
  Loai, LoaiFilters, CreateLoaiData, UpdateLoaiData,
  VungPhanBo
} from '@/types/loais';

// Loai API functions
export async function loadLoais(filters: LoaiFilters = {}): Promise<{ loais: Loai[], total: number }> {
  // This will be implemented with actual API calls later
  throw new Error('loadLoais function not implemented yet');
}

export async function createLoai(data: CreateLoaiData): Promise<Loai> {
  // This will be implemented with actual API calls later
  throw new Error('createLoai function not implemented yet');
}

export async function updateLoai(id: number, data: UpdateLoaiData): Promise<Loai> {
  // This will be implemented with actual API calls later
  throw new Error('updateLoai function not implemented yet');
}

export async function deleteLoai(id: number): Promise<void> {
  // This will be implemented with actual API calls later
  throw new Error('deleteLoai function not implemented yet');
}

export async function uploadLoaisCsv(file: File): Promise<{ success: number, errors: string[] }> {
  // This will be implemented with actual API calls later
  throw new Error('uploadLoaisCsv function not implemented yet');
}

export async function loadVungPhanBos(): Promise<VungPhanBo[]> {
  // This will be implemented with actual API calls later
  throw new Error('loadVungPhanBos function not implemented yet');
}