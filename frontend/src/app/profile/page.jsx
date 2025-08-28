"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const CompleteProfileForm = ({ user, token, onComplete }) => {
  const [formData, setFormData] = useState({
    age: "",
    interests: [],
    languages: [],
    travelStyle: "",
    preferences: {
      budget: "mid", // default
      preferredGenders: [], // default empty
      activityTypes: "", // default empty
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If user already completed profile
  useEffect(() => {
    if (user?.profileCompleted && onComplete) {
      onComplete();
    }
  }, [user, onComplete]);

  // toggle array values (for interests, languages, genders, etc.)
  const handleToggle = (field, value, isPreference = false) => {
    if (isPreference) {
      setFormData((prev) => {
        const current = prev.preferences[field] || [];
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            [field]: current.includes(value)
              ? current.filter((v) => v !== value)
              : [...current, value],
          },
        };
      });
    } else {
      setFormData((prev) => {
        const current = prev[field] || [];
        return {
          ...prev,
          [field]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      });
    }
  };

  // simple input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // submit profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/complete",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onComplete) onComplete(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg mt-8 text-gray-800">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-emerald-600">
        Complete Your Profile
      </h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Age */}
        <div>
          <label className="block mb-2 font-medium">Age</label>
          <input
            type="number"
            min={18}
            max={100}
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block mb-2 font-medium">Interests</label>
          <div className="flex flex-wrap gap-2">
            {["Hiking", "Beach", "Culture", "Food", "Adventure"].map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleToggle("interests", interest, false)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  formData.interests.includes(interest)
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="block mb-2 font-medium">Languages</label>
          <div className="flex flex-wrap gap-2">
            {["English", "Telugu", "Hindi", "Tamil", "Kannada"].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleToggle("languages", lang, false)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  formData.languages.includes(lang)
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block mb-2 font-medium">Travel Style</label>
          <select
            name="travelStyle"
            value={formData.travelStyle}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Select Style</option>
            <option value="Backpacker">Backpacker</option>
            <option value="Luxury">Luxury</option>
            <option value="Solo">Solo</option>
            <option value="Group">Group</option>
          </select>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          {/* Budget */}
          <div>
            <label className="block mb-2 font-medium">Budget</label>
            <select
              value={formData.preferences.budget}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  preferences: { ...prev.preferences, budget: e.target.value },
                }))
              }
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Select Budget</option>
              <option value="low">Low</option>
              <option value="mid">Mid</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Preferred Genders */}
          <div>
            <label className="block mb-2 font-medium">Preferred Genders</label>
            <div className="flex flex-wrap gap-2">
              {["male", "female", "any"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleToggle("preferredGenders", gender, true)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    formData.preferences.preferredGenders.includes(gender)
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Types */}
          <div>
            <label className="block mb-2 font-medium">Activity Type</label>
            <select
              value={formData.preferences.activityTypes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  preferences: { ...prev.preferences, activityTypes: e.target.value },
                }))
              }
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Select Activity</option>
              <option value="trekking">Trekking</option>
              <option value="beach">Beach</option>
              <option value="roadtrip">Road Trip</option>
              <option value="sightseeing">Sightseeing</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold transition ${
            loading
              ? "bg-emerald-200 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfileForm;
