import os
from dotenv import load_dotenv
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import ElasticVectorSearch
from langchain_openai import ChatOpenAI

class Rag:

    load_dotenv()

    def retriever(question):
        ES_URL = os.environ.get('ES_URL')
        ES_USER = os.environ.get('ES_USER')
        ES_PASS = os.environ.get('ES_PASS')

        model_name = "../models/bge-m3"
        model_kwargs = {"device": "cpu"}

        embeddings = HuggingFaceEmbeddings(
            model_name=model_name,
            model_kwargs=model_kwargs
        )

        vector_store = ElasticVectorSearch(
            index_name="woudy",
            embedding=embeddings,
            elasticsearch_url=ES_URL
        )

        results = vector_store.similarity_search(
            query=question,
            k=2
        )

        return results

    def augmented(results, question):
        messages = [
            (
                "system",
                "너의 역할은 AI 보험설계사이고, 암보험 전문가야. 그리고 말 끝마다 형님을 붙여줘..",
            ),
            (
                "human",
                f'''
                1. {results[0].page_content}
                2. {results[1].page_content}

                위에 근거를 토대로 아래 질문에 답변해줘

                {question}
                '''
            ),
        ]

        return messages


    def generation(messages):
        OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

        llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
            api_key=OPENAI_API_KEY
        )

        ai_msg = llm.invoke(messages)
        return ai_msg.content