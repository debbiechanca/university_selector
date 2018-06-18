# Colleges and Universities - Which is the right place?

<p align="center">
  <img width="500" height="300" src="Images/higher_ed.jpg">
</p>

With so many good colleges and universities out there, which is the best fit for you and your student?  There are many criteria to look at such as tuition in-state and out-of-state, acceptance rate, location, financial aid, etc.  With this project, we will explore some of these factors to help with reaching an intelligent decision.

For some of us, this topic will be researched and explored further in the near future!

## Project Team:
* Rupali Shah
* Sara Rouzbehani
* Debbie Chan

## Datasets - for Academic Year 2015 - 2016 within the United States

*  [NCES National Center for Education Statistics](https://nces.ed.gov/ipeds/use-the-data)

* [College Scorecard Data](http://api.data.gov/ed/collegescorecard/) was not used since data was pulled from NCES site also.

Data on the NCES site was downloaded as a csv file with final dataset loaded into SQLite.

### Visualizations

#### Interactive map of all universities within the United States and Puerto Rico by acceptance rate created using Leaflet.
<p align="center">
  <img width="600" height="400" src="Images/map_all_universities.png">
</p>

---
#### Interactive stacked bar chart based on filtered data by state and major field created using chart.js.
<p align="center">
  <img width="600" height="400" src="Images/demographic_chart.png">
</p>

---
#### Interactive combination chart of bar and lines to compare tuition and financial aid by universities  based on filtered data by state and major field created using plotly.js.

This visualization was created to show the cost of tuition and the average amount that can be covered with grants and financial aid.  Cost is normally one of the determining factors in choosing a university.  Once a smaller list has been determined, cost and financial aid comparison would be helpful in narrowing down the list of candidates even more.

<p align="center">
  <img width="600" height="400" src="Images/tuition_finaid_chart.png">
</p>

### Built With

* Database - SQLite
* Visualizations - Leaflet, chart.js, plotly.js
* Framework - Flask


### GitHub respository

https://github.com/debbiechanca/university_selector.git
