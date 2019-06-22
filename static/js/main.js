


d3.select(window).on("resize", handleResize);

// credit source: https://github.com/wbkd/d3-extended - This feature replicates a dynamic z-index capability to bring datapoints of interest to the foreground on mouseover.
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};
d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};
//end credit

// loadChart();


function formatter(number) {
    var formatted = numeral(number).format('($ 0.00 a)');
    return formatted;
}


function colorer(sport) {
    switch (sport) {
        case 'mlb':
            // color = "#dfec93";
            color = "#f68838";
            break;
        case 'nba':
            color = "#fc444d";
            break;
        case 'nfl':
            color = "#27c480";
            break;
        default: color = "#fffff"
    }
    return color;
}


function handleResize() {
    var svgArea = d3.selectAll(".scatter_plot");

    if (!svgArea.empty()) {
        svgArea.remove();
        loadChart();
    }
}
loadChart();
function changesportSelection(sel) {
    // d3.select("svg").remove();
    d3.selectAll(".scatter_plot").remove();

    var sport_options = document.getElementById("sport-inds").getElementsByTagName("option");
    sel.options[sel.selectedIndex].id = "sport-selected";
    for (i = 0; i < sport_options.length; i++) {
        sport_options[i].id = "";
        console.log(sport_options[i]);
    }
    sel.options[sel.selectedIndex].id = "sport-selected";

    loadChart()
}
function changeyearSelection(sel) {
    // d3.select("svg").remove();
    d3.selectAll(".scatter_plot").remove();

    var year_options = document.getElementById("year-inds").getElementsByTagName("option");
    sel.options[sel.selectedIndex].id = "year-selected";
    for (i = 0; i < year_options.length; i++) {
        year_options[i].id = "";
        console.log(year_options[i]);
    }
    sel.options[sel.selectedIndex].id = "year-selected";


    loadChart()
}

// var all_sports = document.getElementById("sport-inds");
// var selected_sport = sel.options[sel.selectedIndex].value;
// alert(all_sports);

// alert(selected_sport);





function loadChart() {
    var svgWidth = 660;
    var svgHeight = 500;

    var margin = {
        top: 30,
        right: 40,
        bottom: 100,
        left: 100
    };

    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("#scatter").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)
        .classed("scatter_plot", true)
        ;
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    d3.csv("../static/data/all_attendance_keys.csv").then(function (allcsvData) {
        // console.log(d3.select("#sport-selected").node().value); 
        console.log(d3.select("#year-selected").node().value);

        var csvData = allcsvData.filter(function (d) {

            if (d["sport"] == d3.select("#sport-selected").node().value) {

                return d;
            }

        })

        var csvData = csvData.filter(function (d) {

            if (d["year"] == d3.select("#year-selected").node().value) {

                return d;
            }

        })





        var t = chartGroup.transition().duration(800).ease(d3.easeCubic);

        var csvData = csvData.sort(function (b, a) { return b.Spend - a.Spend });
        var x_val = 'Salary Spend: ';
        var y_val = 'Percent Capacity: ';
        var x_unit = ' usd';
        var y_unit = '%';
        var x_data = csvData.map(csvDatum => +csvDatum.Spend);
        var y_data = csvData.map(csvDatum => +csvDatum.Attendance);
        var rank = csvData.map(csvDatum => +csvDatum.RK);
        var year = csvData.map(csvDatum => +csvDatum.year);
        var sport = csvData.map(csvDatum => csvDatum.sport);
        var team = csvData.map(csvDatum => csvDatum.Team_Name);
        var state = csvData.map(csvDatum => csvDatum.state);

        var x_min = d3.min(x_data) * 0.85;
        var x_max = d3.max(x_data) * 1.15;
        var y_min = d3.min(y_data) * 0.85;
        var y_max = d3.max(y_data) * 1.15;

        var xScale = d3.scaleLinear()
            .domain([x_min, x_max])
            .range([0, chartWidth])
            ;

        var yScale = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([chartHeight, 0])
            ;

        var yAxis = d3.axisLeft(yScale).ticks(10);
        var xAxis = d3.axisBottom(xScale).ticks(10);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .attr('id', "x_axis_line")
            .call(xAxis)
            .selectAll("text")

            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-35)");
        ;

        chartGroup.append("g")
            .attr('id', "y_axis_line")
            .call(yAxis)
            ;


        var div = d3.select("body").append("div")
            .attr("class", "d3-tip")
            .style("opacity", 0);


        // chartGroup.selectAll("circle")
        //     .data(csvData)
        //     .enter()
        //     .append("circle")
        //     .attr("class", "dotCircle")
        //     .style("fill", (d, i) => colorer(sport[i]))
        //     .attr("cx", (d, i) => xScale(x_data[i]))
        //     .attr("cy", (d, i) => yScale(y_data[i]))
        //     .attr("r", 5)
        //     .attr("width", (d, i) => chartWidth - xScale(x_data[i]))
        //     .attr("height", (d, i) => chartHeight - yScale(y_data[i]))
        //     .on('mouseover', function (d, i) {
        //         d3.select(this).moveToFront().transition(t);
        //         div.transition(t)
        //             .duration(50)
        //             .style("opacity", 1);
        //         div.html(team[i] + " (" + year[i] + ")" + "<br/>"
        //             + x_val + formatter(x_data[i])
        //             + x_unit + "<br/>"
        //             + y_val + y_data[i] + y_unit)
        //             .style("left", (d3.event.pageX + 20) + "px")
        //             .style("top", (d3.event.pageY - 20) + "px");
        //     })
        //     .on('mouseout', function (d, i) {
        //         d3.select(this).moveToBack().transition(t)
        //             .attr('opacity', '1');
        //         div.transition(t).style("opacity", 0);
        //     });


        chartGroup.selectAll("circle")
            .data(csvData)
            .enter()
            .append("circle")
            .attr("class", "dotCircle")
            .style("fill", (d, i) => colorer(sport[i]))
            .attr("cx", (d, i) => xScale(x_data[i]))
            .attr("cy", (d, i) => yScale(y_data[i]))
            .attr("r", 5)
            .attr("width", (d, i) => chartWidth - xScale(x_data[i]))
            .attr("height", (d, i) => chartHeight - yScale(y_data[i]))
            .on('mouseover', function (d, i) {
                d3.select(this).moveToFront().transition(t);
                div.transition(t)
                    .duration(50)
                    .style("opacity", 1);
                div.html("<img class='tooltip_logo' src='../static/images/"+ team[i] + ".png'/>" + team[i] + " (" + year[i] + ")" + "<br/>"
                    + x_val + formatter(x_data[i])
                    + x_unit + "<br/>"
                    + y_val + y_data[i] + y_unit)
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 20) + "px");
            })
            .on('mouseout', function (d, i) {
                d3.select(this).moveToBack().transition(t)
                    .attr('opacity', '1');
                div.transition(t).style("opacity", 0);
            });




        // chartGroup.selectAll("dotCircle")
        //   .data(csvData)
        //   .enter()
        //   .append("text")
        //   .attr("class", "dotText")
        //   .attr("x", (d, i) => xScale(x_data[i]))
        //   .attr("y", (d, i) => yScale(y_data[i]))
        //   .text((d, i) => rank[i])
        //   .attr("dy", ".35em")

        //   ;

        var yAxis_var = [["Attendance (%)", csvData.map(csvDatum => +csvDatum.Attendance
        ), 0, "Percent Capacity: ", "% Capacity"], ["Success (%)", csvData.map(csvDatum => +csvDatum.SM), 0, "Success Metric: ", ""]
            // , ["Performance", csvData.map(csvDatum => +csvDatum.PF), 0, "Performance: ", ""]
        ];

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .attr("dx", "6em")
            .attr("id", "y_axis_1")
            .attr("class", "active")
            .text(yAxis_var[0][0])
            ;
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("dx", "-6em")
            .attr("id", "y_axis_2")
            .attr("class", "inactive")
            .text(yAxis_var[1][0])
            ;
        // chartGroup.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - margin.left)
        //     .attr("x", 0 - (chartHeight / 2))
        //     .attr("dy", "1em")
        //     .attr("dx", "9em")

        //     .attr("id", "y_axis_3")
        //     .attr("class", "inactive")
        //     .text(yAxis_var[2][0])
        //     ;

        var xAxis_var = ["Salary Spend ($)", csvData.map(csvDatum => +csvDatum.Spend), 0];

        chartGroup.append("text")
            .attr("transform",
                "translate(" + (chartWidth / 2) + " ," +
                (chartHeight + margin.top) + ")")
            .attr("dy", "2.5em")
            .attr("id", "x_axis_1")
            .attr("class", "active")
            .text(xAxis_var[0])
            ;



        // function updatex_axis() {
        //   x_min = d3.min(x_data) * 0.85;
        //   x_max = d3.max(x_data) * 1.15;


        //   var xScale = d3.scaleLinear()
        //     .domain([x_min, x_max])
        //     .range([0, chartWidth])
        //     ;

        //   var xAxis = d3.axisBottom(xScale).ticks(10);
        //   chartGroup.select("#x_axis_line").transition(t).call(xAxis);
        //   chartGroup.selectAll("circle").data(x_data)
        //     .on('mouseover', function (d, i) {
        //       d3.select(this).transition(t);
        //       div.transition(t)
        //         .duration(50)
        //         .style("opacity", 1);
        //       div.html(rank[i] + "<br/>"
        //         + x_val + x_data[i] + x_unit + "<br/>"
        //         + y_val + y_data[i] + y_unit)
        //         .style("left", (d3.event.pageX + 20) + "px")
        //         .style("top", (d3.event.pageY - 20) + "px");
        //     })
        //     .on('mouseout', function (d, i) {
        //       d3.select(this).transition(t)
        //         .attr('opacity', '1');
        //       div.transition(t).style("opacity", 0);
        //     })


        //   chartGroup.selectAll(".dotCircle").transition(t)
        //     .attr("cx", (d, i) => xScale(x_data[i]));

        //   chartGroup.selectAll(".dotText").transition(t)
        //     .attr("x", (d, i) => xScale(x_data[i]));

        // }





        function updatey_axis() {
            y_min = d3.min(y_data) * 0.85;
            y_max = d3.max(y_data) * 1.15;

            var yScale = d3.scaleLinear()
                .domain([y_min, y_max])
                .range([chartHeight, 0])
                ;

            var yAxis = d3.axisLeft(yScale).ticks(10);
            chartGroup.select("#y_axis_line").transition(t).call(yAxis);
            chartGroup.selectAll("circle").data(y_data)
                .on('mouseover', function (d, i) {
                    d3.select(this).transition(t);
                    div.transition(t)
                        .duration(50)
                        .style("opacity", 1);
                    div.html("<img class='tooltip_logo' src='../static/images/"+ team[i] + ".png'/>" +team[i] + " (" + year[i] + ")" + "<br/>"
                        + x_val + formatter(x_data[i])
                        + x_unit + "<br/>"
                        + y_val + y_data[i] + y_unit)
                        .style("left", (d3.event.pageX + 20) + "px")
                        .style("top", (d3.event.pageY - 20) + "px");
                })
                .on('mouseout', function (d, i) {
                    d3.select(this).transition(t).attr('opacity', '1');
                    div.transition(t).style("opacity", 0);
                })



            chartGroup.selectAll(".dotCircle").transition(t)
                .attr("cy", (d, i) => yScale(y_data[i]));

            // chartGroup.selectAll(".dotText").transition(t)
            //     .attr("y", (d, i) => yScale(y_data[i]));

        }









        chartGroup.selectAll("#y_axis_1, #y_axis_2").on("click", function updateClass() {
            d3.selectAll("#y_axis_1, #y_axis_2").attr("class", "inactive");
            d3.select(this).attr("class", "active");

            var selected_axis = d3.select(this).attr("id");

            switch (selected_axis) {
                case 'y_axis_1':
                    y_data = csvData.map(csvDatum => +csvDatum.Attendance);
                    y_val = "Attendance: ";
                    y_unit = "%";
                    updatey_axis();

                    ;

                    break;
                case 'y_axis_2':
                    y_data = csvData.map(csvDatum => +csvDatum.SM);
                    y_val = "Success Metric: ";
                    y_unit = "%";
                    updatey_axis();

                    ;
                    break;

                default:
                    console.log('No y_axis selected');

            }


        })




    })

        ;
}
