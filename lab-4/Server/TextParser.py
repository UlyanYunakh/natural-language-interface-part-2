import pymorphy2
from nltk.tokenize import word_tokenize
from ruconceptnet import ConceptNet
import json

conceptNet = ConceptNet()
def getModel(word):
    model = []
    model.append(word)
    forms = getForms(word)
    model = model + forms
    synonyms = getSynonyms(word)
    for word in synonyms:
        model.append(word)
        forms = getForms(word)
        model = model + forms
    return toJson(model)


def getForms(word):
    forms = []
    targets = conceptNet.get_sources(word)
    for target in targets:
        if 'FormOf' in target[1]:
            forms.append(target[0])
    return forms


def getSynonyms(word):
    synonyms = []
    targets = conceptNet.get_targets(word)
    for target in targets:
        if 'Synonym' in target[1]:
            synonyms.append(target[0])
    return synonyms

def toJson(model):
    modelJson = "["
    for word in model:
        modelJson += json.dumps(word, ensure_ascii=False)
        modelJson += ","
    modelJson = modelJson[0:-1]
    modelJson += "]"
    return modelJson