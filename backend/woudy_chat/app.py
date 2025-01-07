from fastapi import FastAPI
from items import QuestionRequest
from functions import Rag

app = FastAPI()

@app.post("/woudy_api")
async def woudy_chat(request: QuestionRequest):
    user_question = request.question
    results = Rag.retriever(user_question)
    messages = Rag.augmented(results, user_question)
    answer = Rag.generation(messages)
    return { "answer" : answer }