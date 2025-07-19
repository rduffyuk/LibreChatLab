# LibreChatLab

This is a personal backup/fork of the [LibreChat](https://github.com/danny-avila/LibreChat) project.

## 🔒 Important Note on Security

This repository is configured to exclude all sensitive files including:
- Environment variables (`.env` files)
- Configuration files (`librechat.yaml`)
- API keys and authentication files
- User data and uploads

## 📝 Custom Modifications

### Added Files

1. **CLAUDE.md** - Project guidance file for Claude Code AI assistant
   - Contains project overview and architecture details
   - Development commands and workflow instructions
   - Helps AI assistants understand the codebase structure

2. **mock_ocr.py** - Mock OCR service for testing
   - Simulates OCR functionality for development
   - Useful for testing file upload and text extraction features

3. **docker-compose.yml** - Modified Docker configuration
   - Custom adjustments for local development environment

## 🚀 Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/rduffyuk/LibreChatLab.git
   cd LibreChatLab
   ```

2. Copy the example environment file and configure:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. Follow the official [LibreChat documentation](https://docs.librechat.ai) for setup instructions

## 📖 Original Project

This is based on the official LibreChat project:
- **Original Repository**: [github.com/danny-avila/LibreChat](https://github.com/danny-avila/LibreChat)
- **Documentation**: [docs.librechat.ai](https://docs.librechat.ai)
- **Website**: [librechat.ai](https://librechat.ai)

## 🔄 Keeping Up to Date

To sync with the upstream repository:

```bash
# Add upstream remote (if not already added)
git remote add upstream https://github.com/danny-avila/LibreChat.git

# Fetch and merge updates
git fetch upstream
git merge upstream/main

# Push to backup
git push backup main
```

## 📝 License

This project follows the same license as the original LibreChat project. See the LICENSE file for details.

---

**Note**: This is a personal backup repository. For the official project, contributions, and issues, please visit the [original LibreChat repository](https://github.com/danny-avila/LibreChat).