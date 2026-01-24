# APSUI Electoral API

## Overview
This is a high-performance voting management system built with Node.js and Express. It utilizes Mongoose for complex data modeling and Cloudinary for candidate asset management, designed specifically to handle university-level elections with strict level-based candidacy restrictions.

## Features
- **JWT Authentication**: Secure stateless authentication with role-based access control for Admins and Voters.
- **Dynamic Result Aggregation**: Advanced MongoDB aggregation pipelines to provide real-time results with level-specific breakdowns.
- **Automated Validation**: Schema-level validation ensuring candidates only contest positions available to their academic level.
- **Asset Management**: Integrated Multer and Cloudinary storage for handling candidate profile imagery.
- **Seeding System**: Custom population scripts for batch-importing voter data with automatic password hashing.

## Getting Started
### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/PaulAjii/apsui-electoral
   ```
2. Navigate to the project directory:
   ```bash
   cd apsui-electoral/server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database (optional):
   ```bash
   node populate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
Create a `.env` file in the root directory and provide the following variables:
```env
PORT=5000
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_super_secret_key
JWT_LIFETIME=1d
```

## API Documentation
### Base URL
`https://<your-domain>/api/v1`

### Endpoints

#### POST /login
**Request**:
```json
{
  "studentId": "2024001",
  "password": "yourpassword"
}
```

**Response**:
```json
{
  "status": "success",
  "user": {
    "_id": "6745...",
    "studentId": "2024001",
    "name": "John Doe",
    "role": "voter",
    "level": "300"
  },
  "token": "eyJhbG..."
}
```

**Errors**:
- 400: All fields are required
- 401: Invalid Credentials
- 404: User not found

#### POST /password-reset
**Request**:
```json
{
  "studentId": "2024001",
  "newPassword": "NewStrongPassword123"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Password updated successfully",
  "user": {
    "studentId": "2024001",
    "isFirstTimeLogin": false
  }
}
```

#### GET /candidates
**Request**:
No payload required.

**Response**:
```json
{
  "status": "success",
  "no_of_candidates": 5,
  "candidates": [
    {
      "_id": "6732...",
      "name": "Jane Smith",
      "position": "President",
      "imageURL": "https://res.cloudinary.com/...",
      "votesCount": 0
    }
  ]
}
```

#### POST /candidates
**Headers**: `Authorization: Bearer <token>` (Admin Only)

**Request**:
```json
{
  "studentId": "2024005",
  "level": "400",
  "position": "President",
  "gender": "Female",
  "name": "Alice Wonderland"
}
```

**Response**:
```json
{
  "status": "success",
  "candidate": {
    "name": "Alice Wonderland",
    "position": "President",
    "gender": "Female"
  }
}
```

**Errors**:
- 400: Level not valid for position / User cannot contest
- 403: Access denied. Admin rights required.

#### POST /vote/cast
**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "votes": [
    {
      "position": "President",
      "candidateIds": ["6732..."]
    },
    {
      "position": "Senate",
      "candidateIds": ["6733...", "6734..."]
    }
  ]
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Vote has been cast successfully"
}
```

**Errors**:
- 400: You have voted already / Maximum of 3 votes for senate
- 403: Can only vote for senate candidates in your level

#### GET /vote/results
**Request**:
No payload required.

**Response**:
```json
{
  "status": "success",
  "results": [
    {
      "_id": "President",
      "candidates": [
        {
          "name": "Alice Wonderland",
          "yesVotes": 45,
          "totalVotes": 45,
          "levelBreakdown": [
            { "level": "400", "yesVotes": 45 }
          ]
        }
      ]
    }
  ]
}
```

## Technologies Used
| Technology | Purpose | Link |
| :--- | :--- | :--- |
| Node.js | Runtime Environment | [Link](https://nodejs.org/) |
| Express.js | Web Framework | [Link](https://expressjs.com/) |
| MongoDB | Database | [Link](https://www.mongodb.com/) |
| Mongoose | ODM | [Link](https://mongoosejs.com/) |
| Cloudinary | Image Hosting | [Link](https://cloudinary.com/) |
| JWT | Authentication | [Link](https://jwt.io/) |

## Contributing
- Fork the repository.
- Create a feature branch: `git checkout -b feature/NewFeature`.
- Commit your changes: `git commit -m 'Add NewFeature'`.
- Push to the branch: `git push origin feature/NewFeature`.
- Open a Pull Request.

## Author Info
- **GitHub**: [PaulAjii](https://github.com/PaulAjii)
- **Twitter**: [Add your username]
- **LinkedIn**: [Add your username]

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)