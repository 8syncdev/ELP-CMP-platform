from googlesearch import search
import re
import requests
from trafilatura import extract

# regrex collect url of website has content
regex_url = r"https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)"


def search_google(query: str, num_results: int = 5, start_num: int = 0):
    list_url = search(query, num_results=num_results, start_num=start_num)
    list_url = [url for url in list_url if re.match(regex_url, url)]
    return list_url


def get_content_from_url(url: str):
    response = requests.get(url)
    return extract(response.text)


def get_content_from_urls(urls: list[str]):
    list_content = []
    for url in urls:
        list_content.append(get_content_from_url(url))
    return list_content
