from fastapi import FastAPI
from items import QuestionRequest
from functions import retriever, augmented, generation
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용 (보안상 필요 시 제한)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

@app.post("/ddockdy_api")
async def ddockdy_api(request: QuestionRequest):
    question = request.question
    context = retriever(question)
    answer = augmented(question, context)
    result = generation(answer)

    return {"result": result}