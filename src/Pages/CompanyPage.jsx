import React, { useEffect, useState } from "react";
import { fetchCompanyOverview } from "../api/stocks";
import { useParams, Link } from "react-router-dom";
import CompanyChart from "../Components/CompanyChart";

export default function CompanyPage() {
  const { symbol } = useParams();
  const [info, setInfo] = useState(null);

  const chartData = [
    { month: "Jan", revenue: 120 },
    { month: "Feb", revenue: 150 },
    { month: "Mar", revenue: 170 },
    { month: "Apr", revenue: 160 },
    { month: "May", revenue: 190 },
    { month: "Jun", revenue: 210 },
  ];

  useEffect(() => {
    async function load() {
      const data = await fetchCompanyOverview(symbol);
      setInfo(data);
    }
    load();
  }, [symbol]);

  if (!info) return <div className="text-center mt-8">Loading...</div>;

  if (info.error)
    return (
      <div className="text-center mt-8 text-red-500 text-xl">
        ⚠ API limit reached
      </div>
    );

  return (
    <div className="p-6">
      <Link to="/" className="text-blue-500 underline">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mb-4">{info.Name}</h1>

      <div className="bg-white shadow p-4 rounded-lg">
        <p>
          <b>Symbol:</b> {info.Symbol}
        </p>
        <p>
          <b>Sector:</b> {info.Sector}
        </p>
        <p>
          <b>Industry:</b> {info.Industry}
        </p>
        <p>
          <b>Market Cap:</b> ${info.MarketCapitalization}
        </p>
        <p className="mt-3 text-gray-700">{info.Description}</p>
      </div>
      <CompanyChart data={chartData} />
    </div>
  );
}
