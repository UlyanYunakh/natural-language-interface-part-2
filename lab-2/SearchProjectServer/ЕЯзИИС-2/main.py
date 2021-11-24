from AlphabetMethod import AlphabetMethod
from GramsMethod import GramsMethod
from NeuralMethod import NeuralMethod

if __name__ == '__main__':

    print("Grams method")

    grams_method = GramsMethod("docs/english.html", "docs/franch.html")

    print(grams_method.get_language("docs/test_english.html"))
    print(grams_method.get_language("docs/test_franch.html"))

    print("Alphabet method")

    alphabet_method = AlphabetMethod("docs/english.html", "docs/franch.html")

    print(alphabet_method.get_language("docs/test_english.html"))
    print(alphabet_method.get_language("docs/test_franch.html"))

    print("Neural method")

    print(NeuralMethod('docs/test_english.html').get_result)
    print(NeuralMethod('docs/test_franch.html').get_result)
