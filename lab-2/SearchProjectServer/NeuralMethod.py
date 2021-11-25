class NeuralMethod:
    __slots__ = ('_path_to_file', '_content')

    LANGUAGES = {
        'en': 'ENGLISH',
        'fr': 'FRANCH'
    }

    def __init__(self, path_to_file: str) -> None:
        self._path_to_file = path_to_file
        self.read_file()

    def read_file(self) -> None:
        with open(self._path_to_file, 'r', encoding='utf-8') as file:
            self._content = file.read()

    @property
    def get_result(self) -> str:
        from langdetect import detect
        return self.LANGUAGES.get(detect(self._content))


