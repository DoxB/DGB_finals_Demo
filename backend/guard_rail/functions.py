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
            index_name="ai_law",
            embedding=embeddings,
            elasticsearch_url=ES_URL
        )

        results = vector_store.similarity_search(
            query=question,
            k=2
        )

        return results

    def augmented_service(question):
        messages = [
            (
                "system",
                "너의 역할은 사용자 질의에 대해 욕설이나 보험 서비스에 벗어나는 질문인지 판단하는 AI야.",
            ),
            (
                "human",
                f'''
                판단해야하는 질의는 아래와 같아

                {question}

                "PASS" 나 "FAIL" 만 출력해줘
                '''
            ),
        ]

        return messages


    def augmented_law(results, question):
        messages = [
            (
                "system",
                "너의 역할은 사용자 질의에 대해 AI 윤리나 법적으로 위배되는 상황이 있는 지 판단하는 AI야.",
            ),
            (
                "human",
                f'''
                사용자 질의에 대한 관련 법령은 다음과 같아.

                1. {results[0].page_content}
                2. {results[1].page_content}

                다음은 사용자의 질의야.

                {question}

                AI 윤리나 법적으로 위배되는 상황이 있다면 "FAIL", 없다면 "PASS" 만 출력해줘
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