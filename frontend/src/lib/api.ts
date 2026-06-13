const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number | null;
  description: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiHealth = {
  status: string;
  service?: string;
  timestamp?: string;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getHealth(): Promise<ApiHealth> {
  return apiFetch<ApiHealth>("/api/health");
}

export async function getVehicles(): Promise<{ data: Vehicle[] }> {
  return apiFetch<{ data: Vehicle[] }>("/api/vehicles");
}

export { API_URL };
