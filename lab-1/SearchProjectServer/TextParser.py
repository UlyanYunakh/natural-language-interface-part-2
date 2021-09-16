# -*- coding: utf-8 -*-
from pymorphy2 import MorphAnalyzer
import nltk
nltk.download('punkt')
import json


def wordize(sentences):
    listWord = []
    for sent in nltk.sent_tokenize(sentences.lower()):
        for word in nltk.word_tokenize(sent):
            if word != '.' and word != ',' and word != '?' and word != '!' and word != '-':
                listWord.append(word)
    return listWord


def dictInJson(dictionary):
    string = "["
    for item in dictionary:
        string += json.dumps(item, ensure_ascii=False)
        string += ","
    string = string[0:-1]
    string += "]"
    return string


def parseText(text):
    json = ""
    dictionary = []
    words = wordize(text)
    analyzer = MorphAnalyzer()

    for word in words:
        parseWord = analyzer.parse(word)[0]
        wordForm = parseWord.word.lower()

        in_dict = False
        for item in dictionary:
            if wordForm == item['Word']:
                in_dict = True
                item['Frequency'] += 1
        if not in_dict:
            dictionaryItem = (
                {'Word': wordForm, 'Frequency': 1})
            dictionary.append(dictionaryItem)

    json = dictInJson(dictionary)
    return json
