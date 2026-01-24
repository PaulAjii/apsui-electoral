# APSUI Electoral System 🗳️

A robust, secure, and modern digital electoral platform designed for the Association of Physiotherapy Students, University of Ibadan (APSUI). This full-stack application enables seamless voting experiences, administrative management of candidates, and real-time election result visualization with complete transparency and security.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [Author](#author)

---

## 🎯 Overview

APSUI Electoral System is a comprehensive election management platform built with modern web technologies. It provides:

- **Voters**: A secure, intuitive interface to cast ballots with real-time vote tracking
- **Administrators**: Complete control over candidate management and voter oversight
- **Community**: Transparent access to live election results with detailed breakdowns

The system implements strict academic level-based constraints, secure JWT authentication, and advanced data aggregation to ensure election integrity while maintaining user privacy.

---

## ✨ Features

### Voter Features

- **Secure Authentication**: JWT-based login with mandatory first-time password resets
- **Intuitive Voting Interface**: Structured poll system with complex voting logic
  - Single-vote positions (President, Vice President, etc.)
  - Multi-vote Senate elections (up to 3 votes) with class-level filtering
- **Personal Dashboard**: View voting status and class-wide statistics
- **Live Results**: Real-time election result visualization with vote counts and percentages

### Admin Features

- **Candidate Management**: Full CRUD operations for candidates
  - Add candidates with automated asset upload via Cloudinary
  - Edit candidate profiles and catchphrases
  - Delete candidates with confirmation
  - Image management for candidate profiles
- **Voter Oversight**:
  - View comprehensive voter list with filtering and search
  - Monitor voter verification status
  - Track voting completion rates
  - Class-level statistics and breakdowns
- **Results Dashboard**: Real-time election results with detailed analytics
  - Position-wise vote aggregation
  - Candidate vote counts and percentages
  - Level-specific vote breakdowns
  - Winner highlighting

### System Features

- **Level-Based Constraints**: Ensures candidates only contest valid positions for their academic level
- **Advanced Data Aggregation**: MongoDB pipelines for real-time result calculations
- **High-Performance UI**: GSAP animations and smooth interactions
- **Responsive Design**: Mobile-first design for all devices
- **Real-time Notifications**: Toast notifications for user feedback

---

## 📁 Project Structure

```
apsui-electoral/
├── client/                    # Vue.js 3 Frontend Application
│   ├── src/
│   │   ├── components/       # Reusable Vue components
│   │   ├── views/            # Page components
│   │   ├── router/           # Vue Router configuration
│   │   ├── store/            # Pinia state management
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Utility functions
│   │   └── assets/           # Images and styles
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── server/                    # Node.js/Express Backend Application
│   ├── config/               # Configuration files
│   ├── controllers/          # Route handlers
│   ├── models/               # Mongoose schemas
│   ├── middlewares/          # Express middlewares
│   ├── router/               # API routes
│   ├── utils/                # Helper utilities
│   ├── db/                   # Database related files
│   ├── package.json
│   ├── app.js                # Express app setup
│   ├── populate.js           # Database seeding script
│   └── README.md
│
└── README.md                 # This file
```

---

## 🛠 Tech Stack

### Frontend

| Technology                                                           | Purpose                                   |
| :------------------------------------------------------------------- | :---------------------------------------- |
| [Vue.js 3](https://vuejs.org/)                                       | Core frontend framework (Composition API) |
| [Pinia](https://pinia.vuejs.org/)                                    | State management                          |
| [Vite](https://vitejs.dev/)                                          | Build tool & dev server                   |
| [Vue Router](https://router.vuejs.org/)                              | Client-side routing                       |
| [Axios](https://axios-http.com/)                                     | HTTP client                               |
| [GSAP](https://greensock.com/gsap/)                                  | UI animations                             |
| [Vue Toastification](https://github.com/Maronato/vue-toastification) | Notifications                             |

### Backend

| Technology                                    | Purpose             |
| :-------------------------------------------- | :------------------ |
| [Node.js](https://nodejs.org/)                | Runtime environment |
| [Express.js](https://expressjs.com/)          | Web framework       |
| [MongoDB](https://www.mongodb.com/)           | NoSQL database      |
| [Mongoose](https://mongoosejs.com/)           | ODM for MongoDB     |
| [JWT](https://jwt.io/)                        | Authentication      |
| [Cloudinary](https://cloudinary.com/)         | Image hosting       |
| [Multer](https://github.com/expressjs/multer) | File uploads        |

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for image uploads)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/PaulAjii/apsui-electoral
cd apsui-electoral
```

### Step 2: Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/apsui_electoral
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_super_secret_key
JWT_LIFETIME=1d
EOF

# (Optional) Seed the database with initial voter data
node populate.js
```

### Step 3: Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api/v1
EOF
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
cd server
npm run dev
```

The API will be available at `http://localhost:5000`

### Terminal 2: Start Frontend Dev Server

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal)

### Access the Application

1. **Voter Login**: Use any valid student ID with initial password as the student ID
2. **Admin Access**: Ensure user has `role: 'admin'` in the database
3. **First-time Users**: Will be prompted to reset password on first login

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "studentId": "2024001",
  "password": "initialPassword"
}
```

**Response**: User object + JWT token

#### Password Reset

```http
POST /auth/password-reset
Content-Type: application/json

{
  "studentId": "2024001",
  "newPassword": "NewPassword123"
}
```

### Candidate Endpoints

#### Get All Candidates

```http
GET /candidates
Authorization: Bearer <token>
```

#### Create Candidate (Admin Only)

```http
POST /candidates
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "studentId": "2024005",
  "position": "President",
  "gender": "Female",
  "catchPhrase": "Your catchphrase here",
  "image": <file>
}
```

#### Update Candidate (Admin Only)

```http
PATCH /candidates/:id
Authorization: Bearer <token>
```

#### Delete Candidate (Admin Only)

```http
DELETE /candidates/:id
Authorization: Bearer <token>
```

### Voting Endpoints

#### Cast Vote

```http
POST /vote/cast
Authorization: Bearer <token>
Content-Type: application/json

{
  "votes": [
    {
      "position": "President",
      "candidateIds": ["candidateId"]
    },
    {
      "position": "Senate",
      "candidateIds": ["candId1", "candId2", "candId3"]
    }
  ]
}
```

#### Get Results

```http
GET /vote/results
Authorization: Bearer <token>
```

**Response**: Results grouped by position with candidate vote counts and level breakdown

### User Endpoints

#### Get All Voters (Admin Only)

```http
GET /users
Authorization: Bearer <token>
```

#### Get Voter Details

```http
GET /users/:studentId
Authorization: Bearer <token>
```

For detailed endpoint documentation, see [server/README.md](server/README.md)

---

## 👥 Usage Guide

### For Voters

1. **Login**
   - Navigate to the login page
   - Enter your Matric Number (Student ID)
   - Use your Matric Number as the initial password

2. **Reset Password**
   - You'll be prompted to reset your password on first login
   - Set a secure password for future logins

3. **View Candidates**
   - Browse all available candidates
   - Filter by position
   - View candidate details and catchphrases

4. **Cast Votes**
   - Go to the Poll section
   - Select one candidate for executive positions
   - Select up to 3 candidates for Senate (filtered by your level)
   - Confirm and submit your votes

5. **View Results**
   - Navigate to Results section
   - View real-time vote counts and percentages
   - Expand candidates to see level-specific breakdowns

### For Administrators

1. **Login with Admin Account**
   - Use your admin credentials

2. **Manage Candidates**
   - Go to Candidates section
   - Add new candidates with profile images
   - Edit candidate information
   - Remove candidates as needed

3. **Monitor Voters**
   - Go to Voters section
   - View all registered voters
   - Check verification status
   - Monitor voting completion rates

4. **View Results**
   - Access Results dashboard
   - Analyze vote distribution
   - View class-level breakdowns
   - Monitor voting progress

---

## 🤝 Contributing

Contributions are welcome and help improve the transparency of the electoral process!

1. **Fork the repository**

   ```bash
   git clone https://github.com/PaulAjii/apsui-electoral.git
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your changes**

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

---

## 👨‍💻 Author

**Paul Ajii**

- **GitHub**: [PaulAjii](https://github.com/PaulAjii)
- **Email**: [Your email]
- **LinkedIn**: [Your LinkedIn]
- **Twitter**: [Your Twitter]

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Vue.js Community](https://vuejs.org/)
- [Express.js Community](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- The APSUI community for their support and feedback

---

## 📞 Support

For issues, questions, or suggestions:

1. Open an issue on GitHub
2. Contact the author directly
3. Submit a pull request with proposed changes

---

<div align="center">

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

**Made with ❤️ by Paul Ajii**

</div>
