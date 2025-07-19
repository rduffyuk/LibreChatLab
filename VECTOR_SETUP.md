# Vector Database & RAG Setup for LibreChatLab

This document outlines the vector database and RAG (Retrieval-Augmented Generation) setup for this LibreChat instance.

## 🗄️ Vector Database Configuration

### PostgreSQL with pgvector Extension

The setup uses PostgreSQL with the pgvector extension for vector storage and similarity search.

**Configuration File**: `rag.yml`

### Services

1. **vectordb** - PostgreSQL with pgvector
   - Image: `ankane/pgvector:latest`
   - Port: `5433:5432` (mapped to avoid conflicts)
   - Database: `mydatabase`
   - User: `myuser`
   - Volume: `pgdata2` for persistence

2. **rag_api** - LibreChat RAG API service
   - Image: `ghcr.io/danny-avila/librechat-rag-api-dev:latest`
   - Connects to vectordb for vector operations
   - Handles file processing and embeddings

## 🚀 Quick Start

### 1. Start Vector Services

```bash
# Start the vector database and RAG API
docker-compose -f rag.yml up -d

# Check status
docker-compose -f rag.yml ps
```

### 2. Verify Vector Database

```bash
# Connect to PostgreSQL
docker exec -it $(docker-compose -f rag.yml ps -q vectordb) psql -U myuser -d mydatabase

# Check pgvector extension
SELECT * FROM pg_extension WHERE extname = 'vector';

# Exit
\q
```

### 3. Test RAG API

```bash
# Check RAG API health (replace with your RAG_PORT)
curl http://localhost:8000/health

# View logs
docker-compose -f rag.yml logs rag_api
```

## 🔧 Environment Variables

Set these in your `.env` file:

```bash
# RAG API Configuration
RAG_PORT=8000
RAG_API_URL=http://localhost:8000

# Vector Database
POSTGRES_DB=mydatabase
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
DB_HOST=vectordb
DB_PORT=5432

# Embedding Provider (choose one)
OPENAI_API_KEY=your_openai_key
# OR
EMBEDDINGS_PROVIDER=local
```

## 📁 File Processing Flow

1. **File Upload** → User uploads document via LibreChat interface
2. **Text Extraction** → RAG API extracts text from various file formats
3. **Chunking** → Text is split into manageable chunks
4. **Embeddings** → Each chunk is converted to vector embeddings
5. **Storage** → Vectors stored in PostgreSQL with pgvector
6. **Retrieval** → Similar chunks retrieved during chat conversations
7. **Context Enhancement** → Retrieved content enhances AI responses

## 🎯 Supported File Types

Based on your `librechat.yaml` configuration:

### Text Files
- `.txt`, `.md`, `.csv`, `.yaml`, `.yml`, `.json`
- `.conf`, `.cfg`, `.log`, `.ini`

### Code Files
- `.py`, `.sh`, `.js`, `.java`

### Documents
- `.pdf`

### Images
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`

## 🛠️ Kubernetes Deployment

For production deployment, Helm charts are available in `/helm/librechat-rag-api/`:

```bash
# Install RAG API with Helm
helm install librechat-rag ./helm/librechat-rag-api
```

Key Kubernetes components:
- **rag-deployment.yaml** - RAG API deployment
- **vectordb-secret.yaml** - Database credentials

## 🔄 Integration with LibreChat

### Agent Configuration

Your `librechat.yaml` includes RAG integration:

```yaml
agents:
  capabilities:
    - "file_search"    # Uses RAG API + vector database
    # "ocr" disabled   # Using RAG instead of OCR
```

### File Handling

```yaml
fileConfig:
  custom:
    fileLimit: 15           # Max files per conversation
    fileSizeLimit: 95       # MB per file
    totalSizeLimit: 750     # MB total per conversation
```

## 🧹 Maintenance

### Backup Vector Data

```bash
# Backup PostgreSQL data
docker exec $(docker-compose -f rag.yml ps -q vectordb) pg_dump -U myuser mydatabase > vector_backup.sql

# Restore
docker exec -i $(docker-compose -f rag.yml ps -q vectordb) psql -U myuser mydatabase < vector_backup.sql
```

### Clear Vector Data

```bash
# Connect to database
docker exec -it $(docker-compose -f rag.yml ps -q vectordb) psql -U myuser -d mydatabase

# Clear all embeddings (use carefully!)
TRUNCATE TABLE documents, embeddings, file_metadata;
```

### Update RAG API

```bash
# Pull latest image
docker-compose -f rag.yml pull rag_api

# Restart service
docker-compose -f rag.yml up -d rag_api
```

## 🔍 Troubleshooting

### Common Issues

1. **RAG API won't start**
   ```bash
   # Check logs
   docker-compose -f rag.yml logs rag_api
   
   # Verify vectordb is running
   docker-compose -f rag.yml ps vectordb
   ```

2. **File uploads failing**
   - Check file size limits in `librechat.yaml`
   - Verify supported MIME types
   - Check RAG API logs for processing errors

3. **Poor search results**
   - Verify embeddings are being created
   - Check chunk size configuration
   - Consider re-processing files

### Monitoring

```bash
# View all logs
docker-compose -f rag.yml logs -f

# Check database connections
docker-compose -f rag.yml exec vectordb psql -U myuser -d mydatabase -c "SELECT COUNT(*) FROM pg_stat_activity;"

# Monitor disk usage
docker system df
docker volume ls
```

## 📊 Performance Notes

### RTX 4080 16GB Optimization

For your RTX 4080 setup:
- Use local embedding models when possible
- Configure appropriate batch sizes for vector operations
- Monitor VRAM usage during file processing

### Vector Search Performance

- Regular database maintenance improves search speed
- Consider indexing strategies for large document collections
- Monitor query response times

---

## 🔗 Related Files

- `rag.yml` - Main vector services configuration
- `librechat.yaml` - LibreChat integration settings
- `.env` - Environment variables
- `/helm/librechat-rag-api/` - Kubernetes deployment charts