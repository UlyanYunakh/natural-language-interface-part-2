import codecs

import pymorphy2


class Document:
    def __init__(self, path: str) -> None:
        self._path = path
        self.text = self.normalize(self.get_text(path))
        self.dict_term_count = self.create_dictionary()

    def create_dictionary(self):
        dict_term_count = dict()
        for term in self.text.split():
            if term in dict_term_count:
                dict_term_count[term] += 1
            else:
                dict_term_count[term] = 1

        return dict_term_count

    def has_term(self, term: str) -> bool:
        return term in self.dict_term_count

    @staticmethod
    def get_text(document_path: str) -> str:
        with codecs.open(document_path, 'r', 'utf_8_sig') as html_file:
            page_content = html_file.read()

            text = ""
            for term in page_content.lower().split():
                for symbol in term:
                    if symbol.isalpha():
                        text += symbol

                if text[-1] != ' ':
                    text += " "

        return text.strip()

    @staticmethod
    def normalize(text: str) -> str:
        morph = pymorphy2.MorphAnalyzer(lang='ru')

        new_text = ''
        for word in list(text.split()):
            new_text += morph.normal_forms(word)[0] + ' '

        return new_text.strip()
