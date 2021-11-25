from Document import Document


class GramCreator:
    def __init__(self, path: str) -> None:
        self.document = Document(path)
        self.dict_gram_count = self.create_2_gram()
        self.sorted_grams = self.sort_grams()

    def sort_grams(self):
        sorted_grams = list()

        for gram in sorted(self.dict_gram_count.items(), key=lambda x: -x[1]):
            sorted_grams.append(gram[0])

        return sorted_grams

    def create_2_gram(self):
        dict_gram_count = dict()

        dict_term_count = self.document.dict_term_count
        for term in dict_term_count.keys():
            for i in range(len(term) - 1):
                if i % 2 == 0:
                    gram = ''
                    if i + 1 < len(term):
                        gram = term[i] + term[i + 1]

                    if i + 2 == len(term) - 1:
                        gram += term[i + 2]

                    if len(gram) > 1 and gram in dict_gram_count:
                        dict_gram_count[gram] += dict_term_count[term] * 1
                    elif len(gram) > 1:
                        dict_gram_count[gram] = dict_term_count[term] * 1

                    if len(gram) == 3:
                        break

        return dict_gram_count

