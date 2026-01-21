import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

/**
 * Fetch AQI data
 * @param {string} city (optional)
 * - If city is provided → backend uses searched city
 * - If not → backend auto-detects (DB → IP)
 */
export const getAQIData = async (city) => {
  const url = city
    ? `http://localhost:3000/api/airQualityData?city=${encodeURIComponent(city)}`
    : `http://localhost:3000/api/airQualityData`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch AQI data");
  }

  return res.json();
};