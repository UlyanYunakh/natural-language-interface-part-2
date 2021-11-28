from nltk.corpus import stopwords
from nltk import sent_tokenize, PorterStemmer
from nltk.tokenize import word_tokenize
from rake_nltk import Rake
import numpy as np
import networkx as nx
import os
import math
import pymorphy2


def read_doc(file_name):
    file = open(file_name, "r",encoding="utf8")
    filedata = file.read()
    return filedata


def create_freq_matrix(sentences,lang):
    freq_matrix = {}
    stop_words = stopwords.words(lang)
    
    ps = PorterStemmer()

    for sent in sentences:
        freq_table = {}
        words = word_tokenize(sent)
        for word in words:
            word = word.lower()
            word = ps.stem(word)
            if word in stop_words:
                continue
            if word in freq_table:
                freq_table[word] += 1
            else:
                freq_table[word] = 1
        freq_matrix[sent[:15]] = freq_table
    return freq_matrix


def create_tf_matrix(freq_matrix):
    tf_matrix = {}

    for sent, f_table in freq_matrix.items():
        tf_table = {}
        count_words_in_sentence = len(f_table)
        for word, count in f_table.items():
            tf_table[word] = count / count_words_in_sentence
        tf_matrix[sent] = tf_table
    return tf_matrix


def create_documents_per_words(freq_matrix):
    word_per_doc_table = {}

    for sent, f_table in freq_matrix.items():
        for word, count in f_table.items():
            if word in word_per_doc_table:
                word_per_doc_table[word] += 1
            else:
                word_per_doc_table[word] = 1

    return word_per_doc_table


def create_idf_matrix(freq_matrix, count_doc_per_words, total_documents):
    idf_matrix = {}

    for sent, f_table in freq_matrix.items():
        idf_table = {}

        for word in f_table.keys():
            idf_table[word] = math.log10(
                total_documents / float(count_doc_per_words[word]))

        idf_matrix[sent] = idf_table

    return idf_matrix


def create_tf_idf_matrix(tf_matrix, idf_matrix):
    tf_idf_matrix = {}

    for (sent1, f_table1), (sent2, f_table2) in zip(tf_matrix.items(), idf_matrix.items()):

        tf_idf_table = {}

        for (word1, value1), (word2, value2) in zip(f_table1.items(),
                                                    f_table2.items()):  # here, keys are the same in both the table
            tf_idf_table[word1] = float(value1 * value2)

        tf_idf_matrix[sent1] = tf_idf_table

    return tf_idf_matrix


def score_sentences(tf_idf_matrix) -> dict:
    """
    score a sentence by its word's TF
    Basic algorithm: adding the TF frequency of every non-stop word in a sentence divided by total no of words in a sentence.
    :rtype: dict
    """

    sentenceValue = {}

    for sent, f_table in tf_idf_matrix.items():
        total_score_per_sentence = 0

        count_words_in_sentence = len(f_table)
        for word, score in f_table.items():
            total_score_per_sentence += score

        sentenceValue[sent] = total_score_per_sentence / \
            count_words_in_sentence

    return sentenceValue


def find_average_score(sentenceValue) -> int:
    """
    Find the average score from the sentence value dictionary
    :rtype: int
    """
    sumValues = 0
    for entry in sentenceValue:
        sumValues += sentenceValue[entry]

    # Average value of a sentence from original summary_text
    average = (sumValues / len(sentenceValue))

    return average


def generate_summary(sentences, sentenceValue, threshold):
    sentence_count = 0
    summary = ''

    for sentence in sentences:
        if sentence[:15] in sentenceValue and sentenceValue[sentence[:15]] >= (threshold):
            summary += " " + sentence
            sentence_count += 1

    return summary


for path in os.listdir("french_docs"):
    text = read_doc(f"french_docs/{path}")
    r = Rake(stopwords.words('french'), language="french", max_length=1)
    r.extract_keywords_from_text(text)
    print(r.get_ranked_phrases()[0:4])
    sentences = sent_tokenize(text, 'french')
    total_documents = len(sentences)
    freq_matrix = create_freq_matrix(sentences,'french')
    tf_matrix = create_tf_matrix(freq_matrix)
    count_doc_per_words = create_documents_per_words(freq_matrix)
    idf_matrix = create_idf_matrix(
        freq_matrix, count_doc_per_words, total_documents)
    tf_idf_matrix = create_tf_idf_matrix(tf_matrix, idf_matrix)
    sentence_scores = score_sentences(tf_idf_matrix)
    threshold = find_average_score(sentence_scores)
    summary = generate_summary(sentences, sentence_scores, threshold)
    print(summary)
    print('\n')


for path in os.listdir("english_docs"):
    text = read_doc(f"english_docs/{path}")
    r = Rake(stopwords.words('english'), language="english", max_length=1)
    r.extract_keywords_from_text(text)
    print(r.get_ranked_phrases()[0:2])
    sentences = sent_tokenize(text, 'english')
    total_documents = len(sentences)
    freq_matrix = create_freq_matrix(sentences,'english')
    tf_matrix = create_tf_matrix(freq_matrix)
    count_doc_per_words = create_documents_per_words(freq_matrix)
    idf_matrix = create_idf_matrix(
        freq_matrix, count_doc_per_words, total_documents)
    tf_idf_matrix = create_tf_idf_matrix(tf_matrix, idf_matrix)
    sentence_scores = score_sentences(tf_idf_matrix)
    threshold = find_average_score(sentence_scores)
    summary = generate_summary(sentences, sentence_scores, threshold)
    print(summary)
    print('\n')
