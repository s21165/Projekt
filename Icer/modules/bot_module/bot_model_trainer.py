'''
CHATBOT - training
'''

'''
Instalacje
'''
!pip install wikipedia
!pip install wikipedia-api
!pip install translate

'''
Importy
'''
import nltk
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from translate import Translator
import random
import wikipedia
import json
import pickle
import numpy as np
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import Adam  
from keras.models import load_model
import random
from sklearn.model_selection import train_test_split  





# Pobieranie danych NLTK
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('punkt')
nltk.download('omw-1.4')

words = []
classes = []
documents = []
ignore_words = ['?', '!']
data_file = open('intents.json').read()
intents = json.loads(data_file)

lemmatizer = WordNetLemmatizer()

'''
Tokenizacja, dodawanie dokumentów do korpusu, lematyzacja.
Klasy będą zliczane, a unikalne zlematyzowane słowa zostaną wydrukowane dla odniesienia.
'''
for intent in intents:
    for pattern in intent['patterns']:
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        documents.append((w, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

print(len(documents), "dokumenty")
print(len(classes), "klasy", classes)
print(len(words), "unikalne zlematyzowane słowa", words)
pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))

'''
Tworzenie danych treningowych
'''
training = []

output_empty = [0] * len(classes)

for doc in documents:
    bag = []
    pattern_words = doc[0]
    pattern_words = [lemmatizer.lemmatize(word.lower()) for word in pattern_words]
    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    training.append([bag, output_row])

random.shuffle(training)
training = np.array(training)

train_x = list(training[:, 0])
train_y = list(training[:, 1])

# Podział danych na zestawy treningowe i walidacyjne
train_x, val_x, train_y, val_y = train_test_split(train_x, train_y, test_size=0.2, random_state=42)

print("Utworzono dane treningowe")

'''
Tworzenie i zapis modelu treningowego
'''
model = Sequential()
model.add(Dense(256, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(train_y[0]), activation='softmax'))
adam = Adam(lr=0.0001)  # Użyj optymalizatora Adam
model.compile(loss='categorical_crossentropy', optimizer=adam, metrics=['accuracy'])

# Trenuj model na danych treningowych i waliduj na danych walidacyjnych
hist = model.fit(np.array(train_x), np.array(train_y), validation_data=(np.array(val_x), np.array(val_y)),
                 epochs=200, batch_size=5, verbose=1)

# Zapisz model
model.save('chatbot_model.h5', hist)
print("Utworzono i przetrenowano model")