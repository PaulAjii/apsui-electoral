# APSUI Electoral System 🗳️

## Overview
The APSUI Electoral System is a sophisticated, high-performance voting application designed for the Association of Pharmaceutical Students (University of Ibadan). Built with **Vue 3**, **Vite**, and **Pinia**, this platform streamlines the electoral process through secure voter authentication, dynamic candidate management, and an intuitive polling interface. The project utilizes **GSAP** for fluid animations and **Axios** for robust API communication, ensuring a professional user experience for both students and administrators.

## Features
- **Secure Authentication**: Specialized login system requiring a password reset upon first-time entry to ensure voter account ownership.
- **Dynamic Polling Engine**: Intelligent voting logic that handles varied position requirements, including a multi-vote system for Senate positions (up to 3 selections).
- **Administrative Dashboard**: Complete CRUD operations for candidate management, including image uploads and profile editing.
- **Real-time Statistics**: Interactive progress bars and data grids displaying voter turnout, verification status, and participation levels across different academic levels.
- **Role-Based Access Control (RBAC)**: Distinct views and permissions for Voters and Administrators, protecting sensitive electoral actions.
- **State Persistence**: Pinia-powered state management with localStorage synchronization to prevent data loss during session interruptions.

## Getting Started

### Installation
Follow these steps to set up the development environment locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/PaulAjii/apsui-electoral
   cd apsui-electoral/client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a configuration in `src/config/index.js` or ensure the API URL matches your backend environment:
   ```javascript
   // src/config/index.js
   apiUrl: 'https://your-api-endpoint.com/api/v1/'
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

## Usage
The application serves two primary user groups with distinct workflows:

### For Voters
- **Authentication**: Log in using your Matric Number. If it is your first time, you will be automatically redirected to the Reset Password page.
- **Profile**: View your eligibility status and track general voting statistics.
- **Voting**: Access the Poll page to cast votes. The system tracks your progress through different positions (President, VP, Senate, etc.).
- **Submission**: Review your choices and submit. Once submitted, the system locks your profile from further voting attempts.

### For Administrators
- **Candidate Management**: Use the 'Candidates' tab to add new contestants, upload photos, and update catchphrases.
- **Voter Monitoring**: Access the 'All Voters' view to track live registration metrics and identify verified vs. unverified students.

## API Documentation
The client interacts with a backend REST API. Below are the core integration points found in `src/services/apiServices.js`:

### Authentication
**User Login**
- **Endpoint**: `POST /login`
- **Request Body**:
  ```json
  {
    "studentId": "234612",
    "password": "yourpassword"
  }
  ```

**Password Reset**
- **Endpoint**: `POST /password-reset`
- **Request Body**:
  ```json
  {
    "studentId": "234612",
    "newPassword": "SecurePassword123"
  }
  ```

### Voting & Candidates
**Fetch All Candidates**
- **Endpoint**: `GET /candidates`
- **Response**: Array of candidate objects including names, positions, and image URLs.

**Cast Votes**
- **Endpoint**: `POST /vote/cast`
- **Payload Structure**:
  ```json
  {
    "votes": [
      {
        "position": "Senate",
        "candidateIds": ["id1", "id2", "id3"]
      },
      {
        "position": "President",
        "candidateIds": ["id4"]
      }
    ]
  }
  ```

## Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Vue 3** | Core Framework (Composition API) |
| **Vite** | Build Tooling & HMR |
| **Pinia** | Global State Management |
| **GSAP** | Motion Design & UI Animations |
| **Axios** | HTTP Client for API Requests |
| **Vue Router** | Single Page Application Navigation |
| **OhVueIcons** | Scalable Vector Graphics |

## Contributing
Contributions are welcome to enhance the security and efficiency of the electoral platform.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## Author Info
- **Developer**: Paul Ajii
- **GitHub**: [PaulAjii](https://github.com/PaulAjii)
- **LinkedIn**: [Your LinkedIn Username]
- **Twitter**: [Your Twitter Username]

---

![Vue3](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)