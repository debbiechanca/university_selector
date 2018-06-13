import pandas as pd

from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine, func, desc

from flask import (
    Flask,
    render_template,
    jsonify)

# Database Setup
engine = create_engine("sqlite:///university_data.sqlite")
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/univ_map/<latlon>")
def univ_map():
    coord = {}
    univ_data = list(engine.execute('SELECT * FROM address_finances').fetchall())
    majors = list(engine.execute('SELECT * FROM majors').fetchall())
    for data[0] in univ_data:
        coord["lon"] = data[8]
        coord["lat"] = data[9]
    return jsonify(coord)

if __name__ == "__main__":
    app.run(debug=True)