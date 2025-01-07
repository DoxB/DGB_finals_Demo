from fastapi import FastAPI
from items import QuestionRequest
from functions import retriever, augmented, generation

app = FastAPI()

@app.post("/ddockdy_api")
async def ddockdy_api(request: QuestionRequest):
    question = request.question
    context = retriever(question)
    answer = augmented(question, context)
    result = generation(answer)

    return {"result": result}