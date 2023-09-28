from pathlib import Path
import shutil
import pandas as pd
from langchain.chat_models import ChatOpenAI
from llama_index.node_parser import SimpleNodeParser
from llama_index.langchain_helpers.text_splitter import TokenTextSplitter
from llama_index import OpenAIEmbedding, PromptHelper, SimpleDirectoryReader
from llama_index import (
  VectorStoreIndex,
  LLMPredictor,
  ServiceContext,
  set_global_service_context,
)
from llama_index import StorageContext, load_index_from_storage
import os
from dotenv import load_dotenv
import openai

load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")

# set the model to be used later for predicting using word embeddings that we are going to create
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.7)
llm_predictor = LLMPredictor(llm=llm)

# Default embedding "text-embedding-ada-002" from OpenAI
embed_model = OpenAIEmbedding()

# to convert docs in chunks i.e. nodes
node_parser = SimpleNodeParser(
  text_splitter=TokenTextSplitter(chunk_size=1024, chunk_overlap=20)
)

#  helps with truncating and repacking text chunks to fit in the LLM’s context window
prompt_helper = PromptHelper(
  context_window=4096, num_output=256, chunk_overlap_ratio=0.1, chunk_size_limit=None
)

# configure service context
service_context = ServiceContext.from_defaults(
  llm_predictor=llm_predictor,
  embed_model=embed_model,
  node_parser=node_parser,
  prompt_helper=prompt_helper,
)

# set global variables so no need to use/mention at every stage later
set_global_service_context(service_context)

def generate_response(input_text, user_organization):
  try:
    vec_embed_store_path = Path(f"./organizations/{user_organization}/vec_embed_data")
    storage_context = StorageContext.from_defaults(persist_dir=vec_embed_store_path)
    # load index
    index = load_index_from_storage(storage_context)
    query_engine = index.as_query_engine()
    response = query_engine.query("Say [no information found] if no information can be provided from given context.\n" + input_text)
    return response.response
  except Exception as e:
    print(f"Error: {str(e)}")
  return None

def get_index(docs_path: Path, storage_path: Path) -> VectorStoreIndex:
  """
  This function will read the document and return word embeddings/ vector representation of the docs.
  Also, it will save these embeddings at specified location.

  Parameters
  ----------

  docs_path: Path
    The path where documents to read reside

  storage_path: Path
    The path to store vector embedding representation of the docs

  """

  documents = SimpleDirectoryReader(docs_path).load_data()
  print("documents", documents)
  # convert to node
  parser = SimpleNodeParser(
    text_splitter=TokenTextSplitter(chunk_size=1024, chunk_overlap=20)
  )
  nodes = parser.get_nodes_from_documents(documents)
  # print("nodes", nodes)
  # crate index based on the details
  index = VectorStoreIndex(nodes, service_context=service_context)

  # store the index at specified location
  index.storage_context.persist(persist_dir=storage_path)
  return index

def train_file(files):
  """
  This function will train all the files under specific organization
  It will take the data from upload api
  and store the trained data in s3 bucket organization folder
  :param organization_id: to train the data from organization id
       files: contains file id and filename to train the data
  """
  try:
    read_docs_path = os.path.abspath(files)
    # storage path to store the embeddings
    file_reader = os.listdir(read_docs_path)
    for file in file_reader:
      if file.endswith(".xlsx"):
        # Read and store content
        # of an excel file
        read_file = pd.read_excel(f"{read_docs_path}/{file}")
        # Write the dataframe object
        # into csv file
        new_file = file.split(".")[0]
        read_file.to_csv(
          f"{read_docs_path}/{new_file}.csv", index=None, header=True
        )
        os.remove(f"{read_docs_path}/{file}")
        # read csv file and convert
        # into a dataframe object
        # df = pd.DataFrame(pd.read_csv(f"{read_docs_path}/{new_file}.csv"))

    for file in file_reader:
      if file == "vec_embed_data":
        shutil.rmtree(f"{read_docs_path}/vec_embed_data")

    vec_embed_store_path = Path(f"{read_docs_path}/vec_embed_data")
    get_index(read_docs_path, vec_embed_store_path)
    return "Data trained successfully"
  except Exception as e:
    print({str(e)})
    return str(e)
