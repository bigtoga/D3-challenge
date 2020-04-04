// Cookie cutter code to set SVG dimensions
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 10,
  right: 40,
  bottom: 90,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Cookie cutter code to create the svg element we want to use
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Cookie cutter code to create an svg group element
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

/*
###########################################################
    Global variables 
###########################################################
*/
var transition_duration_sec = 2000;
var debug = true;

// Set the defaut columns to compare:
var chosenXAxis = "poverty", 
    chosenYAxis = "healthcare";

console.log("01 - default x axis: " + chosenXAxis);
console.log("02 - default y axis: " + chosenYAxis);

/*
###########################################################
    Reusable functions
###########################################################
*/
// Copied from the hair metal activity:
// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8, d3.max(data, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);
    return xLinearScale;  
};

// Just a copy of the x-axis one but allows y-axis clicks too
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8, d3.max(data, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);
    return yLinearScale;
};

// Copy of the "renderAxes" function from hair metal activity but just does y axis
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(transition_duration_sec)
        .call(leftAxis);

    return yAxis;
}

// function used for updating x or y axis when they click on a label
// Just a copy of the "renderAxes" function from hair metal activity but does both x and y
function renderAxis(which_axis, the_new_scale_value, the_axis){
    switch(which_axis){
        case "x":
            console.log('   - clicked x axis filter');
            
            var bottomAxis = d3.axisBottom(the_new_scale_value);

            the_axis.transition()
                .duration(transition_duration_sec) // takes one second to do the transition
                .call(bottomAxis);

            return the_axis;
            
            break;
        default:
            console.log('   - clicked y axis filter');
            var leftAxis = d3.axisLeft(the_new_scale_value);

            the_axis.transition()
                .duration(transition_duration_sec)
                .call(leftAxis);

            return the_axis;
    }    
}

// Renders objects on change
// Copied from hair metal activity
function renderMisc(type_of_group, the_group, newXScale, chosenXAxis, newYScale, chosenYAxis) {    
    var desired_x_attrib = "", 
        desired_y_attrib = "";

    switch(type_of_group){
        case "label":
            desired_x_attrib = "x";
            desired_y_attrib = "y";
            console.log("... renderMisc() - generated label");
        default:
            desired_x_attrib = "cx";
            desired_y_attrib = "cy";
            console.log("... renderMisc() - generated cicle");
    }

    the_group.transition()
        .duration(transition_duration_sec)
        .attr(desired_x_attrib, d => newXScale(d[chosenXAxis]))
        .attr(desired_y_attrib, d => newYScale(d[chosenYAxis]));

    return the_group;
}  

// I tried and tried for 40 minutes to make this work as part of renderMisc() but failed - 
function renderLabels(labelsGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  labelsGroup.transition()
    .duration(transition_duration_sec)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

  return labelsGroup;
}

/*
    ########################################################
    Bonus 
    ########################################################
*/
function renderToolTip(circlesGroup, chosenXAxis, chosenYAxis) {
    console.log('... hover - x axis: ' + chosenXAxis);
    console.log('... hover - y axis: ' + chosenYAxis);

    if (chosenXAxis === "poverty") {
        var xlabel = "In poverty: ";
    }
    else if (chosenXAxis === "age") {
        var xlabel = "Median age: ";
    }
    else {
        var xlabel = "Median Household Income: $";
    };  

    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks healthcare: ";
    }
    else if (chosenXAxis === "obesity") {
        var ylabel = "Obese: ";
    }
    else {
        var ylabel = "Smoke: ";
    }
    console.log("... renderToolTip - chosenXAxis: " + chosenXAxis)
    console.log("... renderToolTip - chosenYAxis: " + chosenYAxis)

    // Copied most of this from hair metal activity
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(d => {
            return (`<h4>${d.state}</h4><ul><li>${d.abbr}</li><li>${ylabel}${d[chosenYAxis]}</li><li>${xlabel}${d[chosenXAxis]}</li></ul></span>`
        );
    });

    circlesGroup.call(toolTip);

    // When user hovers over a circle, display the tooltip for that state
    // Had to change for d5 v5 - original:
    //circlesGroup.on("mouseover", function(data) {toolTip.show(data);})
    // Code referenced/found here: https://stackoverflow.com/questions/33122961/svg-getscreenctm-is-not-a-function
    circlesGroup.on('mouseover', (data, index, element) => toolTip.show(data, element[index]))

    // When the cursor leaves the circle, hide the tooltip
    circlesGroup.on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    return circlesGroup;
};



/*
    ###########################################################
    Load the data
    ###########################################################
*/
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(csvdata, err) {
    if (err) throw err;

    // id,state,abbr
    // Remaining fields are all numeric: 
    //      ,poverty,povertyMoe,age,ageMoe,income,incomeMoe
    //      ,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh
    //      ,smokes,smokesLow,smokesHigh,-0.385218228
    csvdata.forEach(data => {
        data.poverty = parseFloat(data.poverty);
        data.age = parseFloat(data.age);
        data.income = parseFloat(data.income);
        data.healthcare = parseFloat(data.healthcare);
        data.smokes = parseFloat(data.smokes);
        data.obesity = parseFloat(data.obesity);
    });

    // Cookie cutter - from hair metal activity:
    // Set the x and y scales
    var xLinearScale = xScale(csvdata, chosenXAxis);
    var yLinearScale = yScale(csvdata, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Add x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Add y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Add circles
    var gGroup = chartGroup.selectAll("g")
        .data(csvdata)
        .enter()
        .append("g")
        .classed("circles", true);

    var circlesGroup = gGroup.append("circle")
        .data(csvdata)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 17)
        .attr("fill", "royalblue")
        .attr("opacity", ".8");

    // label within circle
    var labelsGroup = chartGroup.selectAll(".circles")
        .append("text")
        .text( d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-weight","bold")
        .attr("font-size","10px")
        .attr("x", d => xLinearScale(d[chosenXAxis]))  
        .attr("y", d => yLinearScale(d[chosenYAxis]));

    /*
        ###########################################################
        X axis labels
        ###########################################################
    */
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 55)
        .attr("value", "income") // value to send to event handler
        .classed("inactive", true)
        .text("Median Household Income");
        
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 35)
        .attr("value", "age") // value to send to event handler
        .classed("inactive", true)
        .text("Median Age");

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 15)
        .attr("value", "poverty") // value to send to event handler
        .classed("active", true)
        .text("In Poverty (%)");

    /*
        ###########################################################
        Y axis labels
        ###########################################################
    */
    var yLabelsGroup = chartGroup.append("g").attr("transform", "rotate(-90)")

    var lblSmokers = yLabelsGroup.append("text")
        .attr("x", 0 - (height/2))
        .attr("y", -40 - (margin.left/3))
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokers (%)");

    var lblObese = yLabelsGroup.append("text")
        .attr("x", 0 - (height/2))
        .attr("y", -20 - (margin.left/3))
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese (%)");   

    var lblHealthcare = yLabelsGroup.append("text")
        .attr("x", 0 - (height/2))
        .attr("y", 0 - (margin.left/3))
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");    

    // renderToolTip function above csv import
    var circlesGroup = renderToolTip(circlesGroup, chosenXAxis, chosenYAxis);
    /*
        ###########################################################
        X axis event handler
        ###########################################################
    */
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");

            if (value !== chosenXAxis) {
                // replaces chosenXaxis with value
                chosenXAxis = value;

                // updates x scale for new data
                xLinearScale = xScale(csvdata, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxis('x', xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderMisc('circle', circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis) 

                // updates tooltips with new info
                circlesGroup = renderToolTip(circlesGroup, chosenXAxis, chosenYAxis);

                // Add state abbreviations
                labelsGroup = renderLabels(labelsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // labelsGroup = renderMisc('label', labelsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis) 

                // changes classes to change bold text
                if (chosenXAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    }
                else if (chosenXAxis === "age") {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    }
                else {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
    
    /*
        ###########################################################
        Y axis event handler
        ###########################################################
    */
    yLabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");

        if (value !== chosenYAxis) {
            // replace chosenYaxis 
            chosenYAxis = value;
            
            // update y scale 
            yLinearScale = yScale(csvdata, chosenYAxis);

            // update y axis 
            yAxis = renderAxis('y', yLinearScale, yAxis);

            // update circles 
            circlesGroup = renderMisc('circle', circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // update tooltips 
            circlesGroup = renderToolTip(circlesGroup, chosenYAxis);
            labelsGroup = renderLabels(labelsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Show bold or not bold depending on selected
            if (chosenYAxis === "smokes") {
                    lblSmokers
                        .classed("active", true)
                        .classed("inactive", false);
                    lblObese
                        .classed("active", false)
                        .classed("inactive", true);
                    lblHealthcare
                        .classed("active", false)
                        .classed("inactive", true);
                    }
                else if (chosenYAxis === "obesity") {
                    lblSmokers
                        .classed("active", false)
                        .classed("inactive", true);
                    lblObese
                        .classed("active", true)
                        .classed("inactive", false);
                    lblHealthcare
                        .classed("active", false)
                        .classed("inactive", true);
                    }
                else {
                    lblSmokers
                        .classed("active", false)
                        .classed("inactive", true);
                    lblObese
                        .classed("active", false)
                        .classed("inactive", true);
                    lblHealthcare
                        .classed("active", true)
                        .classed("inactive", false);
                    }
                }
        });
}).catch(function(error) {
    console.log(error);
});

$(document).ready(function(){
    console.log('03. document.ready()')

    // Show the default set of data on page load:
    d3.select("#poverty_healthcare").style("display", "inline");
    // equivalent to:
    // document.getElementById("poverty_healthcare").style.display = 'inline';
})