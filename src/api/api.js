import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${API}/api`,
});

/**
 * Fetch AQI data
 */
export const getAQIData = async (city) => {
  const url = city
    ? `${API}/api/airQualityData?city=${encodeURIComponent(city)}`
    : `${API}/api/airQualityData`;

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