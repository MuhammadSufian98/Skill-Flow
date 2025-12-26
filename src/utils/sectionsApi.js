import api from "@/utils/axiosInstance";

export const fetchSections = async () => {
  const response = await api.get("/sections/global");
  return response.data;
};

export const fetchMaterial = async (id) => {
  if (!id) throw new Error("id is required");

  const { data: body } = await api.get(
    `/sections/material/${encodeURIComponent(id)}`
  );

  if (!body?.ok) return null;
  return body.data ?? null;
};

export const getProgress = async (materialId) => {
  if (!materialId) throw new Error("materialId is required");

  const { data: body } = await api.get(
    `/sections/progress?materialId=${encodeURIComponent(materialId)}`
  );

  if (!body?.ok) return null;
  return body.data ?? null;
};

export const saveProgress = async (payload) => {
  const { data: body } = await api.post("/sections/progress", payload);
  if (!body?.ok) return null;
  return body.data ?? null;
};

export const saveNotes = async (notes) => {
  try {
    const { data: body } = await api.post("/sections/notes", {
      text: notes[0]?.text, // Sending only the text property
    });

    if (!body?.ok) {
      console.error("Failed to save note", body?.error);
      return null;
    }

    return body.data ?? null;
  } catch (err) {
    console.error("Error saving notes:", err);
    return null;
  }
};

export const fetchNotes = async () => {
  try {
    const { data: body } = await api.get("/sections/notes");

    if (!body?.ok) {
      console.error("Failed to fetch notes", body?.error);
      return [];
    }

    return body.data ?? [];
  } catch (err) {
    console.error("Error fetching notes:", err);
    return [];
  }
};
