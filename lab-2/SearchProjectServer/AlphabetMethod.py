from Document import Document


class AlphabetMethod:
    def __init__(self, english_doc_path: str, franch_doc_path: str) -> None:
        self.english_alphabet = self.get_alphabet(self.get_text(english_doc_path))
        self.spanish_alphabet = self.get_alphabet(self.get_text(franch_doc_path))

    def get_language(self, file_path: str):
        alphabet = self.get_alphabet(self.get_text(file_path))

        if len(alphabet.intersection(self.spanish_alphabet - self.english_alphabet)) == 0:
            return 'ENGLISH'
        else:
            return 'FRANCH'

    @staticmethod
    def get_alphabet(text: str):
        alphabet = set()

        for sign in text:
            alphabet.add(sign)

        return alphabet

    @staticmethod
    def get_text(document_path: str) -> str:
        return Document(document_path).get_text(document_path)
