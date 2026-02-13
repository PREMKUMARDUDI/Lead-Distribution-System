# Lead Distribution System - Intelligent Sales CRM

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://lead-distribution-system.vercel.app/)

A comprehensive full-stack CRM platform built with the MERN stack, offering intelligent automation for sales teams. It features automated Round-Robin lead distribution, bulk CSV processing, and dynamic workload re-balancing to ensure fair and efficient sales operations.

## 🚀 Features

### Core CRM Features

- **Smart Distribution Engine**: Automated Round-Robin algorithm that distributes incoming leads equally among available agents
- **Agent Management**: Create, monitor, and manage sales agents with real-time performance tracking
- **Master Lead View**: Global administration panel to view, filter, and manage every lead in the system
- **Secure Authentication**: JWT-based secure login system for administrative access
- **Bulk Data Processing**: High-performance CSV import system capable of parsing thousands of leads instantly

### Advanced Features

- **Dynamic Re-Balancing**: Automatically reshuffles existing leads when new agents join to ensure fair workload
- **Smart Deletion Logic**: "Fail-safe" deletion that automatically redistributes a deleted agent's leads to the remaining team
- **Cascading Cleanup**: Deleting a lead surgically removes itself from the associated agent from all agents
- **Real-time Updates**: Instant reflection of lead assignment changes across the dashboard
- **Creator-Only Deletion**: Enforces strict ownership protocols where agents and leads can _only_ be deleted by the administrator who created them.
- **Optimized Performance**: Implements React Context API (`DataContext`) to manage global state, eliminating redundant API calls and ensuring instant data availability during page navigation.

## 🏗️ Architecture

### System Design

```
┌────────────┐        HTTP/REST API       ┌──────────────┐
│   React    │     ◄──────────────────►   │  Express.js  │
│  Frontend  │       (Axios Client)       │   Backend    │
│   (Vite)   │                            │  (Node.js)   │
└────────────┘                            └──────────────┘
       │                                         │
       │                                         │
  ┌────▼────┐                               ┌────▼─────┐
  │ Vercel  │                               │ MongoDB  │
  │ Hosting │                               │ Database │
  └─────────┘                               └──────────┘
```

### Technology Stack

#### Frontend (React + Vite)

- **Framework**: React with Vite for lightning-fast build performance
- **State Management**: React Hooks (`useState`, `useEffect`) for efficient local state handling
- **HTTP Client**: Axios for secure API communication
- **Routing**: React Router DOM for client-side navigation
- **Styling**: Custom CSS with responsive design principles
- **Architecture**: Component-driven development with isolated page logic

#### Backend (Express.js)

- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM for strict schema validation
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Processing**: `csv-parser` and `fs` streams for memory-efficient bulk data handling
- **Security**: CORS configuration and environment variable protection
- **Architecture**: MVC (Model-View-Controller) pattern

## 📁 Project Structure

```bash
LeadDistributionSystem/
├── backend/                          # Express.js API server
│   ├── controllers/                  # Request handlers
│   │   ├── agentController.js        # Agent creation & distribution logic
│   │   ├── leadController.js         # Master lead management
│   │   ├── fileController.js         # CSV handling & cascading delete
│   │   └── userController.js         # Admin authentication
│   ├── models/                       # MongoDB models
│   │   ├── Agent.js                  # Agent schema with lead references
│   │   ├── Lead.js                   # Lead schema with source tracking
│   │   ├── FileLog.js                # Upload history log
│   │   └── User.js                   # Admin user credentials
│   ├── routes/                       # API route definitions
│   │   ├── agentRoutes.js            # Agent management endpoints
│   │   ├── leadRoutes.js             # Lead management endpoints
│   │   └── fileRoutes.js             # File upload endpoints
│   ├── uploads/                      # Temporary storage for CSV processing
│   ├── server.js                     # Server entry point
│   └── package.json                  # Backend dependencies
├── frontend/                         # React application
│   ├── src/
│   │   ├── context/                  # Context API for Global State
│   │   │   └── DataContext.jsx       # Centralized Data Provider
│   │   ├── pages/                    # Application Views
│   │   │   ├── Login.jsx             # Admin authentication
│   │   │   ├── Dashboard.jsx         # Main control panel
│   │   │   ├── AllAgents.jsx         # Agent list & workload view
│   │   │   ├── AllLeads.jsx          # Master lead database view
│   │   ├── App.jsx                   # Main routing configuration
│   │   └── main.jsx                  # React entry point
│   ├── public/                       # Static assets
│   └── package.json                  # Frontend dependencies
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Admin authentication and token generation

### Agent Management

- `POST /api/agents` - Create new agent (Triggers Auto-Redistribution)
- `GET /api/agents` - Fetch all agents with populated lead data
- `DELETE /api/agents/:id` - Delete agent and redistribute their leads

### Data Management

- `POST /api/upload` - Upload CSV file and distribute leads via Round-Robin

### Lead Control

- `GET /api/leads` - Fetch master list of all leads in the system
- `DELETE /api/leads/:id` - Delete a specific lead and remove from assigned agent

## 📊 Database Schema

### User Model

```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
}
```

### Agent Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  mobile: String (required),
  password: String (hashed),
  leads: [{ type: ObjectId, ref: 'Lead' }],
  createdBy: { type: ObjectId, ref: 'User', required: true }
  createdAt: Date
}
```

### Lead Model

```javascript
{
 firstName: String (required),
  phone: String (required),
  notes: String,
  assignedAgent: { type: ObjectId, ref: 'Agent' },
  createdBy: { type: ObjectId, ref: 'User', required: true }
  createdAt: Date
}
```

## 🌐 Deployment

The application is deployed with a modern cloud infrastructure:

- **Frontend**: Vercel platform for optimal React performance
- **Backend**: Render (Node.js) hosting with environment configuration
- **Database**: MongoDB Atlas for scalable cloud storage

The application's frontend is deployed on **Vercel** with its backend deployed on **Render** platform:

- **Frontend**: `https://lead-distribution-system.vercel.app/`
- **Backend API**: `https://lead-distribution-system-backend.onrender.com`

### Production Features

- **Environment Management**: Separate development and production configurations
- **File Upload Handling**: Secure local storage processing for CSVs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Error Handling**: Comprehensive error management and graceful failure states

## 🧪 Key Features Demonstration

### Automated Workload Balancing

- **Round-Robin Assignment**: Ensures no agent is overwhelmed while others are idle.
- **Fairness Logic**: Mathematical distribution ensures near-perfect equality (e.g., 10 leads ÷ 3 agents = 4, 3, 3).

### Smart Data Lifecycle

- **Purge**: Deleting a batch cleanly removes all traces from the system without leaving "orphan" data.

## 👨‍💻 Author

**Prem Kumar Dudi**

- GitHub: [@PREMKUMARDUDI](https://github.com/PREMKUMARDUDI)
- LinkedIn: [Connect with me](https://linkedin.com/in/dudipremkumar)

## 🙏 Acknowledgments

- React community for excellent component libraries
- MongoDB team for the flexible database solution
- Open source community for continuous learning

---

⭐ **Star this repository if you found it helpful!**

_Automating sales operations with intelligent code_
