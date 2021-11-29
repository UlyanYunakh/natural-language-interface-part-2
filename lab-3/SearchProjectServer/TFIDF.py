from nltk.corpus import stopwords
from nltk import sent_tokenize, PorterStemmer
from nltk.tokenize import word_tokenize
from rake_nltk import Rake
import math

import nltk
nltk.download('stopwords')


def getFrequencyMatrix(sentences, lang):
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


def getTfMatrix(freq_matrix):
    tf_matrix = {}

    for sent, f_table in freq_matrix.items():
        tf_table = {}
        count_words_in_sentence = len(f_table)
        for word, count in f_table.items():
            tf_table[word] = count / count_words_in_sentence
        tf_matrix[sent] = tf_table
    return tf_matrix


def getDocumentsPerWords(freq_matrix):
    word_per_doc_table = {}

    for sent, f_table in freq_matrix.items():
        for word, count in f_table.items():
            if word in word_per_doc_table:
                word_per_doc_table[word] += 1
            else:
                word_per_doc_table[word] = 1

    return word_per_doc_table


def getIdfMatrix(freq_matrix, count_doc_per_words, total_documents):
    idf_matrix = {}

    for sent, f_table in freq_matrix.items():
        idf_table = {}

        for word in f_table.keys():
            idf_table[word] = math.log10(
                total_documents / float(count_doc_per_words[word]))

        idf_matrix[sent] = idf_table

    return idf_matrix


def getTfIdfMatrix(tf_matrix, idf_matrix):
    tf_idf_matrix = {}

    for (sent1, f_table1), (sent2, f_table2) in zip(tf_matrix.items(), idf_matrix.items()):

        tf_idf_table = {}

        for (word1, value1), (word2, value2) in zip(f_table1.items(), f_table2.items()):
            tf_idf_table[word1] = float(value1 * value2)

        tf_idf_matrix[sent1] = tf_idf_table

    return tf_idf_matrix


def getScore(tf_idf_matrix):
    sentenceValue = {}

    for sent, f_table in tf_idf_matrix.items():
        total_score_per_sentence = 0

        count_words_in_sentence = len(f_table)
        for word, score in f_table.items():
            total_score_per_sentence += score

        sentenceValue[sent] = total_score_per_sentence / \
            count_words_in_sentence

    return sentenceValue


def summarize(name, text, lang):
    rake = Rake(stopwords.words(lang), language=lang, max_length=1)
    rake.extract_keywords_from_text(text)
    words = rake.get_ranked_phrases()[0:4]

    sentences = sent_tokenize(text, lang)
    countDocuments = len(sentences)
    frequencyMatrix = getFrequencyMatrix(sentences, lang)
    tfMatrix = getTfMatrix(frequencyMatrix)
    countDocumentsPerWords = getDocumentsPerWords(frequencyMatrix)
    idfMatrix = getIdfMatrix(
        frequencyMatrix, countDocumentsPerWords, countDocuments)
    tfIdfMatrix = getTfIdfMatrix(tfMatrix, idfMatrix)
    sentenceScores = getScore(tfIdfMatrix)

    sumValues = 0
    for entry in sentenceScores:
        sumValues += sentenceScores[entry]

    average = (sumValues / len(sentenceScores))

    summary = "\nSummary of file " + name + ":\nWords: "
    for word in words:
        summary += word + " "
    summary += "\nSentences: "
    for sentence in sentences:
        if sentence[:15] in sentenceScores and sentenceScores[sentence[:15]] >= (average):
            summary += " " + sentence

    return summary
