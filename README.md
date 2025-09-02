# 🌍 Buddy Traveller – Connect With Fellow Travelers  

A platform where travelers can **find others going to the same place at the same time**, so they can connect, share experiences, split costs, or just not feel alone on the trip.  

---

## 🔹 Key Features  

### 👤 User Profiles  
- Basic info (name, age, gender, interests, languages spoken, travel style).  
- Travel preferences (budget-friendly, adventure, luxury, history, etc.).  

### 🗺 Trip Posting  
- Users post their planned trip: destination, dates, activities.  
- Option to mark trips as **open to join**.  

### 🤝 Buddy Matching  
- Algorithm matches people by **destination + dates + interests**.  
- Example: Going to *Paris in October* → App shows others who are too.  

### 💬 Chat & Connection  
- In-app chat or integration with **WhatsApp/Telegram**.  
- Icebreaker questions like *“What excites you most about this trip?”*.  

### 🛡 Safety Features  
- Verified profiles (email, phone, ID).  
- Option to show **limited profile info** until trust is built.  
- **Report/Block system** for security.  

### 🔍 Filters  
- Find by **destination, gender preference, budget level, activity type** (trekking, food, sightseeing).  

---

## 🔹 Tech Stack   

- **Frontend**:  [Next.js](https://nextjs.org/), [React.js](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [GraphQL](https://graphql.org/) with [Apollo Server](https://www.apollographql.com/docs/apollo-server/)  
- **Database**: MongoDB (users, trips, matches)  
- **Auth**: JWT with cookies  
- **Matching Logic**: GraphQL queries with filters  
- **Chatting**: In-app chat (WebSockets)  


---


## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running [MongoDB](https://www.mongodb.com/) instance (local or on a cloud service like MongoDB Atlas)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (Recommended GUI for MongoDB)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vaishnavi-successiveTech/Travel_BuddyFinder.git
    cd travelBuddy
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

---

## ⚙️ Configuration (Environment Variables)

This project requires environment variables to be set up for both the backend and frontend.

### Backend (`/backend/.env`)

Create a `.env` file in the `/backend` directory and add the following variables.

```bash
# /backend/.env

# Port for the backend server
PORT=4000

# Your MongoDB connection string
MONGO_URI=mongodb://localhost:27017/travel_buddy

# A secret key for signing JWT tokens
JWT_SECRET=a_very_strong_and_long_secret_key

# Optional: API keys for external services
EMAIL_USER=vaish1234yupp@gmail.com
EMAIL_PASS=
# GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Frontend (`/frontend/.env`)

Create a `.env` file in the `/frontend` directory and add the following variable.

```bash
# /frontend
NEXT_PUBLIC_API_URL=http://localhost:3000

#  /backend
Backend_URL_API=http://localhost:4000/api
GraphQl_URL_API=http://localhost:4000/graphql

```
---

## 🏃 Running the Application

### Backend Server

To start the backend server, navigate to the `/backend` directory and run:

```bash
npm run dev 
```
The server will start on the port specified in your `.env` file (e.g., `http://localhost:4000`).

### Frontend Development Server

To start the frontend React application, navigate to the `/frontend` directory and run:

```bash
npm run dev 
```
The application will open in your browser at `http://localhost:3000`.

---

## 🚀 Future Scope  
- AI-powered smart buddy recommendations.  
- Trip expense tracking with auto cost-split.    
- Community forums for travelers.  
---
