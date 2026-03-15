# MedAgent: Healthcare AI Assistant
## Hackathon Judge Documentation

---

## 📋 Project Overview

**MedAgent** is an AI-powered healthcare assistant that provides intelligent medical consultations by combining conversational AI with document analysis and voice interaction. The app acts as a personal doctor who remembers your medical history and engages in natural, human-like conversations.

### Core Vision
Transform healthcare accessibility by providing:
- **Instant medical consultations** without appointment friction
- **Personalized advice** based on user's complete medical history
- **Multiple interaction modes** (text, voice, document upload)
- **Intelligent escalation** to emergency care when needed
- **Long-term health tracking** through persistent health notes

### Problem We're Solving
- Users need quick answers about symptoms but face barriers: appointment wait times, cost, accessibility
- Medical records are scattered and hard to search
- Follow-up appointments are often delayed
- Users struggle to remember and communicate their medical history to doctors

---

## 🏗️ Architecture Overview

### System Diagram
```text
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Chat Page    │  │ Voice Mode   │  │ Documents    │       │
│  │ (Text Input) │  │ (Mic Button) │  │ (Upload)     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────┬──────────────────────────────────────────┬──────┘
             │ HTTP + SSE                               │
┌────────────▼──────────────────────────────────────────▼──────┐
│                    Backend (FastAPI)                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │         Medical Agent (LangChain + Gemini)             │  │
│  │  - Conversational AI                                   │  │
│  │  - Health context awareness                           │  │
│  │  - Escalation detection                               │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │    Document Processing Pipeline                        │  │
│  │  - OCR (extract text from PDFs/images)                 │  │
│  │  - Chunking (512 tokens, 64 overlap)                   │  │
│  │  - Vector Embeddings (768-dim, Google)                 │  │
│  │  - Similarity Search (pgvector)                        │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  API Routes (Authentication + CORS)                    │  │
│  │  /chat        - text conversations                     │  │
│  │  /voice       - audio input/output                     │  │
│  │  /documents   - file uploads + management              │  │
│  │  /health      - health events + notes                  │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────┬──────────────────────────────────────────────┬──┘
             │                                              │
┌────────────▼──────────────────────────────────────────────▼──┐
│                    Data Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ PostgreSQL   │  │ pgvector     │  │ MinIO        │       │
│  │ (Metadata)   │  │ (Embeddings) │  │ (Documents)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
