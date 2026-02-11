# We-The-People-Crowdfunding-Platform
We-The-People is a crowdfunding platform connecting college startups with investors. Built using React, Node.js, and MongoDB, it enables secure fundraising through Razorpay and JWT authentication. Startups showcase ideas, investors fund projects, and users share feedback in a seamless full-stack system.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Payment Gateway**: Razorpay
- **Authentication**: JWT

## Project Structure
```
project-we-the-people/
├── app/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── Context/
│   │   ├── Axios/
│   │   └── utils/
│   ├── package.json
│   └── README.md
├── server/                 # Node.js backend
│   ├── Middleware/
│   ├── Models/
│   ├── Routes/
│   ├── app.js
│   ├── db.js
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── README.md               # This file
└── .gitignore
```

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or cloud like MongoDB Atlas)
- Git

## Installation and Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project-we-the-people
```

### 2. Database Setup
#### Option A: MongoDB Atlas (Cloud)
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster and database
3. Get your connection string

#### Option B: Local MongoDB
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Default connection: `mongodb://localhost:27017/crowdfunding`

### 3. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
JWT_SECRET=your_jwt_secret_here
ACTIVATION_TOKEN_SECRET=your_activation_token_secret_here
PORT=5000
MONGO_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

**Note**: Replace the values with your actual credentials. For development, you can use the provided test values, but for production, generate your own secrets.

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:5000`

### 4. Frontend Setup
```bash
cd ../app
npm install --force
npm start
```
The React app will run on `http://localhost:3000`

### 5. Environment Variables Explanation
- `JWT_SECRET`: Secret key for JWT token generation
- `ACTIVATION_TOKEN_SECRET`: Secret for email activation tokens
- `PORT`: Backend server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `RAZORPAY_KEY_ID` & `RAZORPAY_SECRET`: Razorpay payment gateway credentials

## API Endpoints
- `POST /api/auth/create-user` - User registration
- `POST /api/auth/login` - User login
- `GET /api/investor/fetch-startups` - Get all verified startups
- `POST /api/investor/create-startup` - Create new startup
- And more...

## Features
- User registration and authentication
- Startup creation and management
- Investment tracking
- Review system
- Payment integration with Razorpay



## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request




