import { AideJudiciaire, EligibleAvocat } from "@/types";

import { API_BASE_URL } from "@/lib/config";

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Send cookies for authenticated request
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API Error");
  }

  if (res.status === 204) {
    return null as T;
  }

  const text = await res.text();
  if (!text) {
    return null as T;
  }

  return JSON.parse(text);
};

export const AideJudiciaireService = {
  async getAll(): Promise<AideJudiciaire[]> {
    return request<AideJudiciaire[]>(`${API_BASE_URL}/api/aides-judiciaires`);
  },

  async getById(id: number): Promise<AideJudiciaire> {
    return request<AideJudiciaire>(`${API_BASE_URL}/api/aides-judiciaires/${id}`);
  },

  async create(data: Omit<AideJudiciaire, "id" | "avocatNom" | "assignedAt">): Promise<AideJudiciaire> {
    return request<AideJudiciaire>(`${API_BASE_URL}/api/aides-judiciaires`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Omit<AideJudiciaire, "id" | "avocatNom" | "assignedAt">): Promise<AideJudiciaire> {
    return request<AideJudiciaire>(`${API_BASE_URL}/api/aides-judiciaires/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async remove(id: number): Promise<void> {
    await request<void>(`${API_BASE_URL}/api/aides-judiciaires/${id}`, {
      method: "DELETE",
    });
  },

  async reassign(id: number, avocatId: number | null): Promise<AideJudiciaire> {
    const queryParam = avocatId !== null ? `?avocatId=${avocatId}` : "";
    return request<AideJudiciaire>(`${API_BASE_URL}/api/aides-judiciaires/${id}/reassign${queryParam}`, {
      method: "POST",
    });
  },

  async getEligibleLawyers(): Promise<EligibleAvocat[]> {
    return request<EligibleAvocat[]>(`${API_BASE_URL}/api/aides-judiciaires/eligible-lawyers`);
  }
};
