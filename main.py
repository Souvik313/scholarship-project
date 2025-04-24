from fastapi import FastAPI, Request
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import time

from langchain_groq import ChatGroq
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

app = FastAPI()

# Setup the RAG pipeline once
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
loader = WebBaseLoader("https://docs.smith.langchain.com/")
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
final_documents = text_splitter.split_documents(docs[:50])
vectorstore = FAISS.from_documents(final_documents, embeddings)

llm = ChatGroq(groq_api_key=groq_api_key, model_name="llama3-8b-8192")
prompt_template = ChatPromptTemplate.from_template(
    """
    Answer the questions based on the provided context only.
    Please provide the most accurate response based on the question.
    <context>
    {context}
    <context>
    Question: {input}
    """
)
document_chain = create_stuff_documents_chain(llm, prompt_template)
retriever = vectorstore.as_retriever()
retrieval_chain = create_retrieval_chain(retriever, document_chain)


class Query(BaseModel):
    message: str


@app.post("/chat")
def chat(query: Query):
    start = time.time()
    response = retrieval_chain.invoke({"input": query.message})
    duration = round(time.time() - start, 2)
    return {
        "reply": response['answer'],
        "time_taken": duration,
        "context": [doc.page_content for doc in response["context"]]
    }