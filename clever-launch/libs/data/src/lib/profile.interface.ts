export interface Profile {
  id: string;
  name?: string;
  email?: string;
  city?: string;
  avatarUrl?: string;
  country?: string;
  biography?: string;
  urlProfilePage?: string;
  website?: string;
  createdAt: number;
  updatedAt?: number;
}
