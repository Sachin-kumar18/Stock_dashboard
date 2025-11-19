const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

export async function fetchStockData() {
  const url = `${BASE_URL}?function=LISTING_STATUS&apikey=${API_KEY}`;

  const res = await fetch(url);
  const text = await res.text();

  if (!text || text.startsWith("{")) {
    console.warn("API Error / Limit reached:", text);
    return [];
  }

  const rows = text.split("\n");

  rows.shift();

  const data = rows
    .map((row) => row.split(","))
    .filter((r) => r.length > 3)
    .map(
      ([
        symbol,
        name,
        exchange,
        assetType,
        ipoDate,
        delistingDate,
        status,
      ]) => ({
        symbol,
        name,
        exchange,
        assetType,
        ipoDate,
        delistingDate,
        status,
      })
    );

  return data.slice(0, 500);
}

export async function fetchCompanyOverview(symbol) {
  const url = `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();

  if (!json || Object.keys(json).length === 0) {
    return { error: "API limit reached or no data available" };
  }

  return json;
}
