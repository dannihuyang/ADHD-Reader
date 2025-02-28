# ADHD Reader

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
    - [API Setup](#api-setup)
    - [Client Setup](#client-setup)
- [Development](#development)
  - [Running the Application](#running-the-application)
  - [Testing](#testing)
- [Project Structure](#project-structure)
- [Security Notes](#security-notes)
- [Known Issues](#known-issues)

## Overview
ADHD Reader is an innovative web application designed to enhance reading accessibility and efficiency for individuals with ADHD or anyone struggling with traditional reading tools. The application leverages the GPT-4o-mini model to automatically highlight and categorize text content, helping users maintain focus and improve comprehension of written material.

## Features
- 🤖 **AI-Powered Analysis**: Utilizes GPT-4o-mini for text analysis and categorization

  ![Create Document](./images/create_document.png)
  *Creating new documents with smart categorization*

  

- 🎨 **Smart Highlighting**: Automatic highlighting of key concepts



  ![Category Highlighting](./images/category%20highlighting.png)
  - ✅ **Dynamic Color System**: Highlights update instantly when category colors change
  - ✅ **Enhanced Text Styling**: First letter capitalization and bold styling for better readability
  - ✅ **Toggle Functionality**: Smooth transition between showing and hiding highlights
  - ✅ **Category Management**: Edit category names to show different highlights according to user's needs and learning style
 ![Customized Highlighting](./images/customized%20highlighting.png)

- 📚 **Document Management**: Comprehensive system for managing reading materials
  ![Document List](./images/document_list.png)
  *Document management interface*


- 🔐 **Secure Authentication**: User authentication and data protection
- 💡 **Interactive Demo**: Homepage demonstration of key features
  ![Front Page](./images/frontpage.png)
 

- 📱 **Responsive Design**: Adapts seamlessly to desktops, tablets, and phones


## Technical Architecture
### Frontend
- Framework: React
- Development Server: Vite
- URL: http://localhost:5173

### Backend
- Runtime: Node.js
- Framework: Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT, bcrypt
- URL: http://localhost:3001

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)

### Installation Steps

#### API Setup
```bash
# Navigate to API directory
cd api

# Install dependencies
npm install

# Configure environment
Update `.env` with your settings:

# Update .env with your settings:
DATABASE_URL="postgresql://username:password@localhost:5432/adhd_reader"
JWT_SECRET="your-secret-key"
PORT=3001
- ** copy the openai api key from .env // temporary for development

# Run database migrations
npx prisma migrate dev
```

#### Client Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Check Configure environment

# Update .env with:
VITE_API_URL="http://localhost:3001"
```

## Development

### Running the Application
1. Start the API server:
   ```bash
   cd api
   npm run dev
   ```

2. Start the client development server:
   ```bash
   cd client
   npm run dev
   ```



#### Manual Testing Checklist
1. Register a new account
2. Log in with credentials
3. Try the homepage demo
4. Create a new document
5. Test highlighting features
6. Verify category management

## Project Structure
```
adhd-reader/
├── api/                   # Backend API
│   ├── src/               # Source files
│   ├── prisma/            # Database schema and migrations
│ 
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── config/       # Configuration files
│   │   └── utils/        # Utility functions
│ 
└── accessibility_reports/
```

## Security Notes
- Currently using an open API key for development
- Future improvements planned:
  - Environment variable implementation
  - Secret management solutions
  - Enhanced authentication security

## Known Issues
- Limited to local development environment
- Demo data resets on server restart
- Basic API key security needs enhancement
