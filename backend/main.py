from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import requests
import json
import re
app = FastAPI()

# Allow CORS (Adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# We'll store conversation in memory for demonstration
# Key = conversation_id (e.g. 1) => value = list of messages
# Each message is { "role": "user"/"assistant"/"system", "content": "..." }
conversations = {}

default_system_prompt = """
You are RWTH DBIS Tutor, an AI assistant designed to support undergraduate and graduate students with questions related to the Databases and Information Systems (DBIS) Group at RWTH Aachen University. Your primary role is to provide detailed, accurate, and well-structured responses on topics including but not limited to:

- DBIS research areas, methodologies, and ongoing projects.
- Courses offered by DBIS, such as Semantic Web, Database Systems, Knowledge Graphs, Big Data Management, and related topics.
- Course content, recommended literature, assignments, and exam preparation strategies.
- Conceptual explanations in database theory, data modeling, RDF, SPARQL, ontologies, knowledge graphs, and other advanced DBIS topics.
- Guidance on software tools and frameworks commonly used in DBIS courses, such as PostgreSQL, Neo4j, RDF4J, Apache Jena, and others.
- Best practices in database design, knowledge graph construction, and semantic technologies.
- Administrative and academic guidance, including prerequisites, course requirements, grading policies, and research opportunities within DBIS.

Response Guidelines:
1. Accuracy & Clarity: Always ensure your responses align with official RWTH DBIS course content and current academic best practices.
2. Structured Explanations: Provide well-organized responses with examples, definitions, and step-by-step guidance where needed.
3. Professional & Supportive Tone: Maintain a helpful, academic, and encouraging tone, ensuring students feel supported in their learning journey.
4. Scope Awareness: If a question is outside DBIS’s domain (e.g., unrelated administrative queries), politely direct students to the appropriate RWTH support channels.
5. Concise Yet Comprehensive: Keep explanations to the point but include relevant details to ensure depth of understanding.

Example Interactions:
💡 Student: "What are the prerequisites for taking the Semantic Web course?"
✅ RWTH DBIS Tutor: "The Semantic Web course at RWTH DBIS typically requires foundational knowledge in databases, RDF, SPARQL, and some familiarity with ontologies. Recommended prior courses include 'Database Systems' and 'Introduction to AI'. You may also review foundational materials from W3C regarding Linked Data principles."

💡 Student: "Can you explain the differences between RDF and property graphs?"
✅ RWTH DBIS Tutor: "Certainly! RDF (Resource Description Framework) is a W3C standard for representing knowledge as triples (subject-predicate-object) and is commonly used in the Semantic Web. Property graphs, on the other hand, use labeled edges and allow richer annotations on both nodes and edges, making them more suitable for graph-based applications like social networks. RDF is used in Linked Data and SPARQL queries, while property graphs are often implemented using databases like Neo4j.
"""

# By default, let's have a single conversation "id=1"
# Start with a system (instruction) and an assistant greet message
conversations[1] = [
    {"role": "system", "content": default_system_prompt},
    {"role": "assistant", "content": "Hello! I'm DBIS-Tutor. How can I help you?"}
]

class ChatRequest(BaseModel):
    conversation_id: int
    user_message: str

@app.get("/")
def root():
    return {"message": "DBIS Tutor backend up and running"}

@app.post("/chat")
def chat_with_ollama(payload: ChatRequest):
    """
    We receive a conversation_id and a user_message.
    1) Append the user_message to the conversation
    2) Construct a prompt from the entire conversation
    3) Call Ollama
    4) Add Ollama's reply (assistant) to the conversation
    5) Return the new assistant reply
    """
    conv_id = payload.conversation_id
    user_msg = payload.user_message.strip()

    # If conversation doesn't exist, create a new one with system + greet
    if conv_id not in conversations:
        conversations[conv_id] = [
            {"role": "system", "content": "You are a DBIS tutor."},
            {"role": "assistant", "content": "Hello! I'm DBIS-Tutor. How can I help you?"}
        ]

    # Append user message
    conversations[conv_id].append({"role": "user", "content": user_msg})

    # Build prompt for Ollama
    # We'll convert the conversation into a textual format.
    # Note: Some LLMs might require special formatting. Ollama is flexible,
    # so we can do something like this:
    prompt_text = ""
    for msg in conversations[conv_id]:
        if msg["role"] == "system":
            prompt_text += f"System: {msg['content']}\n"
        elif msg["role"] == "assistant":
            prompt_text += f"Assistant: {msg['content']}\n"
        else:
            prompt_text += f"User: {msg['content']}\n"
    prompt_text += "Assistant:"

    # Call Ollama service
    # Adjust the endpoint path if different
    url = "http://ollama.warhol.informatik.rwth-aachen.de/api/generate"
    req_body = {
        "prompt": prompt_text,
        "model": "llama3.2:latest",  # or whichever model name is set on the Ollama server
        "temperature": 0.7,
        "stream": False
    }
    try:
        r = requests.post(url, json=req_body)
        r.raise_for_status()
        data = r.json()

        # 'response' is the key holding the entire text
        raw_response = data.get("response", "")

        # (Optional) remove the <think>...</think> section
        # so the user sees a cleaner final result:
        assistant_reply = re.sub(r"<think>.*?</think>", "", raw_response, flags=re.DOTALL).strip()
        print()
    except Exception as e:
        print("Error calling Ollama:", e)
        assistant_reply = "Sorry, I had trouble communicating with Ollama."

    conversations[conv_id].append({"role": "assistant", "content": assistant_reply})

    return {"assistant_reply": assistant_reply}

    # Return the assistant's new message
    return {
        "assistant_reply": assistant_reply
    }
