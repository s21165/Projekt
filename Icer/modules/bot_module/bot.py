import json
import os.path
import wikipediaapi
import pickle
import random
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import sent_tokenize
from nltk.stem import WordNetLemmatizer
from keras.models import load_model


# Download the punkt tokenizer data
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('punkt')
nltk.download('omw-1.4')

# Create an instance of the WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

# Load intents from JSON file
intents_file_path = os.path.join(os.path.dirname(__file__), 'intents.json')
with open(intents_file_path, 'r') as file:
    intents = json.load(file)

# Wikipedia API setup
# User agent needed
user_agent = "icerbot/1.0 (s18861@pjwstk.edu.pl)"
wiki_wiki = wikipediaapi.Wikipedia(language='pl', extract_format=wikipediaapi.ExtractFormat.WIKI, user_agent=user_agent)

# Vectorizer setup for cosine similarity
vectorizer = TfidfVectorizer()

words = pickle.load(open('modules/bot_module/words.pkl', 'rb'))
classes = pickle.load(open('modules/bot_module/classes.pkl', 'rb'))
model = load_model('modules/bot_module/chatbot_model.h5')


# Tokenize and lemmatize sentence
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    
    return sentence_words
    
#Converting sentence into bag of words
def bow(sentence, words, show_details=True):
    sentence_words = clean_up_sentence(sentence)
    bag = [0]*len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
                if show_details:
                    print(f"found in bag: {w}")
                    
    return np.array(bag)
    
def get_response(user_input):
    p = bow(user_input, words)  # Assuming 'words' is loaded from pickle
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25  # Adjust this threshold as needed
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    
    if results:
        intent = classes[results[0][0]]
        for i in intents:
            if i['tag'] == intent:
                response = random.choice(i['responses'])
                return response
                
    return None
 
def extract_relevant_sentences(text, query):
    sentences = sent_tokenize(text)  # Split text into sentences
    relevant_sentences = []
    
    for sentence in sentences:
        if any(term in sentence.lower() for term in query.lower().split()):
            relevant_sentences.append(sentence)
    
    return relevant_sentences

 
    
# Function to get the bot's response
def get_bot_response(user_input):
    model_response = get_response(user_input)
    if model_response:
        return model_response

    try:
        wiki_page = wiki_wiki.page(user_input)
        if wiki_page.exists():
            wiki_content = wiki_page.text
            user_input_tfidf = vectorizer.fit_transform([user_input, wiki_content])
            cosine_sim = cosine_similarity(user_input_tfidf[0], user_input_tfidf[1])
            
            print("Cosine Similarity:", cosine_sim)
            
            if cosine_sim > 0.2:
                bot_response = "Tu są informacje z Wikipedii:\n"
                relevant_sentences = extract_relevant_sentences(wiki_content, user_input)
                bot_response += "\n".join(relevant_sentences)
                return bot_response
    except KeyError as e:
        print("KeyError:", e)
        print("Response data:", wiki_page)
    except Exception as e:
        print("An error occurred:", e)

    return "Przepraszam, nie wiem co powiedzieć!"



    