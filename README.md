# Milan - Premium Matchmaking Portal (Internal Dashboard MVP)

Milan is a modern, full-stack B2B admin dashboard built for matchmaking professionals to manage customer profiles, inspect client details, calculate compatible matches based on custom rules, write persistent notes, and generate AI-driven introductory pitches.

---

## 🌐 Live Demo & Credentials

* **Live Demo Hosted Link**: [https://milan-matchmaker-mvp.onrender.com](https://milan-matchmaker-mvp.onrender.com) *(Placeholder)*
* **Sample Admin Credentials**:
  * **Username**: `admin`
  * **Password**: `admin`

---

## 📝 The Write-Up (Core Evaluation Criteria)

The Milan Matchmaking Portal is built on the MERN stack (MongoDB, Express, React, and Node.js), which provides a robust, highly performant, and dynamic architecture suited for managing complex relational profile data in real-time. Node.js and Express deliver a lightweight yet resilient REST API to fetch and update clients, while MongoDB's flexible, document-oriented storage enables seamless handling of multi-dimensional profile schemas without the rigid overhead of relational databases. On the frontend, React coordinates component state smoothly, paired with Tailwind CSS to construct an emotionally aligned, clean, and premium user interface featuring soft gradients, subtle micro-animations, and visual cues (such as status badges and pulsing search indicators) that elevate the administrative experience.

To facilitate relevant introductions, Milan features a custom, gender-specific matching engine built directly into the backend API. When finding candidate suggestions for a male client, the algorithm queries the database for opposite-gender (female) profiles and applies selective filters targeting women who are younger, shorter in height, earn a lower annual income, and share the same views on starting a family (matching the `wantKids` field). Conversely, when searching for matches for a female client, the matching engine switches to a compatibility-driven approach, checking for mutual alignment in professional paths (same company or matching job designation), shared lifestyle values (identical dietary preferences and family structures), and relocation compatibility to ensure long-term lifestyle harmony.

Generative AI is seamlessly woven into the matchmaking workflow to automate personalized communications. By integrating the Google Gemini API (via an OpenAI compatibility layer or the native Google Gen AI SDK), Milan automatically generates short, warm, and highly personalized introductory emails (limited to 150 words) from the matchmaker to the prospective partner. The system automatically reads the detailed profile fields of both individuals, compiles them into a structured prompt, and prompts the AI to highlight specific shared interests, values, and career alignments. If the API key is not configured or the service is temporarily unreachable, the backend smoothly switches to a rule-based mock generator that dynamically builds a comparison email, ensuring that the user experience remains fully functional and uninterrupted.

---

## 💡 Assumptions Made

* **Cultural Context for Indian Matchmaking**: We assume that premium Indian matchmaking requires specific cultural and lifestyle filters to ensure viable matches. Consequently, we added specialized fields such as `dietaryPreferences` (e.g., Vegetarian, Non-Vegetarian, Vegan, Eggetarian) and `familyStructure` (e.g., Joint, Nuclear) to the customer schema.
* **Pre-loaded Pool**: We assume a baseline pool of exactly 100 dummy customer records (50 male, 50 female) is required to showcase the metrics dashboard, live search filters, and matching algorithm. This is handled by a deterministic seed script that populates realistic Indian names, occupations, colleges, and compatibility variables.

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18 or higher)
* **MongoDB** (local community server or a MongoDB Atlas URI)

### 2. Clone and Install Dependencies
Install all root, backend, and frontend dependencies at once using `npm install` and the root helper command:
```bash
# Install root dependencies
npm install

# Install all workspace/sub-folder dependencies
npm run install:all
```

### 3. Environment Variables Configuration
Configure your backend environment variables. Create a `.env` file in the `backend` folder (you can copy from `backend/.env.example` as a starting point):
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and update the values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/matchmaker
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Seed the Database
Run the deterministic seed script to populate your MongoDB database with the initial 100 dummy profiles:
```bash
npm run seed
```

### 5. Start the Application
Run the Express backend API and the Vite frontend dev server concurrently using the root package runner:
```bash
npm run dev
```
The client dashboard will be available at [http://localhost:5173](http://localhost:5173), and the backend API server will run at [http://localhost:5000](http://localhost:5000).

---

## 📂 Key Source Code References

* **Backend Files**:
  * [backend/src/models/Customer.js](file:///home/aryan-kumar/matchmaker-mvp/backend/src/models/Customer.js) — Schema definition with specialized Indian cultural fields.
  * [backend/src/controllers/customerController.js](file:///home/aryan-kumar/matchmaker-mvp/backend/src/controllers/customerController.js) — Contains the gender-specific matching logic [getCustomerMatches](file:///home/aryan-kumar/matchmaker-mvp/backend/src/controllers/customerController.js#L105) and the Gemini API generator function [generateAIIntro](file:///home/aryan-kumar/matchmaker-mvp/backend/src/controllers/customerController.js#L155).
  * [backend/src/scripts/seed.js](file:///home/aryan-kumar/matchmaker-mvp/backend/src/scripts/seed.js) — Seeding script for generating 100 deterministic dummy profiles.
* **Frontend Files**:
  * [frontend/src/components/Login.jsx](file:///home/aryan-kumar/matchmaker-mvp/frontend/src/components/Login.jsx) — Login screen handling `admin`/`admin` credentials.
  * [frontend/src/components/Dashboard.jsx](file:///home/aryan-kumar/matchmaker-mvp/frontend/src/components/Dashboard.jsx) — Main admin view coordinating metrics, search filters, and lists.
  * [frontend/src/components/CustomerList.jsx](file:///home/aryan-kumar/matchmaker-mvp/frontend/src/components/CustomerList.jsx) — Client profiles list view.
  * [frontend/src/components/CustomerDetailedView.jsx](file:///home/aryan-kumar/matchmaker-mvp/frontend/src/components/CustomerDetailedView.jsx) — detailed client inspector, notes editor, and AI email drafter panel.

---

## 🔍 Research & Product Inspiration

Before building Milan, we analyzed both traditional matrimonial platforms and modern dating products to bridge the gap between B2C consumer expectations and professional B2B matchmaking workflows:

1. **Traditional Matrimonial Platforms (Shaadi.com, Jeevansathi, BharatMatrimony)**:
   * *Key Findings*: These services are highly structured, prioritizing objective parameters like family dynamics (joint vs. nuclear), dietary alignments, education level, and income tiers over casual swiping.
   * *Milan Application*: Inspired the addition of specific schema fields like `dietaryPreferences` and `familyStructure`, alongside the deterministic filtering logic where compatibility variables are non-negotiable.

2. **Modern Dating Apps (Hinge, Bumble, Tinder)**:
   * *Key Findings*: Hinge's philosophy focuses heavily on detailed prompt answers and micro-compatibility. Bumble emphasizes a clean, premium visual aesthetic and user-empowered communication.
   * *Milan Application*: Influenced the high-fidelity UI design (glassmorphic cards, soft gradient accents, clean status tags) and the focus on lifestyle compatibility factors (e.g., relocation flexibility, comfort with pets).

3. **B2B Concierge Matchmaking Services (Elite Connections, Offline Matchmakers)**:
   * *Key Findings*: Professional matchmakers operate offline via call logs, private notes, and manually curated introductory emails ("pitches").
   * *Milan Application*: Led to the creation of the **Match Inspector**, **Meeting Notes** database persistence engine, and the **Gemini AI Intro Draft Generator** to eliminate manual email drafting friction.

---

## 👤 Author

**Aryan Kumar**
