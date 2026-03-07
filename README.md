# Analytik

## Vision
AI research infrastructure platform that helps labs analyze experimental data, learn from past results, catch hidden problems, and propose smarter next experiments. An AI lab partner that gets smarter the more experiments a lab runs.

## What It Does
Upload experiment data (CSV/JSON) → Gemini analyzes it → researcher chats with AI about findings.

## Stack
- Next.js 14, App Router, TypeScript
- Tailwind CSS
- google-genai SDK (Gemini 2.0 Flash)
- localStorage for persistence (no database)

## File Structure
- `src/lib/types.ts` — Experiment and ChatMessage types
- `src/lib/gemini.ts` — Gemini client (analyzeExperiment, chatWithExperiment)
- `src/app/layout.tsx` — Root layout with nav
- `src/app/page.tsx` — Landing page
- `src/app/experiments/page.tsx` — Experiment list (reads localStorage)
- `src/app/experiments/new/page.tsx` — Upload page
- `src/app/experiments/[id]/page.tsx` — Experiment detail (analysis + chat)
- `src/components/FileUpload.tsx` — File upload → analyze → save → redirect
- `src/components/AnalysisResult.tsx` — Renders analysis output
- `src/components/ChatWindow.tsx` — Chat interface for experiment
- `src/app/api/analyze/route.ts` — POST: analyze experiment data
- `src/app/api/chat/route.ts` — POST: chat about experiment

## Key Details
- Model: gemini-2.0-flash
- API key env var: GEMINI_API_KEY
- localStorage key: "analytik-experiments"
- Analysis sections: Key Findings, Invisible Architecture, Hidden Problems, Proposed Next Experiments