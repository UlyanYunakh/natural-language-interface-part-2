from nltk.corpus import stopwords
from nltk.cluster.util import cosine_distance
import numpy as np
import networkx as nx

def sentence_similarity(sent1, sent2, stop_words=None):
    if stop_words is None:
        stop_words = []
    sent1 = [w.lower() for w in sent1]
    sent2 = [w.lower() for w in sent2]
    all_words = list(set(sent1+sent2))
    vector1 = [0] * len(all_words)
    vector2 = [0] * len(all_words)

    for w in sent1:
        if w in stop_words:
            continue
        vector1[all_words.index(w)] += 1

    for w in sent2:
        if w in stop_words:
            continue
        vector2[all_words.index(w)] += 1

    return 1 - cosine_distance(vector1, vector2)


def getSimilarityMatrix(sentences, stop_words):
    similarity_matrix = np.zeros((len(sentences), len(sentences)))

    for idx1 in range(len(sentences)):
        for idx2 in range(len(sentences)):
            if idx1 == idx2:
                continue
            similarity_matrix[idx1][idx2] = sentence_similarity(
                sentences[idx1], sentences[idx2], stop_words)
    return similarity_matrix


def summarize(name, text, lang):
    stopWords = stopwords.words(lang)
    summarize = []

    data = "".join(text).replace("\n", "")
    article = data.split(". ")
    sentences = []
    for sentence in article:
        sentences.append(sentence.replace("[^a-zA-Z]", " ").split(" "))
    sentences.pop()

    similarityMatrix = getSimilarityMatrix(sentences, stopWords)
    similarityGraph = nx.from_numpy_array(similarityMatrix)
    scores = nx.pagerank(similarityGraph)
    rankedSentences = sorted(((scores[i], s) for i, s in enumerate(sentences)), reverse=True)

    for i in range(3):
        summarize.append(" ".join(rankedSentences[i][1]))

    return "\nSummary of file " + name + ":\n" + "".join(summarize) + "."
