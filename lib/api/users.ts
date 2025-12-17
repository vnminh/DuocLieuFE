import { User, UserFilters, CreateUserData, UpdateUserData } from '@/types/user';

// Abstract API functions - to be implemented later
export async function loadUsers(filters: UserFilters = {}): Promise<{ users: User[], total: number }> {
  // This will be implemented with actual API calls later
  throw new Error('loadUsers function not implemented yet');
}

export async function createUser(data: CreateUserData): Promise<User> {
  // This will be implemented with actual API calls later
  try{
    const body = JSON.stringify(data)
    console.log(body)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/user`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    const json = await res.json()

    console.log('Create User Successfully', json)

    return json;
  }
  catch (error){
    console.log(error)
    throw error;
  }

  // throw new Error('createUser function not implemented yet');
}

export async function updateUser(id: number, data: UpdateUserData): Promise<User> {
  // This will be implemented with actual API calls later
  throw new Error('updateUser function not implemented yet');
}

export async function deleteUser(id: number): Promise<void> {
  // This will be implemented with actual API calls later
  throw new Error('deleteUser function not implemented yet');
}

export async function toggleUserBlock(id: number): Promise<User> {
  // This will be implemented with actual API calls later
  throw new Error('toggleUserBlock function not implemented yet');
}