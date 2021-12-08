import nltk
import spacy
from spacy.lang.fr.examples import sentences as sentencesFr
from spacy.lang.en.examples import sentences as sentencesEn
from nltk import ParentedTree
from google_trans_new import google_translator

nlpFr = spacy.load("fr_core_news_sm")
nlpEn = spacy.load("en_core_web_sm")

def getTranslationAPI(langFrom, langTo, text):
  translator = google_translator()
  return translator.translate(text, lang_src=langFrom, lang_tgt=langTo)

def getTranslationByWords(langFrom, langTo, text):
  result = []
  words = wordize(text)
  for word in words:
    in_result = False
    for item in result:
        if word == item['word']:
            in_result = True
            item['frequency'] += 1
    if not in_result:
      resultItem = ({
        'word': word, 
        'translation': getTranslationAPI(
          langFrom=langFrom,
          langTo=langTo,
          text=word
        ),
        'frequency': 1
      })
      result.append(resultItem)
    
  return result


def wordize(text):
  words = []
  for sent in nltk.sent_tokenize(text.lower()):
      for word in nltk.word_tokenize(sent):
          if word != '.' and word != ',' and word != '?' and word != '!' and word != '-':
              words.append(word)
              
  return words


def tokFormat(tok):
  return "_".join([tok.orth_, tok.tag_])

def getNltkTree(node):
  if node.n_lefts + node.n_rights > 0:
      return ParentedTree(tokFormat(node), [getNltkTree(child) for child in node.children])
  else:
      return tokFormat(node) 

def getTree(lang, text):
  result = []

  if lang == 'fr':
    doc = nlpFr(text)
  else:
    doc = nlpEn(text)

  for sent in doc.sents:
    sentStr = str(sent)
    tree = getNltkTree(sent.root)
    result.append({
      'sent': sentStr,
      'tree': str(tree)
    })

  return result

def textEndpoint(requestObject):
  translationAPI = getTranslationAPI(
    langTo=requestObject["langTo"],
    langFrom=requestObject["langFrom"],
    text=requestObject["text"]
  )

  return {
    "translationAPI": translationAPI
  }

def wordsEndpoint(requestObject):
  translationByWords = getTranslationByWords(
    langTo=requestObject["langTo"],
    langFrom=requestObject["langFrom"],
    text=requestObject["text"]
  ) 

  return {
    "translationByWords": translationByWords
  }

def treeEndpoint(requestObject):
  translationTree = getTree(
    requestObject["langTo"], 
    requestObject["text"]
  )

  return {
    "translationTree": translationTree
  }
