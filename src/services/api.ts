const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const api = {
  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Eroare la înregistrare");
    }

    return response.json();
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Eroare la autentificare");
    }

    return response.json();
  },
};
