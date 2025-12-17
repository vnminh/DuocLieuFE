import { 
  Ho, HoFilters, CreateHoData, UpdateHoData
} from '@/types/hos';

// Ho API functions
export async function loadHos(filters: HoFilters = {}): Promise<{ hos: Ho[], total: number }> {
  // This will be implemented with actual API calls later
  throw new Error('loadHos function not implemented yet');
}

export async function createHo(data: CreateHoData): Promise<Ho> {
  // This will be implemented with actual API calls later
  throw new Error('createHo function not implemented yet');
}

export async function updateHo(id: number, data: UpdateHoData): Promise<Ho> {
  // This will be implemented with actual API calls later
  throw new Error('updateHo function not implemented yet');
}

export async function deleteHo(id: number): Promise<void> {
  // This will be implemented with actual API calls later
  throw new Error('deleteHo function not implemented yet');
}

export async function uploadHosCsv(file: File): Promise<{ success: number, errors: string[] }> {
  // This will be implemented with actual API calls later
  throw new Error('uploadHosCsv function not implemented yet');
}

export async function loadAllHos(): Promise<Ho[]> {
  // This will be implemented with actual API calls later
  throw new Error('loadAllHos function not implemented yet');
}