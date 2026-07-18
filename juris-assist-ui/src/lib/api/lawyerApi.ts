import { apiUrl } from "@/lib/config";

const BASE_URL = apiUrl("/api/lawyers");

export async function getAllLawyers() {
  const res = await fetch(`${BASE_URL}/get-all`);
  if (!res.ok) throw new Error("Erreur lors du chargement des avocats");
  return res.json();
}

export async function createLawyer(data: any) {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erreur lors de la création de l'avocat");
  return res.json();
}

export async function updateLawyer(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erreur lors de la mise à jour de l'avocat");
  return res.json();
}

export async function deleteLawyer(id: number) {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Erreur lors de la suppression de l'avocat");
}
