#!/usr/bin/env python3
"""
Mock OCR Service for LibreChat
This service mimics the Mistral OCR API but routes files to your RAG API instead
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import httpx
import asyncio
import uvicorn
import os

app = FastAPI(title="Mock OCR Service", version="1.0.0")

# Configuration
RAG_API_URL = os.getenv("RAG_API_URL", "http://rag_api:8000")
RAG_EMBED_ENDPOINT = f"{RAG_API_URL}/embed"

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "mock-ocr"}

@app.post("/v1/files")
async def process_file(file: UploadFile = File(...)):
    """
    Mock OCR endpoint that forwards files to RAG API
    Compatible with Mistral OCR API format
    """
    try:
        # Read file content
        content = await file.read()
        
        # Forward to RAG API
        async with httpx.AsyncClient(timeout=30.0) as client:
            files = {"file": (file.filename, content, file.content_type)}
            
            response = await client.post(
                RAG_EMBED_ENDPOINT,
                files=files
            )
            
            if response.status_code == 200:
                # Return in Mistral OCR API format
                return JSONResponse(
                    content={
                        "id": f"file_{file.filename}",
                        "object": "file",
                        "filename": file.filename,
                        "bytes": len(content),
                        "created_at": int(asyncio.get_event_loop().time()),
                        "purpose": "assistants",
                        "status": "processed",
                        "text_content": f"File {file.filename} processed successfully via RAG API"
                    },
                    status_code=200
                )
            else:
                raise HTTPException(
                    status_code=500, 
                    detail=f"RAG API error: {response.text}"
                )
                
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing file: {str(e)}"
        )

@app.post("/v1/chat/completions")
async def mock_completions():
    """Mock completions endpoint (not used but may be expected)"""
    return JSONResponse(
        content={
            "choices": [{"message": {"content": "File processed via RAG API"}}]
        }
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
