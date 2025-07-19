# LibreChatLab - Personal AI Chat Configuration

A curated collection of custom configurations, security enhancements, and documentation for running a personal LibreChat instance.

## 🎯 Purpose

This repository contains **only the custom modifications** for a personal LibreChat deployment, without the full LibreChat codebase. Use these files to enhance your own LibreChat installation.

## 📁 Contents

### Core Configuration
- **`librechat.yaml`** - Optimized multimodal configuration for RTX 4080 16GB VRAM
- **`rag.yml`** - Vector database and RAG services setup
- **`docker-compose.yml`** - Custom Docker configuration

### Security Enhancements
- **`api/middleware/rateLimiter.js`** - Comprehensive rate limiting
- **`api/utils/pathValidator.js`** - Path traversal protection
- **Security patches** for CodeQL vulnerabilities

### Documentation & Guides
- **`CLAUDE.md`** - AI assistant guidance for the codebase
- **`VECTOR_SETUP.md`** - Complete vector database setup guide
- **`SECURITY_FIXES.md`** - Security vulnerability analysis and fixes
- **`mock_ocr.py`** - Mock OCR service for testing

## 🚀 Quick Start

1. **Install LibreChat** following the [official documentation](https://docs.librechat.ai)

2. **Apply these configurations**:
   ```bash
   # Copy configuration files
   cp librechat.yaml /path/to/your/librechat/
   cp rag.yml /path/to/your/librechat/
   
   # Apply security middleware
   cp -r api/middleware/ /path/to/your/librechat/api/
   cp -r api/utils/ /path/to/your/librechat/api/
   ```

3. **Configure your environment**:
   - Update `.env` with your API keys
   - Modify `librechat.yaml` with your specific model endpoints
   - Set up vector database using `VECTOR_SETUP.md`

## 🔧 Key Features

### AI Model Configuration
- **Multiple Ollama endpoints** optimized for different use cases
- **Multimodal support** with various parameter sizes
- **Memory-optimized** for RTX 4080 16GB VRAM

### Security Hardening
- **Rate limiting** on all API endpoints
- **Path traversal protection** for file operations
- **ReDoS vulnerability fixes** in regex patterns
- **Input validation** and sanitization

### Vector Database & RAG
- **PostgreSQL + pgvector** for semantic search
- **File processing** with multiple format support
- **Memory management** for conversation context

## 📊 Model Configurations

### Multimodal Models (Vision + Text)
- **qwen2.5vl:72b** - Flagship multimodal (like GPT-4V)
- **qwen2.5vl:7b** - Balanced multimodal (like Claude 3)
- **qwen2.5vl:3b** - Fast multimodal (like Gemini Flash)

### Specialized Models
- **qwen2.5-coder:32b** - Advanced coding (like GitHub Copilot)
- **gemma3:27b** - Google's flagship model
- **qwen2.5:3b** - Ultra-fast text processing

## 🔒 Security Features

- ✅ **Rate limiting** (auth: 5/15min, API: 100/15min, files: 50/15min)
- ✅ **Path validation** prevents directory traversal attacks
- ✅ **ReDoS protection** with regex length limits
- ✅ **Input sanitization** on all endpoints
- ✅ **No sensitive data** exposed in repository

## 🛠️ Installation Notes

### Prerequisites
- LibreChat base installation
- Docker and Docker Compose
- GPU with sufficient VRAM for your chosen models

### Environment Variables
Set these in your `.env` file:
```bash
RAG_PORT=8000
RAG_API_URL=http://localhost:8000
POSTGRES_DB=mydatabase
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
```

## 📚 Documentation

- **`CLAUDE.md`** - Complete project guidance for AI assistants
- **`VECTOR_SETUP.md`** - Step-by-step RAG setup instructions
- **`SECURITY_FIXES.md`** - Detailed security analysis and fixes

## 🤝 Contributing

This is a personal configuration repository. Feel free to:
- Fork for your own modifications
- Submit issues for configuration questions
- Share improvements via pull requests

## 📄 License

These configurations are provided as-is for educational and personal use. The underlying LibreChat project has its own license terms.

## 🔗 Related Projects

- **LibreChat**: [github.com/danny-avila/LibreChat](https://github.com/danny-avila/LibreChat)
- **Official Docs**: [docs.librechat.ai](https://docs.librechat.ai)

---

**Note**: This repository contains only configuration files and enhancements. You need a separate LibreChat installation to use these configurations.