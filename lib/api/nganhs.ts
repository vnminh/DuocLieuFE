import { 
  Nganh, NganhFilters, CreateNganhData, UpdateNganhData
} from '@/types/nganhs';

// Nganh API functions
export async function loadNganhs(filters: NganhFilters = {}): Promise<{ nganhs: Nganh[], total: number }> {
  // This will be implemented with actual API calls later
  throw new Error('loadNganhs function not implemented yet');
}

export async function createNganh(data: CreateNganhData): Promise<Nganh> {
  // This will be implemented with actual API calls later
  throw new Error('createNganh function not implemented yet');
}

export async function updateNganh(id: number, data: UpdateNganhData): Promise<Nganh> {
  // This will be implemented with actual API calls later
  throw new Error('updateNganh function not implemented yet');
}

export async function deleteNganh(id: number): Promise<void> {
  // This will be implemented with actual API calls later
  throw new Error('deleteNganh function not implemented yet');
}

export async function uploadNganhsCsv(file: File): Promise<{ success: number, errors: string[] }> {
  // This will be implemented with actual API calls later
  throw new Error('uploadNganhsCsv function not implemented yet');
}

export async function loadAllNganhs(): Promise<Nganh[]> {
  // This will be implemented with actual API calls later
  throw new Error('loadAllNganhs function not implemented yet');
}