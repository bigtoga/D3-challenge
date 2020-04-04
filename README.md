The data set included with the assignment is based on 2014 ACS 1-year estimates: https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml, but you are free to investigate a different data set. The current data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

### Homework Requirements/Deliverables
| Step  | √ | Requirement |
| Step | √ | Requirement |
| :---: | :---: | :--- 
| 01 | √ | Create a new repository for this project called `D3-challenge`. 
| 02 | √ | create a directory for the D3 challenge. Use the folder name to correspond to the challenge: `D3_data_journalism`.

### Development Requirements: "create a scatter plot between two of the data variables"
| Step | √ | Requirement |
| :---: | :---: | :--- 
| 01 | √ | In `app.js`, create a scatter plot that represents each state `with circle elements`. 
| 02 | √ | pull in the data from `data.csv` by using the `d3.csv` function
| 03 | √ |    - Include state abbreviations in the circles.
| 04 | √ |    - Create and situate your `axes and labels to the left and bottom` of the chart.
| 05 | √ |    - use `python -m http.server` to run the visualization.
| 06 | √ |    - test in your browser with `http://localhost:8000`

### Bonus: Impress the Boss
| Step | √ | Requirement |
| :---: | :---: | :--- 
| 01 | √ | include more demographics and more risk factors
| 02 | √ | Place additional labels in your scatter plot and give them click events
| 03 | √ | Animate the transitions for your circles' locations as well as the range of your axes.
| 04 | √ | Do this for two risk factors for each axis. Or, for an extreme challenge, create three for each axis.
| 05 | √ | Hint: Try binding all of the CSV data to your circles. This will let you easily determine their x or y values when you click the labels.
| 06 | √ | Add tooltips to your circles and display each tooltip with the data that the user has selected
| 07 | √ | Use the `d3-tip.js` plugin developed by Justin Palmer — we've `already included this plugin in your assignment directory`.
| 08 | √ | Review this example: https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7 

### From the grading rubric pdf:
| Step | √ | Requirement |
| :---: | :---: | :--- 
| 01 | √ | ** Data Points ** - the d3 plot has: 
| 02 | √ |    - No missing data points
| 03 | √ |    - Each point has the correct state abbreviation
| 04 | √ |    - Each abbreviation fits inside the circle
| 05 | √ |    - Data points are in correct location based on data
| 06 | √ | ** Axies ** - the d3 plot has:
| 07 | √ |    - Correct x axis title
| 08 | √ |    - Correct y axis title
| 09 | √ |    - Correct x ticks for variable
| 10 | √ |    - Correcy y ticks
| 11 | √ |    - x & y scales are spread out enough to prevent data points from overlapping
| 12 | √ | ** Bonus ** - ** Data Points ** - the d3 plot has:
| 13 | √ |    - All the same as above
| 14 | √ |    - Multiple x axis titles
| 15 | √ |    - Multiple y axis titles
| 16 | √ |    - x ticks and scale update when y variable is changed
| 17 | √ |    - y ticks and scale update when x variable is changed
| 18 | √ | ** Bonus ** - ** Tool Tips ** - the d3 plot has:
| 19 | √ |    - Full state name
| 20 | √ |    - Selected x axis variable and value
| 21 | √ |    - Selected y axis variable and value
| 22 | √ |    - Selected data point gains a border on hover
