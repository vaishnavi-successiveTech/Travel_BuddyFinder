// src/utils/seed.js
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "../models/User.js";
import Trip from "../models/Trip.js";
import fs from "fs";

const MONGO_URI = "mongodb://localhost:27017/travel_buddy";

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected for seeding...");
}

const INTERESTS = ["Hiking", "Beach", "Culture", "Food", "Adventure"];
const LANGUAGES = ["English", "Hindi", "Telugu", "Tamil", "Kannada"];
const STYLES = ["Backpacker", "Luxury", "Solo", "Group"];
const DESTINATIONS = [
  "Goa",
  "Himachal Pradesh",
  "Delhi",
  "Kerala",
  "Thailand",
  "Karnataka",
  "Manali"
];
const ACTIVITIES = [
  "trekking",
  "beach",
  "roadtrip",
  "sightseeing",
  "cultural",
];

// 👇 custom budget order
const BUDGETS = ["low", "mid", "high"];

async function seed() {
  try {
    await connectDB();

    await User.deleteMany({});
    await Trip.deleteMany({});

    const users = [];
    const trips = [];

    // 👤 Create users
        const usersData = JSON.parse(fs.readFileSync("mockData.json", "utf-8")); // your 20 users file
    const usersInfo = await User.insertMany(usersData);
    console.log(`✅ Inserted ${usersInfo.length} usersInfo`);

   

    // 🧳 Create trips
    for (let i = 0; i < 20; i++) {
      const creator = faker.helpers.arrayElement(users);

      const startDate = faker.date.future({ years: 1 });
      const endDate = faker.date.soon({
        days: faker.number.int({ min: 3, max: 14 }),
        refDate: startDate,
      });

      const trip = new Trip({
        creator: creator._id,
        destination: faker.helpers.arrayElement(DESTINATIONS),
        startDate,
        endDate,
        activities: faker.helpers.arrayElements(ACTIVITIES, { min: 1, max: 3 }),
        travelStyle: faker.helpers.arrayElement(STYLES),
        budget: faker.helpers.arrayElement(BUDGETS), // ✅ custom order respected
        openToJoin: faker.datatype.boolean(),
        imageUrl: faker.image.urlPicsumPhotos({ width: 800, height: 600 }), // ✅ new field
      });

      await trip.save();
      trips.push(trip);
    }

    console.log(`✅ Seeded ${users.length} users and ${trips.length} trips`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
