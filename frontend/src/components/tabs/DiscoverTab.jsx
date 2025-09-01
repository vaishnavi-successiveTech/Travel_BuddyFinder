"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import TravelCard from "../ui/TravelCard";

export default function DiscoverTab() {
  const [destination, setDestination] = useState("");
  const [gender, setGender] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [budget, setBudget] = useState("");
  const [tripType, setTripType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [results, setResults] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Error handling
  const [error, setError] = useState("");

  // Check if any filter is used
  const anyFilterFilled = () =>
    destination.trim() ||
    gender.trim() ||
    ageRange.trim() ||
    budget.trim() ||
    tripType.trim() ||
    dateFrom.trim() ||
    dateTo.trim();

  // Search handler
  const handleSearch = async (e = null, newPage = 1) => {
    if (e) e.preventDefault();

    if (e && !anyFilterFilled()) {
      setError("Please fill at least one field to search.");
      return;
    }

    setError("");

    let ageMin, ageMax;
    if (ageRange) {
      const [min, max] = ageRange.split("-").map(Number);
      ageMin = min;
      ageMax = max || 100;
    }

    try {
      const res = await axios.get("http://localhost:4000/api/trips/search", {
        params: {
          destination: destination || undefined,
          gender: gender || undefined,
          budget: budget || undefined,
          travelStyle: tripType || undefined,
          start: dateFrom || undefined,
          end: dateTo || undefined,
          ageMin,
          ageMax,
          page: newPage,
          limit: 5,
        },
      });

      setResults(res.data.results);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Error fetching trips:", err);
      setError("Failed to fetch trips. Try again later.");
    }
  };

  useEffect(() => {
    handleSearch(null, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-emerald-500 to-yellow-300 bg-clip-text text-transparent">
        Where to next?
      </h1>

      {/* Travel Form */}
      <form className="space-y-4 mt-8" onSubmit={(e) => handleSearch(e, 1)}>
        {/* Destination + Gender */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-black">Main</label>
            <select
              className="w-full p-2 border rounded-md text-black max-h-40 overflow-y-auto"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">Select destination</option>
              <option>Chopta</option>
              <option>Goa</option>
              <option>Jodhpur</option>
              <option>Jaisalmer</option>
              <option>Jaipur</option>
              <option>Kasol</option>
              <option>Manali</option>
              <option>Pune</option>
              <option>Ranchi</option>
              <option>Valley of Flowers</option>
              {/* States */}
              <option>Andhra Pradesh</option>
              <option>Himachal Pradesh</option>
              <option>Kerala</option>
              <option>Maharashtra</option>
              <option>Rajasthan</option>
              <option>Tamil Nadu</option>
              <option>Uttar Pradesh</option>
              <option>Uttarakhand</option>
              <option>West Bengal</option>
              {/* Union Territories */}
              <option>Delhi</option>
              <option>Jammu and Kashmir</option>
              <option>Ladakh</option>
              <option>Puducherry</option>
            </select>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="block text-sm text-black font-medium">
              Gender
            </label>
            <select
              className="w-full p-2 border text-black rounded-md"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Age + Dates */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-black">Age</label>
            <select
              className="w-full p-2 text-black border rounded-md"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
            >
              <option value="">Select age group</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55-100">55+</option>
            </select>
          </div>

          <div className="w-full sm:w-1/2 flex flex-col sm:flex-row gap-2">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-black">
                Date from
              </label>
              <input
                type="date"
                className="w-full p-2 text-black border rounded-md"
                value={dateFrom}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-black">to</label>
              <input
                type="date"
                className="w-full p-2 text-black border rounded-md"
                value={dateTo}
                min={dateFrom || new Date().toISOString().split("T")[0]}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Trip Type + Budget */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-black">
              Trip Type
            </label>
            <select
              className="w-full p-2 border text-black rounded-md"
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <option value="">Select trip type</option>
              <option>Backpacker</option>
              <option>Adventure</option>
              <option>Group</option>
              <option>Solo</option>
              <option>Wildlife</option>
              <option>Road Trip</option>
              <option>Spiritual</option>
              <option>Festival</option>
              <option>Family</option>
              <option>Camping</option>
              <option>Snow & Ski</option>
              <option>Safari</option>
              <option>City Break</option>
            </select>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-black">
              Budget
            </label>
            <select
              className="w-full p-2 border text-black rounded-md"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value="">Select budget</option>
              <option value="low">LOW</option>
              <option value="mid">MID</option>
              <option value="high">HIGH</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-md shadow-md transition"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="mt-2 text-center text-red-500 text-sm">{error}</div>
        )}
      </form>

      {/* Results */}
      <div className="p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-6 text-center sm:text-left">
          Recommended Travel Buddy
        </h1>

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((trip) => <TravelCard key={trip._id} trip={trip} />)
          ) : (
            <p className="text-gray-500 text-center sm:text-left">
              No trips found
            </p>
          )}
        </div>

        {/* Pagination */}
        {results.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => handleSearch(null, page - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm sm:text-base">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => handleSearch(null, page + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
