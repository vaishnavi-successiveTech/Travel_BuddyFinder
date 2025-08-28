// src/components/tabs/DiscoverTab.jsx
"use client";

export default function DiscoverTab() {
  return (
    <div className="p-4">
      <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-emerald-500 to-yellow-300 bg-clip-text text-transparent">
        Where to next?
      </h1>

      {/* Travel Form */}
     <form className="space-y-4 mt-8">
        <div className="flex gap-4">
          {/* Destination Select */}
          <div className="w-1/2">
            <label className="block text-sm font-medium text-black">
              Main
            </label>
            <select className="w-full p-2 border rounded-md text-black" defaultValue="">
              <option value="" disabled selected>
                Select destination
              </option>
              <option>India, Maldives</option>
              <option>USA, Canada</option>
              <option>Australia, New Zealand</option>
              <option>France, Italy</option>
            </select>
          </div>

          {/* Gender Select */}
          <div className="w-1/2">
            <label className="block text-sm  text-black font-medium ">
              Gender
            </label>
            <select className="w-full p-2 border  text-black rounded-md">
              <option value="" disabled selected>
                Select gender
              </option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Age Group Select */}
          <div className="w-1/2">
            <label className="block text-sm font-medium text-black">
              Age
            </label>
            <select className="w-full p-2 text-black border rounded-md">
              <option value="" disabled selected>
                Select age group
              </option>
              <option>18-24</option>
              <option>25-34</option>
              <option>35-44</option>
              <option>45-54</option>
              <option>55+</option>
            </select>
          </div>

          {/* Travel Dates */}
          <div className="w-1/2 flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-black">
                Date from
              </label>
              <input type="date" className="w-full p-2  text-black border rounded-md" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-black text-black">
                to
              </label>
              <input type="date" className="w-full p-2 border rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Trip Type Select */}
          <div className="w-1/2">
            <label className="block text-sm  text-black font-medium text-black">
              Trip Type
            </label>
            <select className="w-full p-2 border text-black rounded-md">
              <option value="" disabled selected>
                Select trip type
              </option>
              <option>Backpacking</option>
              <option> Beach</option>
              <option>Luxury</option>
               <option> Resort</option>
               <option> Hiking</option>
              <option>Adventure</option>
              <option> Historical</option>
              <option>Cultural</option>
            </select>
          </div>

          {/* Budget Select */}
          <div className="w-1/2">
            <label className="block text-sm font-medium text-black">
              Budget
            </label>
            <select className="w-full p-2 border text-black rounded-md">
              <option value="" disabled selected>
                Select budget
              </option>
              <option> - $500</option>
              <option>$500 - $1000</option>
              <option>$1000 - $1500</option>
              <option>$1500+</option>
            </select>
          </div>
        </div>

        {/* Companion Select */}
        <div>
          <label className="block text-sm font-medium text-black">
            Travel Partner
          </label>
          <select className="w-full p-2 border text-black rounded-md">
            <option value="" disabled selected>
              Select option
            </option>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-md shadow-md transition">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
