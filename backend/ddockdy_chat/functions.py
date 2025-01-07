import os
from dotenv import load_dotenv

# Retrieval
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import ElasticVectorSearch

# Augmented
from langchain.schema import Document
from langchain_openai import ChatOpenAI

# Generate
import json
import requests

load_dotenv()

def retriever(user_question):
    ELASTIC_HOST = os.environ.get('ELASTIC_HOST')
    ELASTIC_PORT = os.environ.get('ELASTIC_PORT')
    ELASTIC_ID = os.environ.get('ELASTIC_ID')
    ELASTIC_PASSWORD = os.environ.get('ELASTIC_PASSWORD')

    embeddings = HuggingFaceEmbeddings(
        model_name="../models/bge-m3",
        model_kwargs={'device':'cpu'}
    )

    es_url=f"http://{ELASTIC_HOST}:{ELASTIC_PORT}"

    elastic_vector_search = ElasticVectorSearch(
        elasticsearch_url=es_url,
        index_name="ddockdy",
        embedding=embeddings,
    )

    results = elastic_vector_search.similarity_search(
        query=user_question,
        k=2,
        # filter=[{"term": {"metadata.source.keyword": ""}}],
    )

    # for res in results:
    #     print(f"* {res.page_content} [{res.metadata}]")
    
    return results

def augmented(user_question, doc: Document):

    # 검색 결과를 텍스트로 변환 (검색된 문서의 내용만 추출)
    context = "\n\n".join([f"{res.page_content}" for res in doc])

    # 프롬프트 템플릿 정의 (검색 결과와 질문을 함께 전달)
    prompt_template = """
    The following content has been retrieved from a related document:
    
    {context}
    
    Based on the information above, please answer the following question:
    
    {question}
    
    Provide accurate and trustworthy answers like a professional insurance advisor.
    Use simple examples if needed for better understanding.
    Maintain a confident and professional tone while staying polite and approachable.
    """

    # 프롬프트 생성
    prompt = prompt_template.format(context=context, question=user_question)

    return prompt

def generation(prompt):
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0, # 답변의 일관성을 유지하기 위해 낮은 온도 설정
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=OPENAI_API_KEY,  
    )

    # LLM 응답 생성
    answer = llm.invoke(prompt)
    return answer.content