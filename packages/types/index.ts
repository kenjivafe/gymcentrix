// Shared TypeScript interfaces and types
export interface UserPayload {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "GYM_OWNER" | "STAFF";
  gym_id?: string | null;
}
