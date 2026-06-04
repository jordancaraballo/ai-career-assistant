from flask import Flask, jsonify, request
from flask_cors import CORS
from numpy import dot
from numpy.linalg import norm
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app)

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def cosine_similarity(left, right):
    denominator = norm(left) * norm(right)
    if denominator == 0:
        return 0.0
    return float(dot(left, right) / denominator)


@app.post("/api/compare")
def compare_texts():
    data = request.get_json(force=True)
    resume = data.get("resume", "")
    job_description = data.get("jobDescription", "")

    resume_vector, job_vector = model.encode([resume, job_description])
    score = cosine_similarity(resume_vector, job_vector)

    return jsonify(
        {
            "model": "sentence-transformers/all-MiniLM-L6-v2",
            "similarity": score,
            "fitScore": round(score * 100),
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5050)
