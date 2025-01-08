from fastapi import FastAPI
from functions import RAG
from items import QuestionRequest
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

@app.post("/dandy_api")
async def chat(requset: QuestionRequest):
    #사용자 질문 추출
    text = requset.question

    #1. 청크 검색
    context_chunks = RAG.retriever(text)

    #2. OpenAI에 전달할 메시지 생성
    messages = RAG.augmented(text, context_chunks)

    #3. OpenAI GPT를 사용하여 답변 생성
    answer = RAG.generation(messages)

    return {
        "answer" : answer
    }



