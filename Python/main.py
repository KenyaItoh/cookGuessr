from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

from scraper import scrape, scrape_alternative

#API Server
app = Flask(
    __name__,
)

CORS(app)

@app.route('/single/', methods=['POST'])
def index_get_problem_single():
    d = scrape()
    return jsonify(
        d,
    )

@app.route('/alternative/', methods=['POST'])
def index_get_problem_alternative():
    d = scrape_alternative()
    return jsonify(
        d,
    )

if __name__ == '__main__':
    app.run()