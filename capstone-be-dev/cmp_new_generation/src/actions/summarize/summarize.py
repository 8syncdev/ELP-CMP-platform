from sumy.summarizers.lsa import LsaSummarizer
from sumy.parsers.plaintext import PlaintextParser
from .tokenizer import TokenizerVietnamese


def summarize(text: str, num_sentences: int = 5):
    tokenizer = TokenizerVietnamese()
    parser = PlaintextParser.from_string(text, tokenizer)
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, num_sentences)
    return " ".join(str(sentence) for sentence in summary)
