from flask import Flask, render_template, url_for, request, jsonify
from utils import MyFaiss
from search_ocr import OCR_search
import json
import pandas as pd
app = Flask(__name__)
bin_file = 'data/faiss_cosine.bin'
json_path = 'data/keyframes_id.json'
cosine_faiss = MyFaiss('', bin_file, json_path)

def key_info(data: list):
    return data[1]
def key_video(path):
    return path.split('/')[-2]
def key_frame(path):
    path = path.split('/')[-1]
    return path.split('.')[0]

def change_path(paths: list):
    res = []
    for path in paths:
        path = path.replace('\\', '/')
        path = path.split('/')[-2:]
        path = '/'.join(path)
        path = f'static/keyframes/{path}'
        res.append(path)
    return res

@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        pass
    else:
        return render_template('index.html')

@app.route('/text_search', methods=['POST', 'GET'])
def text_seacrh():
    data = request.get_json()
    query = data['data']
    scores, id_queries, infos_query, image_paths = cosine_faiss.text_search(query, k=100)
    res = []
    for val, key in zip(id_queries, change_path(image_paths)):
        res.append([str(val), key])
    return jsonify(res)

@app.route('/id_search', methods=['POST'])
def id_search():
    data = request.get_json()
    query = data['data']
    scores, id_queries, infos_query, image_paths = cosine_faiss.image_search(int(query), k=100)
    res = []
    for val, key in zip(id_queries, change_path(image_paths)):
        res.append([str(val), key])
    return jsonify(res)

@app.route('/neighbor_search', methods=['POST'])
def neighbor_search():
    res = []
    data = request.get_json()
    query = data['data']
    image_paths, idx_image = cosine_faiss.takeNeighbor(int(query), k=49)
    for img, id in zip(image_paths, idx_image):
        path = img.replace('\\', '/')
        path = path.split('/')[-2:]
        path = '/'.join(path)
        path = f'static/keyframes/{path}'
        res.append([id, path])
    return jsonify(res)

@app.route('/ocr_search', methods=['POST'])
def ocr_search():
    res = []
    data = request.get_json()
    query = data['data']
    res_ocr = OCR_search(query).result
    print(res_ocr)
    with open('data/keyframes_id.json', 'r', encoding='utf8') as fp:
        id_keyframes = json.load(fp)
    for id in res_ocr:
        path_img = list(id_keyframes.values())[id]
        path_img = path_img['image_path']
        path_img = path_img.replace('\\', '/')
        path_img = path_img.split('/')[-2:]
        path_img = '/'.join(path_img)
        path_img = f'static/keyframes/{path_img}'
        res.append([id, path_img])
    return jsonify(res)

@app.route('/save_csv', methods=['POST'])
def save_csv():
    data = request.get_json()
    file_save = data['data']
    file_name = file_save[0]
    if file_name[-4:] != '.csv': file_name += '.csv'
    value = file_save[1]
    vids = []
    frs = []
    for vid, frame in value:
        vids.append(vid)
        frs.append(frame)
    df = pd.DataFrame({'video': vids, 'frame' : frs})
    df.to_csv('result/' + file_name, index=False, header=False)
    return jsonify({'status' : 'success'})

if __name__ == '__main__':
    app.run(debug=True)
