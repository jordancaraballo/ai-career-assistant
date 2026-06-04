# AI Career Assistant

A bootcamp-friendly web application that analyzes a resume against a job description, extracts skills, computes embedding-style similarity, recommends skills to learn, and ranks relevant mock job openings.

## What Students Learn

- NLP: tokenization, normalization, skill extraction, and text comparison.
- Embeddings: turning resume and job text into numeric vectors.
- Vector search: ranking jobs with cosine similarity.
- Web development: file upload, text inputs, DOM updates, canvas charts, responsive UI.
- Software engineering: separating data, analysis logic, rendering, and user workflows.
- UX design: making AI output readable enough for a job seeker to act on.

## Run It

From this folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

The app is fully client-side, so it can also be hosted on GitHub Pages.

## How It Works

1. The resume and job description are normalized and tokenized.
2. A skill taxonomy maps keywords and aliases to career skills.
3. Text is converted into a fixed-length vector with a hashing-based embedding demo.
4. Cosine similarity compares the resume vector, job description vector, and mock job vectors.
5. The UI shows a fit score, detected skills, missing skills, learning recommendations, and mock job matches.

## Upgrade Path

The browser app uses a dependency-free hashing embedding so every student can run it immediately. For a production-style version, replace the local `embedText()` function in `app.js` with transformer embeddings from a service or model such as:

- OpenAI text embeddings
- Sentence Transformers
- Hugging Face Inference API
- A local embedding model served through Python

An optional starter backend is included in `transformer_backend_example.py`.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-transformer.txt
python transformer_backend_example.py
```

That backend exposes:

```text
POST http://localhost:5050/api/compare
```

with this JSON body:

```json
{
  "resume": "Resume text here",
  "jobDescription": "Job description text here"
}
```

Students can honestly describe this project as:

> I built an AI-powered career advisor that analyzes resumes and job descriptions with an embedding-based similarity pipeline and a web-based interface.

After adding a real transformer embedding model, they can say:

> I built an AI-powered career advisor that analyzes resumes and job descriptions using transformer embeddings and a web-based interface.
