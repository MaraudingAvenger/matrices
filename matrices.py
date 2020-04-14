from flask import Flask, request, jsonify, render_template

import numpy as np


app = Flask(__name__)


def make_nd_array(array):
    arr = []
    for sub in array:
        arr.append([int(s) for s in sub])
    return np.array(arr)


@app.route("/")
def index():
    return render_template("index.html", cols="123", rows="abc")


@app.route("/transpose", methods=["POST"])
def transpose():
    data = request.get_json()
    arrays = [np.transpose(make_nd_array(array)).tolist() for array in data["arrays"]]
    return jsonify({"numArrays": len(arrays), "arrays": arrays})


@app.route("/add", methods=["POST"])
def add():
    data = request.get_json()

    arrays = [make_nd_array(arr) for arr in data["arrays"]]

    a = arrays[0]
    for arr in arrays[1:]:
        a = np.add(a, arr)
    
    return jsonify({"arrays": [a.tolist(),]})


@app.route("/subtract", methods=["POST"])
def subtract():
    data = request.get_json()
    arrays = [make_nd_array(arr) for arr in data["arrays"]]

    a = make_nd_array(arrays[0])
    for array in arrays[1:]:
        a = np.subtract(a, array)

    return jsonify({"arrays": [a.tolist(),]})


@app.route("/matmul", methods=["POST"])
def matmul():
    data = request.get_json()
    arrays = [make_nd_array(array) for array in data["arrays"]]
    a = arrays[0]
    for arr in arrays[1:]:
        a = np.matmul(a, arr)

    return jsonify({"numArrays": 1, "arrays": [a.tolist(),]})

if __name__ == "__main__":
    app.run(port=5000)