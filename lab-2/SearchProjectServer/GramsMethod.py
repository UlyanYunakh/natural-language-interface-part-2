from GramCreator import GramCreator


class GramsMethod:
    def __init__(self, english_doc_path: str, franch_doc_path: str) -> None:
        self.max = 1000
        self.english_grams = GramCreator(english_doc_path).sorted_grams
        self.franch_grams = GramCreator(franch_doc_path).sorted_grams

    def get_measure(self, grams_a: list, grams_b: list):
        measure = 0
        for i in range(len(grams_a)):
            if grams_a[i] in grams_b:
                measure += abs(grams_b.index(grams_a[i]))
            else:
                measure += self.max

        return measure

    def get_language(self, file_path: str):
        grams = GramCreator(file_path).sorted_grams

        english_measure = self.get_measure(grams, self.english_grams)
        spanish_measure = self.get_measure(grams, self.franch_grams)

        if english_measure < spanish_measure:
            return 'ENGLISH'
        else:
            return 'FRANCH'
