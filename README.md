# IFSC Service

A simple backend service built with **Node.js**, **Express.js**, **TypeScript**, **Mongoose**, and **Redis** to provide **IFSC (Indian Financial System Code) details** via an API.

The service integrates with external APIs (e.g., Razorpay’s IFSC API) to fetch bank details, stores them in MongoDB for persistence, and uses Redis caching for faster responses.

---

## 🚀 Features

- Fetch bank details using an IFSC code.
- External API integration (Razorpay IFSC API).
- MongoDB storage for persistence of IFSC details.
- Smart data retrieval:
  - Returns from database if recent (configurable expiry).
  - Falls back to external API if outdated or missing.
- Redis caching with short TTL for faster response times.
- Extensible design to support multiple external IFSC providers.

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js** – Backend framework.
- **TypeScript** – Strong typing and maintainability.
- **MongoDB (Mongoose)** – Database for storing IFSC details.
- **Redis** – In-memory cache for fast lookups.
- **Axios** – For external API calls.
- **Dotenv** – For environment configuration.

---

## 📂 Project Structure

```
├── src/
│ ├── config/ # Environment and Redis/MongoDB setup
│ ├── controllers/ # Route controllers
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Express routes
│ ├── services/ # IFSC service logic (API, DB, cache)
│ └── middleware/ # error middleware
│ └── utils/ # api constants data
│ └── index.ts # Entry point
├── .env # Environment variables
├── package.json
├── tsconfig.json

```


---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ifsc-service.git
cd ifsc-service
```

### 2. Install dependencies
```bash
npm install
```
### 3. Configure environment
Create a .env file in the root with:
```bash
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ifsc
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password

CACHE_TTL=60          # Redis TTL in seconds
DB_EXPIRY_DAYS=7      # Number of days before refreshing DB entry
```

### 4. Run in development
```bash
npm run dev
```

### 5. Build and run in production
```bash
npm run build
npm start
```
## 📡 API Endpoints

**Get IFSC Details**
```bash
GET http://localhost:port/api/ifsc/:code
```

**Response Example**
```json
{
  "ifsc": "HDFC0CAGSBK",
  "bank": "HDFC BANK",
  "branch": "AGRA",
  "address": "123 Main Road, Agra",
  "city": "Agra",
  "state": "Uttar Pradesh",
  "source": "cache"   // can be "cache", "db", or "external"
}
```
## 🔮 Future Improvements

- Add support for multiple IFSC providers beyond Razorpay.
- Implement request throttling & rate limiting.
- Add Swagger/OpenAPI documentation.
- Deploy to cloud (AWS/GCP/Heroku) with CI/CD pipeline.
- Add unit and integration tests (Jest).
- Add monitoring & logging (Winston/ELK).
