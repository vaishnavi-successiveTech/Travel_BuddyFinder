// "use client";
// import { useState } from "react";
// import axios from "axios";

// const ProfileForm = () => {
//   const initialState = {
//     age: "",
//     interests: [],
//     languages: [],
//     travelStyle: [],
//     avatar: "",
//     preferences: {
//       budget: "",
//       preferredGenders: [],
//       activityTypes: [], // ✅ single value for dropdown
//     },
//   };

//   const [formData, setFormData] = useState(initialState);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const handleArrayToggle = (field, value, isPreference = false) => {
//     if (isPreference) {
//       setFormData((prev) => ({
//         ...prev,
//         preferences: {
//           ...prev.preferences,
//           [field]: prev.preferences[field].includes(value)
//             ? prev.preferences[field].filter((v) => v !== value)
//             : [...prev.preferences[field], value],
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: prev[field].includes(value)
//           ? prev[field].filter((v) => v !== value)
//           : [...prev[field], value],
//       }));
//     }
//   };

//   // ✅ Upload avatar
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formDataObj = new FormData();
//     formDataObj.append("image", file);

//     try {
//       setUploading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         "http://localhost:4000/api/auth/upload-avatar",
//         formDataObj,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setFormData((prev) => ({
//         ...prev,
//         avatar: res.data.imageUrl,
//       }));
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to upload image");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:4000/api/auth/complete", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert("Profile saved!");
//       setFormData(initialState); // ✅ reset form after submit
//     } catch (err) {
//       setError(err.response?.data?.error || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-4 text-emerald-600">
//         Complete Profile
//       </h2>
//       {error && <p className="text-red-500 mb-3">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Avatar Upload */}
//         <div>
//           <label className="block mb-1 font-semibold">Profile Picture</label>
//           {formData.avatar && (
//             <img
//               src={formData.avatar}
//               alt="avatar preview"
//               className="w-24 h-24 rounded-full object-cover mb-2 border"
//             />
//           )}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             disabled={uploading}
//             className="w-full border px-3 py-2 rounded"
//           />
//           {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
//         </div>

//         {/* Age */}
//         <div>
//           <label className="block mb-1">Age</label>
//           <input
//             type="number"
//             value={formData.age}
//             onChange={(e) => setFormData({ ...formData, age: e.target.value })}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         {/* Interests */}
//         <div>
//           <label className="block mb-1">Interests</label>
//           <input
//             type="text"
//             value={formData.interests.join(", ")}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 interests: e.target.value
//                   .split(",")
//                   .map((i) => i.trim())
//                   .filter((i) => i),
//               })
//             }
//             placeholder="e.g. Hiking, Camping"
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         {/* Languages */}
//         <div>
//           <label className="block mb-1">Languages</label>
//           <div className="flex gap-2 flex-wrap">
//             {["English", "Hindi", "French", "Spanish"].map((lang) => (
//               <button
//                 key={lang}
//                 type="button"
//                 onClick={() => handleArrayToggle("languages", lang)}
//                 className={`px-3 py-1 rounded ${
//                   formData.languages.includes(lang)
//                     ? "bg-emerald-500 text-white"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 {lang}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Travel Style */}
//         <div>
//           <label className="block mb-1">Travel Style</label>
//           <div className="flex gap-2 flex-wrap">
//             {["budget", "luxury", "solo", "group"].map((style) => (
//               <button
//                 key={style}
//                 type="button"
//                 onClick={() => handleArrayToggle("travelStyle", style)}
//                 className={`px-3 py-1 rounded ${
//                   formData.travelStyle.includes(style)
//                     ? "bg-yellow-400"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 {style}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Preferences - Budget */}
//         <div>
//           <label className="block mb-1">Budget</label>
//           <select
//             value={formData.preferences.budget}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 preferences: {
//                   ...formData.preferences,
//                   budget: e.target.value,
//                 },
//               })
//             }
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">Select</option>
//             <option value="low">Low</option>
//             <option value="mid">Mid</option>
//             <option value="high">High</option>
//           </select>
//         </div>

//         {/* Preferences - Genders */}
//         <div>
//           <label className="block mb-1">Preferred Genders</label>
//           <div className="flex gap-2">
//             {["male", "female"].map((gender) => (
//               <button
//                 key={gender}
//                 type="button"
//                 onClick={() =>
//                   handleArrayToggle("preferredGenders", gender, true)
//                 }
//                 className={`px-3 py-1 rounded ${
//                   formData.preferences.preferredGenders.includes(gender)
//                     ? "bg-emerald-500 text-white"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 {gender}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Preferences - Activity Type (Dropdown) */}
//         <div>
//           <label className="block mb-1">Activity Types</label>
//           <select
//             multiple
//             value={formData.preferences.activityTypes}
//             onChange={(e) => {
//               const selectedOptions = Array.from(
//                 e.target.selectedOptions,
//                 (option) => option.value
//               );
//               setFormData((prev) => ({
//                 ...prev,
//                 preferences: {
//                   ...prev.preferences,
//                   activityTypes: selectedOptions, // ✅ always array
//                 },
//               }));
//             }}
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="trekking">Trekking</option>
//             <option value="beach">Beach</option>
//             <option value="roadtrip">Road Trip</option>
//             <option value="cultural">Cultural</option>
//           </select>
//         </div>
//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 rounded font-bold ${
//             loading ? "bg-gray-300" : "bg-emerald-600 text-white"
//           }`}
//         >
//           {loading ? "Saving..." : "Save Profile"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProfileForm;

"use client";
import { useState } from "react";
import axios from "axios";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    interests: [],
    languages: [],
    travelStyle: [],
    avatar: "", // ✅ store uploaded image
    preferences: {
      budget: "",
      preferredGenders: [],
      activityTypes: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleArrayToggle = (field, value, isPreference = false) => {
    if (isPreference) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [field]: prev.preferences[field].includes(value)
            ? prev.preferences[field].filter((v) => v !== value)
            : [...prev.preferences[field], value],
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      }));
    }
  };

  // ✅ Upload avatar
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:4000/api/auth/upload-avatar",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        avatar: res.data.imageUrl, // ✅ update state with uploaded URL
      }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/auth/complete", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile saved!");
      setFormData({
        age: "",
        interests: [],
        languages: [],
        travelStyle: [],
        avatar: "", // ✅ store uploaded image
        preferences: {
          budget: "",
          preferredGenders: [],
          activityTypes: [],
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-emerald-600">
        Complete Profile
      </h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar Upload */}
        <div>
          <label className="block mb-1 font-semibold">Profile Picture</label>
          {formData.avatar && (
            <img
              src={formData.avatar}
              alt="avatar preview"
              className="w-24 h-24 rounded-full object-cover mb-2 border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full border px-3 py-2 rounded"
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block mb-1">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block mb-1">Interests</label>
          <input
            type="text"
            value={formData.interests.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                interests: e.target.value.split(",").map((i) => i.trim()),
              })
            }
            placeholder="e.g. Hiking, Camping"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block mb-1">Languages</label>
          <div className="flex gap-2 flex-wrap">
            {["English", "Hindi", "French", "Spanish"].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleArrayToggle("languages", lang)}
                className={`px-3 py-1 rounded ${
                  formData.languages.includes(lang)
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block mb-1">Travel Style</label>
          <div className="flex gap-2 flex-wrap">
            {["budget", "luxury", "solo", "group"].map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => handleArrayToggle("travelStyle", style)}
                className={`px-3 py-1 rounded ${
                  formData.travelStyle.includes(style)
                    ? "bg-yellow-400"
                    : "bg-gray-200"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences - Budget */}
        <div>
          <label className="block mb-1">Budget</label>
          <select
            value={formData.preferences.budget}
            onChange={(e) =>
              setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  budget: e.target.value,
                },
              })
            }
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Preferences - Genders */}
        <div>
          <label className="block mb-1">Preferred Genders</label>
          <div className="flex gap-2">
            {["male", "female"].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() =>
                  handleArrayToggle("preferredGenders", gender, true)
                }
                className={`px-3 py-1 rounded ${
                  formData.preferences.preferredGenders.includes(gender)
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences - Activity Types */}
        <div>
          <label className="block mb-1">Activity Types</label>
          <select
            multiple
            value={formData.preferences.activityTypes}
            onChange={(e) => {
              const values = Array.from(
                e.target.selectedOptions,
                (opt) => opt.value
              );
              setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  activityTypes: values,
                },
              });
            }}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="trekking">Trekking</option>
            <option value="beach">Beach</option>
            <option value="roadtrip">Road Trip</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-bold ${
            loading ? "bg-gray-300" : "bg-emerald-600 text-white"
          }`}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
