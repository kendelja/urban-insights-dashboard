//getData.js
const API_URL = "http://localhost:8000/neighbourhoods";

export async function getNeighbourhoods() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch neighbours data");
  }
  const data = await response.json();
  return data;
}
