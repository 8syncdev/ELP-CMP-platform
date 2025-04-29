from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
import re


class TokenizerVietnamese:
    """
    Custom Vietnamese tokenizer implemented using only regex patterns.
    This tokenizer doesn't require external Vietnamese NLP libraries.
    """

    def __init__(self):
        # Vietnamese sentence ending punctuation
        self.sent_end_chars = r'([.!?;…][\'")\]]*)'

        # Common Vietnamese words for better tokenization
        self.vietnamese_common_words = [
            "và", "hoặc", "nhưng", "vì", "nên", "mà", "tuy", "nếu", "để", "do",
            "bởi", "của", "cho", "với", "trong", "ngoài", "trên", "dưới", "những",
            "các", "một", "hai", "ba", "bốn", "năm", "này", "kia", "đó", "tôi",
            "bạn", "anh", "chị", "ông", "bà", "họ", "chúng", "mình", "là", "có",
            "được", "bị", "sẽ", "đã", "đang", "cần", "muốn", "thích", "yêu", "ghét"
        ]

        # Vietnamese compound vowels to handle correctly
        self.vn_compound_vowels = [
            "oa", "oă", "oe", "ua", "uâ", "ue", "uy", "uyê", "uơ", "uo", "uô",
            "ươ", "ưa", "yê", "ia", "iê", "yo", "œ", "oa", "oè", "oé", "uê",
            "ue", "uy", "uý", "uyê", "uya"
        ]

    def to_sentences(self, text):
        """
        Split Vietnamese text into sentences using regex patterns.

        Args:
            text: String text to split into sentences

        Returns:
            List of sentences
        """
        if not text:
            return []

        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text.strip())

        # Handle abbreviations to avoid incorrect sentence splitting
        common_abbrs = ["TS.", "ThS.", "GS.", "PGS.", "TP.",
                        "T.P", "Q.", "P.", "H.", "TW.", "UBND.", "HĐND."]
        for abbr in common_abbrs:
            # Replace periods in abbreviations with a special marker
            text = text.replace(abbr, abbr.replace(".", "<period>"))

        # Split by sentence ending punctuation
        sentences = re.split(self.sent_end_chars, text)

        # Combine the sentences with their punctuation
        result = []
        for i in range(0, len(sentences) - 1, 2):
            if i+1 < len(sentences):
                result.append(sentences[i] + sentences[i+1])
            else:
                result.append(sentences[i])

        # Clean up sentences
        cleaned_sentences = []
        for s in result:
            # Skip empty sentences
            if not s.strip():
                continue

            # Restore periods in abbreviations
            s = s.replace("<period>", ".")

            # Remove extra whitespace
            s = re.sub(r'\s+', ' ', s.strip())

            # If sentence doesn't end with punctuation, it might be a fragment
            if not re.search(r'[.!?;…]$', s):
                # Only add if it's reasonably long
                if len(s.split()) > 3:
                    cleaned_sentences.append(s)
            else:
                cleaned_sentences.append(s)

        # If no sentences found, return original text as a single sentence
        if not cleaned_sentences and text.strip():
            return [text.strip()]

        return cleaned_sentences

    def to_words(self, text):
        """
        Tokenize Vietnamese text into words using regex patterns.

        Args:
            text: String text to tokenize

        Returns:
            List of words
        """
        if not text:
            return []

        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text.strip())

        # Handle Vietnamese compound words with hyphens: maintain them as single tokens
        # For example: "đông-nam", "tây-bắc"
        text = re.sub(r'(\w+)-(\w+)', r'\1_\2', text)

        # Split by whitespace and punctuation
        words = re.findall(r'\b[\w_]+\b|\S', text)

        # Clean up words
        cleaned_words = []
        for word in words:
            # Skip punctuation and single characters except for Vietnamese single-char words
            if len(word) == 1 and not re.match(r'[aàáảãạăằắẳẵặâầấẩẫậeèéẻẽẹêềếểễệiìíỉĩịoòóỏõọôồốổỗộơờớởỡợuùúủũụưừứửữựyỳýỷỹỵđ]', word.lower()):
                if not word.isalnum():
                    continue

            # Restore hyphens
            word = word.replace('_', '-')

            # Add to results if not empty
            if word.strip():
                cleaned_words.append(word)

        return cleaned_words

    def get_vietnamese_stopwords(self):
        """
        Get a list of Vietnamese stopwords.

        Returns:
            Set of Vietnamese stopwords
        """
        # Common Vietnamese stopwords
        vn_stopwords = set([
            "và", "của", "cho", "là", "để", "trong", "được", "với", "có", "không",
            "những", "một", "các", "đã", "này", "từ", "đến", "theo", "như", "nhưng",
            "còn", "về", "bị", "nhất", "qua", "lại", "vì", "khi", "nên", "người",
            "thì", "đây", "rằng", "mà", "nếu", "cũng", "tại", "tôi", "ra", "hay",
            "trên", "vào", "rồi", "mới", "sau", "sẽ", "thế", "vẫn", "làm", "đó",
            "ai", "mình", "chỉ", "nào", "bạn", "đang", "chúng", "đấy", "quá", "lên",
            "phải", "bởi", "thôi", "vậy", "làm", "rất", "cứ", "ở", "chưa", "lúc",
            "nhiều", "à", "anh", "thật", "đâu", "cùng", "nhé", "à", "vừa", "chứ",
            "xuống", "sao", "vụ", "ừ", "ạ", "nha", "thì", "nói", "ấy", "dù"
        ])
        return vn_stopwords
