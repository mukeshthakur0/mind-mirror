const API_BASE = "http://localhost:5000/api/journals";
const USER_ID = "demoUser123"; // ⚠️ Replace later with real auth user ID

// Get all journals for a user
export const getJournals = async () => {
  const res = await fetch(`${API_BASE}/user/${USER_ID}`);
  if (!res.ok) throw new Error(`Failed to fetch journals: ${res.status}`);
  return res.json();
};

// Add a new journal
export const addJournal = async (data) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, userId: USER_ID }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `Failed to save journal: ${res.status}`);
  }
  return res.json();
};

// Update a journal by ID
export const updateJournal = async (id, data) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update journal: ${res.status}`);
  return res.json();
};

// Delete a journal by ID
export const deleteJournal = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete journal: ${res.status}`);
  return res.json();
};

// Get user stats
export const getJournalStats = async () => {
  const res = await fetch(`${API_BASE}/user/${USER_ID}/stats`);
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
  return res.json();
};
