const API_URL = "http://localhost:8080";

export const testBackend = async () => {
  const response = await fetch(`${API_URL}/api/test`);
  return response.text();
};