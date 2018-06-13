

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

@app.route("/univ_map/latlondata")
def univ_map():
    location_data = {}
    univ_data = engine.execute('SELECT * FROM address_finances').fetchall()
    location_data['univ_id'] = [data[1] for data in univ_data]
    location_data['name'] = [data[2] for data in univ_data]
    location_data['address'] = [data[3] for data in univ_data]
    location_data['city'] = [data[4] for data in univ_data]
    location_data['zipcode'] = [data[5] for data in univ_data]
    location_data['state_addr'] = [data[6] for data in univ_data]
    location_data['web_addr'] = [data[7] for data in univ_data]
    location_data['lon'] = [data[8] for data in univ_data]
    location_data['lat'] = [data[9] for data in univ_data]
    location_data['acceptance_rate'] = [data[10] for data in univ_data]
    location_data['student_faculty_ratio'] = [data[11] for data in univ_data]
    location_data['in_state_tuition'] = [data[12] for data in univ_data]
    location_data['out_of_state_tuition'] = [data[13] for data in univ_data]
    location_data['total_fin_aid'] = [data[14] for data in univ_data]
    location_data['avg_amt_grant_aid'] = [data[15] for data in univ_data]
    location_data['avg_amt_stu_loan'] = [data[16] for data in univ_data]    
    return jsonify(location_data)

if __name__ == "__main__":
    app.run(debug=True)