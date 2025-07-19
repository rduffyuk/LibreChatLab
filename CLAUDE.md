# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LibreChat is a full-stack, open-source AI chat platform built as a monorepo with React frontend and Node.js backend. It supports multiple AI providers (OpenAI, Anthropic, Google, Azure, AWS Bedrock) and includes features like file uploads, search, agents, and real-time messaging.

## Architecture

### Project Structure
```
LibreChat/
├── api/                    # Backend Express server
├── client/                 # React frontend
├── packages/              # Shared libraries
│   ├── data-provider/     # Data access layer
│   ├── data-schemas/      # Database schemas
│   └── api/               # API utilities
├── config/                # Configuration scripts
└── helm/                  # Kubernetes deployment
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recoil state management
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io
- **Testing**: Jest, Playwright E2E
- **Build**: npm workspaces, Vite, Rollup
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## Common Commands

### Development
```bash
# Start frontend dev server (port 3090)
npm run frontend:dev

# Start backend with hot reload (port 3080)
npm run backend:dev

# Build frontend with all dependencies
npm run frontend

# Start production backend
npm run backend
```

### Testing
```bash
# Run client tests
npm run test:client

# Run API tests
npm run test:api

# Run E2E tests
npm run e2e

# Run E2E tests with UI
npm run e2e:headed

# Run accessibility tests
npm run e2e:a11y
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Package Building
```bash
# Build all packages
npm run build:data-provider
npm run build:api
npm run build:data-schemas
```

### User Management
```bash
# Create new user
npm run create-user

# Add user balance
npm run add-balance
```

### Updates
```bash
# Update project
npm run update

# Local update
npm run update:local

# Docker update
npm run update:docker
```

## Architecture Patterns

### Backend (API)
- **Entry Point**: `/api/server/index.js`
- **Controllers**: Handle HTTP requests, located in `/api/controllers/`
- **Services**: Business logic layer in `/api/services/`
- **Models**: Database schemas in `/api/models/`
- **Routes**: RESTful endpoints organized by feature
- **Middleware**: Authentication, validation, rate limiting

### Frontend (Client)
- **Entry Point**: `/client/src/main.jsx`
- **State Management**: Recoil for global state, TanStack Query for server state
- **Routing**: React Router with authentication guards
- **Components**: Feature-based organization
- **Hooks**: Custom hooks for data fetching and state management

### Data Layer
- **Database**: MongoDB with Mongoose ODM
- **Key Collections**: Users, Conversations, Messages, Files, Assistants
- **Search**: MeiliSearch for full-text search
- **Vectors**: PostgreSQL with pgvector for RAG

## Configuration

### Main Config (`librechat.yaml`)
- AI provider endpoints and models
- Interface customization
- File handling rules
- Feature toggles

### Environment Variables (`.env`)
- API keys for AI providers
- Database connections
- Service URLs
- Feature flags

## API Structure

Main REST endpoints:
- `/api/auth` - Authentication
- `/api/messages` - Chat messages
- `/api/convos` - Conversations
- `/api/files` - File operations
- `/api/assistants` - AI assistants
- `/api/models` - AI models
- `/api/endpoints` - Provider endpoints

## Testing Strategy

### Unit Tests (Jest)
- Client tests in `/client/src/` with `.test.js` files
- API tests in `/api/` with `.test.js` files
- Shared packages have their own test suites

### E2E Tests (Playwright)
- Tests in `/e2e/` directory
- Multiple configurations for different scenarios
- Accessibility testing included

## Development Workflow

1. **Setup**: Run `npm install` to install all workspace dependencies
2. **Development**: Use `npm run frontend:dev` and `npm run backend:dev` in separate terminals
3. **Testing**: Run relevant test commands before committing
4. **Code Quality**: Pre-commit hooks automatically run ESLint and Prettier
5. **Building**: Use workspace-specific build commands for packages

## File Organization

### Backend Key Directories
- `/api/controllers/` - Request handlers
- `/api/services/` - Business logic
- `/api/models/` - Database models
- `/api/routes/` - Route definitions
- `/api/middleware/` - Custom middleware
- `/api/strategies/` - Authentication strategies

### Frontend Key Directories
- `/client/src/components/` - React components
- `/client/src/hooks/` - Custom hooks
- `/client/src/store/` - Recoil state management
- `/client/src/utils/` - Utility functions
- `/client/src/data-provider/` - API integration

### Shared Packages
- `/packages/data-provider/` - Data fetching utilities
- `/packages/data-schemas/` - Database schemas and validation
- `/packages/api/` - Shared API utilities

## Key Features

### AI Integration
- Multiple provider support with unified interface
- Custom endpoint configuration
- Model switching within conversations
- Tool calling and function execution

### File Management
- Multiple storage backends (local, S3, Azure Blob, Firebase)
- File processing and OCR
- Vector embeddings for search
- Secure file sharing

### Real-time Features
- WebSocket-based messaging
- Message streaming from AI providers
- Live conversation updates

### Search & Memory
- MeiliSearch integration for full-text search
- Vector search for semantic similarity
- Conversation memory and context
- RAG (Retrieval-Augmented Generation)

## Deployment

### Development
Local development with hot reload on ports 3090 (frontend) and 3080 (backend)

### Production
Docker Compose setup with:
- LibreChat application
- MongoDB database
- MeiliSearch service
- RAG API service
- PostgreSQL with pgvector

### Kubernetes
Helm charts available in `/helm/` directory for scalable deployment