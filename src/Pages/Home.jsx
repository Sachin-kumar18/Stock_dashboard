import React, { useEffect, useState } from "react";
import { fetchStockData } from "../api/stocks";
import { useNavigate } from "react-router-dom";

const INITIAL_COUNT = 20;
const LOAD_MORE_COUNT = 15;

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStockData();
        setStocks(data);
      } catch (err) {
        console.error("Error fetching stocks:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Infinite Scroll Effect
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        if (!scrollLoading && visibleCount < stocks.length) {
          setScrollLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
            setScrollLoading(false);
          }, 800);
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollLoading, visibleCount, stocks.length]);

  const filtered = stocks.filter(
    (s) =>
      s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const visibleFiltered = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📈 Stock Companies
      </h1>
      <div className="relative mb-6 max-w-xl mx-auto">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 bg-white shadow-sm
               focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="text-center text-xl font-semibold">Loading...</div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-900 text-white uppercase text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Symbol</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Exchange</th>
                <th className="py-3 px-4 text-left">Asset Type</th>
                <th className="py-3 px-4 text-left">IPO Date</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-700">
              {visibleFiltered.map((s) => (
                <tr key={s.symbol} className="border-b hover:bg-gray-50">
                  <td
                    className="py-2 px-4 font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/company/${s.symbol}`)}
                  >
                    {s.symbol}
                  </td>
                  <td
                    className="py-2 px-4 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/company/${s.symbol}`)}
                  >
                    {s.name}
                  </td>

                  <td className="py-2 px-4">{s.exchange}</td>
                  <td className="py-2 px-4">{s.assetType}</td>
                  <td className="py-2 px-4">{s.ipoDate}</td>
                  <td className="py-2 px-4">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {scrollLoading && (
            <div className="text-center py-4 text-gray-600">
              Loading more stocks...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
