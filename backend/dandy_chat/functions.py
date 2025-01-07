# 결과 나오기 까지의 과정을 적는곳
import os
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import ElasticVectorSearch
from langchain_openai import ChatOpenAI
import getpass



class RAG:
    load_dotenv()
    def retriever(question):
        # ElasticSearch 설정
        ELASTIC_HOST = os.environ.get('ELASTIC_HOST')
        print(ELASTIC_HOST)
        ELASTIC_PORT = os.environ.get('ELASTIC_PORT')
        ELASTIC_ID = os.environ.get('ELASTIC_ID')
        ELASTIC_PASSWORD = os.environ.get('ELASTIC_PASSWORD')

        # 임베딩 모델 설정
        embeddings = HuggingFaceEmbeddings(
            model_name="../models/bge-m3",
            model_kwargs={'device': 'cpu'}
        )
        # ElasticSearch 벡터 스토어 설정
        vectordb = ElasticVectorSearch(
            elasticsearch_url=f"http://{ELASTIC_HOST}:{ELASTIC_PORT}",
            index_name="dandy",
            embedding=embeddings
        )

        # 질문에 대해 적절한 청크 검색
        results = vectordb.similarity_search_with_score(
                query=question,
                k=1
            )
        return [{"content": doc.page_content, "metadata": doc.metadata} for doc, score in results]



    def augmented(question, context_chunks):
        # 검색된 청크를 하나의 컨텍스트로 합치기
        context = "\n".join([chunk["content"] for chunk in context_chunks])
        
        # OpenAI 모델에 전달할 메시지 생성
        messages = [
            ("system", "You are a helpful assistant that provides detailed answers based on the provided context."),
            ("human", f"Context:\n{context}"),
            ("human", f"Question: {question}")
        ]

        return messages


    def generation(messages):
        # OpenAI API 키 설정
        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

        # OpenAI LLM 초기화
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,  # 창의성 조절
            max_tokens=500,   # 최대 응답 토큰 수
            timeout=30,       # 최대 요청 시간
            max_retries=3     # 재시도 횟수
        )

        # OpenAI LLM 호출
        ai_response = llm.invoke(messages)
        
        # ai_response.content를 반환
        return ai_response.content.strip()
