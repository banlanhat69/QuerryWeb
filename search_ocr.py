import json
from unidecode import unidecode

with open('data/text.json', 'r', encoding='utf8') as fp:
  data = json.load(fp)

class OCR_search:
  def __init__(self, query):
    self.result = self.searching_text(query)

  def detect_word(self, key: str, finding: str):
    key_len = len(key)
    res = key_len
    if len(finding) == 0: return key_len
    for i, char in enumerate(finding):
      wrong = 0
      for c1, c2 in zip(finding[i:i + key_len], key):
        if c1 != c2:
          wrong += 1
      wrong += (key_len - len(finding[i:i + key_len]))
      if wrong < res: res = wrong 
    return res
  def key_sort(self, value):
    return value[0]
  def key_res(self, value):
    return value[1]
  def sort_res(self, res : list):
    if len(res) > 100:
      final_res = sorted(res, key=self.key_sort)
      final_res = list(map(self.key_res, final_res))
      return final_res[:100]
    else:
      final_res = sorted(res, key=self.key_sort)
      final_res = list(map(self.key_res, final_res))
      return final_res
  def searching_text(self, key: str):
    res = []
    key = unidecode(key)
    key = key.lower()
    key = key.replace(' ', '')
    for id, value in enumerate(data):
      wrong = self.detect_word(key, value)
      if wrong < len(key) // 3:
        res.append([wrong, id])
    res = self.sort_res(res)
    return res
  