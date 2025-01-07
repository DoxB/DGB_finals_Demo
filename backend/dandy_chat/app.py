from fastapi import FastAPI
from functions import RAG
from items import QuestionRequest


app = FastAPI()

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



