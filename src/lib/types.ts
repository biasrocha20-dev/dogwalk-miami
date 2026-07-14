export type Role = "owner" | "walker";

export type PetSize = "small" | "medium" | "large";

export type VaccinationStatus = "up_to_date" | "pending" | "unknown";

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export type BookingDuration = 20 | 30 | 60;

export interface Profile {
  id: string;
  role: Role;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  size: PetSize | null;
  notes: string | null;
  vaccination_status: VaccinationStatus;
  created_at: string;
}

export interface WalkerProfile {
  user_id: string;
  bio: string | null;
  photo_url: string | null;
  rate_per_walk: number;
  active: boolean;
  service_neighborhoods: string[];
  rating_avg: number;
  rating_count: number;
  created_at: string;
  profile?: Profile;
}

export interface Booking {
  id: string;
  owner_id: string;
  walker_id: string;
  pet_id: string;
  scheduled_at: string;
  duration_minutes: BookingDuration;
  status: BookingStatus;
  price: number;
  recurring_rule: string | null;
  notes: string | null;
  created_at: string;
  pet?: Pet;
  walker?: WalkerProfile & { profile?: Profile };
  owner?: Profile;
}
