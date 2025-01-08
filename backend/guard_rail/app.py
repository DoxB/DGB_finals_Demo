from fastapi import FastAPI
from items import QuestionRequest
from functions import Rag
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

@app.post("/guard_rail_api")
async def guardRail_api(request: QuestionRequest):
    user_question = request.question

    messages_first = Rag.augmented_service(user_question)
    first_guard_rail = Rag.generation(messages_first)

    if first_guard_rail == 'FAIL':
        return {'result': 'FAIL'}

    results = Rag.retriever(user_question)
    messages_second = Rag.augmented_law(results, user_question)
    second_guard_rail = Rag.generation(messages_second)

    if second_guard_rail == 'FAIL':
        return {'result': 'FAIL'}

    return {'result': 'PASS'}