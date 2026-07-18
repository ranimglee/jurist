import { Case } from "@/types";
import { BackendCase, SaveCaseDTO } from "./case.types";
import { mapBackendCaseToCase } from "./case.mapper";
import { API_BASE_URL } from "@/lib/config";

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API Error");
  }

  // ✅ HANDLE EMPTY RESPONSE (VERY IMPORTANT)
  if (res.status === 204) {
    return null as T;
  }

  const text = await res.text();

  // ✅ If empty body → avoid crash
  if (!text) {
    return null as T;
  }

  return JSON.parse(text);
};

export const CaseService = {
  async getAll(): Promise<Case[]> {
    const data = await request<BackendCase[]>(
      `${API_BASE_URL}/api/affaires`
    );
    return data.map(mapBackendCaseToCase);
  },

  async create(dto: SaveCaseDTO): Promise<Case> {
    const data = await request<BackendCase>(
      `${API_BASE_URL}/api/affaires`,
      {
        method: "POST",
        body: JSON.stringify(dto),
      }
    );
    return mapBackendCaseToCase(data);
  },

  async update(id: number, dto: SaveCaseDTO): Promise<Case> {
    const data = await request<BackendCase>(
      `${API_BASE_URL}/api/affaires/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(dto),
      }
    );
    return mapBackendCaseToCase(data);
  },

  async remove(id: number): Promise<void> {
    await request<void>(`${API_BASE_URL}/api/affaires/${id}`, {
      method: "DELETE",
    });
  },
};
