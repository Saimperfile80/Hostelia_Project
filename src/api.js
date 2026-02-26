const API_BASE_URL = "http://127.0.0.1:8000";

export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    if (!response.ok) throw new Error("Erreur réseau");
    return response.json();
};