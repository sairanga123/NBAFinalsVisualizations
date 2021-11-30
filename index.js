
let displayedPointsTeam = false;  
let displayedAssistsTeam = false; 
let displayedReboundsTeam = false; 
let buttonClicked = true; 

async function switchVisualization() { 
    let lakersBarChart = document.getElementById("lakersBarChart"); 
    let teamStats = document.getElementById("teamStatistics");
    let pointsTeamChart = document.getElementById("teamPoints"); 
    let teamStatsButton = document.getElementById("teamStats"); 

    let teamParameterButton = document.getElementById("buttonSlidersForTeam"); 
    let pieChartButton = document.getElementById("pieStats"); 

    if(buttonClicked) { 
        teamStatsButton.innerHTML = "Championship Stats"; 
        buttonClicked = false; 
    } else { 
        teamStatsButton.innerHTML = "Team Statistics"; 
        buttonClicked = true; 
    }


    if(lakersBarChart.style.display != "none") { 
        lakersBarChart.style.display = "none"; 
        pieChartButton.style.visibility = "hidden"; 
        teamStats.style.display = "block"; 
        pointsTeamChart.style.display = "block"; 
        teamParameterButton.style.display = "block"; 


        const data = await d3.csv(
            'https://raw.githubusercontent.com/sairanga123/NBAFinalsVisualizations/main/championsdata.csv'
        ); 
    
        console.log(data[0]); 
        
        if(!displayedPointsTeam) { 
            getPointsChartForTeam(data);
            displayedPointsTeam = true; 
        }  

        if(!displayedAssistsTeam) { 
            getAssistsChartForTeam(data); 
            displayedAssistsTeam = true; 
        } 

        if(!displayedReboundsTeam) { 
            getReboundsChartForTeam(data); 
            displayedReboundsTeam = true; 
        } 
        //getAssistsChartForTeam(data); 
        //getReboundsChartForTeam(data);

    } else { 
        lakersBarChart.style.display = "block"; 
        pieChartButton.style.visibility = "visible"; 
        teamStats.style.display = "none"; 
        pointsTeamChart.style.display = "none";
        teamParameterButton.style.display = "none"; 
 


    } 
}

function displayPointsTeamChart() { 

    let pointsTeamChart = document.getElementById("teamPoints"); 
    let assistsTeamChart = document.getElementById("teamAssists"); 
    let reboundsTeamChart = document.getElementById("teamRebounds"); 

    pointsTeamChart.style.display = "block"; 
    assistsTeamChart.style.display = "none"; 
    reboundsTeamChart.style.display = "none"; 


}

function displayAssistsTeamChart() { 

    let pointsTeamChart = document.getElementById("teamPoints"); 
    let assistsTeamChart = document.getElementById("teamAssists"); 
    let reboundsTeamChart = document.getElementById("teamRebounds"); 

    pointsTeamChart.style.display = "none"; 
    assistsTeamChart.style.display = "block"; 
    reboundsTeamChart.style.display = "none"; 

}

async function displayPieVisualization() { 
    let lakersBarChart = document.getElementById("lakersBarChart"); 
    let teamStats = document.getElementById("teamStatsPage");
    let pointsTeamChart = document.getElementById("teamPoints"); 
    let teamStatsButton = document.getElementById("teamStats"); 

    let teamParameterButton = document.getElementById("buttonSlidersForTeam"); 
    let pieStatsButton = document.getElementById("pieStats"); 

    let pieStateTitle1 = document.getElementById("pieChartSvgTitle"); 
    let pieStateTitle2 = document.getElementById("pieChartSvgRunnerUpTitle"); 



    let pieChart = document.getElementById("pieChart");
    let pieChartEx =  document.getElementById("pieChartEx")

    if(lakersBarChart.style.display != "none") { 
        lakersBarChart.style.display = "none"; 
        pieChart.style.display = "block"; 
        teamStatsButton.style.visibility = "hidden"; 
        pieStatsButton.innerHTML = "Championship Stats"; 
        pieStateTitle1.style.display = "block"; 
        pieStateTitle2.style.display = "block"; 
        pieChartEx.style.display = "block"; 

    } else { 
        console.log("going back to Championship bar chart")
        lakersBarChart.style.display = "block"; 
        pieChart.style.display = "none"; 
        pieStatsButton.innerHTML = "Free Throw Charts"; 
        teamStatsButton.style.visibility = "visible"; 
        pieStateTitle1.style.display = "none";
        pieStateTitle2.style.display = "none"; 
        pieChartEx.style.display = "none"; 


    }

    const data = await d3.csv(
        'https://raw.githubusercontent.com/sairanga123/NBAFinalsVisualizations/main/championsdata.csv'
    ); 

    pie_nested_data = d3.nest()
    .key(function(d){return d.Team; }) 
    .rollup(function(v) { return d3.mean(v, function(d) { return Math.round((d.FTP*100),2); }); })
    .entries(data);

    //console.log(pie_nested_data[0]); 
    let values = []; 
    let teams = []; 
    for(let i = 0; i < pie_nested_data.length; i++) {
        values.push(pie_nested_data[i].value); 
        teams.push(pie_nested_data[i].key); 
    }

    console.log(values); 

    var margin = 300
    var width = 500
    var height = 400
    var pie = d3.pie();
    var arc = d3.arc().innerRadius(0).outerRadius(300);

    var chart = d3.select("#pieChartSvg");
    var color = ['#552583','#007A33','#006BB6','#C8102E','#CE1141','#C4CED4', '#000000','#98002E','#00538C','#FFC72C','#860038'];

    chart.attr("width",width + 2 * margin)
        .attr("height",800)
        .append("g")
                .attr("transform","translate(" + margin + "," + margin + ")")
    .selectAll("path")
    .data(pie(values))
    .enter()
    .append("path")
    .attr("d",arc)
    .attr("fill",function(d,i) {return color[i];})
    .on("mouseover", function(d,i) {
        d3.select("#tooltip").style('opacity', 1);
        d3.select("#tooltipTitle").text(teams[i]);
        d3.select("#value").text(parseFloat(values[i]).toFixed(2)); 
      })
      .on("mousemove", function(d) {
        d3.select("#tooltip").style("top", (d3.event.pageY - 10) + "px")
        .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select("#tooltip").style('opacity', 0);
      });

    const runner_up_data = await d3.csv(
        'https://raw.githubusercontent.com/sairanga123/NBAFinalsVisualizations/main/runnerupsdata.csv'
    ); 

    pie_nested_data_runnerup = d3.nest()
    .key(function(d){return d.Team; }) 
    .rollup(function(v) { return d3.mean(v, function(d) { return Math.round((d.FTP*100),2); }); })
    .entries(runner_up_data);

    let runnerup_values = []; 
    let runnerup_teams = []; 
    for(let i = 0; i < pie_nested_data_runnerup.length; i++) {
        runnerup_values.push(pie_nested_data_runnerup[i].value); 
        runnerup_teams.push(pie_nested_data_runnerup[i].key); 
    }

    console.log(runnerup_teams); 
    var margin = 400
    var width = 400
    var height = 300
    var pie = d3.pie();
    var arc = d3.arc().innerRadius(0).outerRadius(300);

    var chart2 = d3.select("#pieChartSvgRunnerUp");
    var color = ['#552583','#007A33','#006BB6','#C8102E','#CE1141','#C4CED4', '#000000','#98002E','#00538C','#FFC72C','#860038'];

    chart2.attr("width",width + 2 * margin)
        .attr("height",height + 2 * margin)
        .append("g")
                .attr("transform","translate(" + margin + "," + margin + ")")
    .selectAll("path")
    .data(pie(values))
    .enter()
    .append("path")
    .attr("d",arc)
    .attr("fill",function(d,i) {return color[i];})
    .on("mouseover", function(d,i) {
        d3.select("#tooltip2").style('opacity', 1);
        d3.select("#tooltipTitle2").text(runnerup_teams[i]);
        d3.select("#value2").text(parseFloat(runnerup_values[i]).toFixed(2)); 
      })
      .on("mousemove", function(d) {
        d3.select("#tooltip2").style("top", (d3.event.pageY - 10) + "px")
        .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select("#tooltip2").style('opacity', 0);
      });


}

function displayReboundsTeamChart() { 

    let pointsTeamChart = document.getElementById("teamPoints"); 
    let assistsTeamChart = document.getElementById("teamAssists"); 
    let reboundsTeamChart = document.getElementById("teamRebounds"); 

    pointsTeamChart.style.display = "none"; 
    assistsTeamChart.style.display = "none"; 
    reboundsTeamChart.style.display = "block"; 

}

async function getDataHelper() { 
    const data = await d3.csv(
        'https://raw.githubusercontent.com/sairanga123/NBAFinalsVisualizations/main/championsdata.csv'
    ); 
    return data; 
}

function getPointsChartForTeam(data) { 
    points_nested_data = d3.nest()
    .key(function(d){return d.Year; }) 
    .key(function(d){return d.Team; }) 
    .rollup(function(v) { return d3.mean(v, function(d) { return Math.round(d.PTS); }); })
    .entries(data);

       // set the dimensions and margins of the graph
       var margin = {top: 10, right: 30, bottom: 30, left: 60},
       width = 1400 - margin.left - margin.right,
       height = 500 - margin.top - margin.bottom;
       tooltip = { width: 100, height: 100, x: 10, y: -30 };

       // append the svg object to the body of the page
       var svgpoints = d3.select("#teamPoints")
       .append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform",
           "translate(" + margin.left + "," + margin.top + ")"); 

    /// console.log(nested_data[0].values[0].key); getTeam 

    console.log(points_nested_data[0].key); 
    console.log(typeof(points_nested_data[0].values[0].value)); 

    var x = d3.scaleTime()
      .domain(d3.extent(points_nested_data, function(d) { return Date.parse(d.key); }))
      .range([ 0, width ]);
    
    svgpoints.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(points_nested_data, function(d) { return +d.values[0].value; })])
      .range([ height, 0 ]);

    svgpoints.append("g")
      .call(d3.axisLeft(y));
    
      svgpoints.append("path")
      .datum(points_nested_data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(Date.parse(d.key)) })
        .y(function(d) { return y(d.values[0].value) })
        )
    
        svgpoints.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Year");
    
        svgpoints.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 7)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Average Points");
    
        var focus = svgpoints.append("g")
            .attr("class", "focus")
            .style("display", "none");

        /* 
        focus.append("circle")
            .attr("r", 5);
        */ 

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 225)
            .attr("height", 100)
            .attr("x", 500)
            .attr("y", 250)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-team")
            .attr("x", 570)
            .attr("y", 270);

        focus.append("text")
            .attr("x", 510)
            .attr("y", 290)
            .text("Avg Points Scored:  ");

        focus.append("text")
            .attr("class", "tooltip-points")
            .attr("x", 680)
            .attr("y", 290);
        
        focus.append("text")
            .attr("x", 510)
            .attr("y", 310)
            .text("Year: ");
        
        focus.append("text")
            .attr("class", "tooltip-year")
            .attr("x", 680)
            .attr("y", 310);
        
        focus.append("text")
            .attr("class", "tooltip-points-caption")
            .attr("x", 505)
            .attr("y", 330)
            .text("Points over 7 game series ");
            

            svgpoints.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

            var bisectDate = d3.bisector(function(d) { return d.key; }).left; 

            console.log(points_nested_data.find(x => x.key === '1980'));  


            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]); 
                var i = bisectDate(points_nested_data, x0, 1); 
                var year = x0.getFullYear();
                console.log(typeof(year))
                let d0 = points_nested_data.find(x => x.key === year.toString()); 

                //focus.attr("transform", "translate(" + x(d0["key"]) + "," + y(d0["values"][0].value) + ")");
                focus.select("circle.y")                       
                .attr("transform",                             
                  "translate(" + x(d0["key"]) + "," +        
                                 y(d0["values"][0].value) + ")");
                focus.select(".tooltip-points").text(Math.round(d0["values"][0].value));
                focus.select(".tooltip-team").text(d0["values"][0].key);
                focus.select(".tooltip-year").text(d0["key"]);

            }
    
}

function getAssistsChartForTeam(data) { 
    assists_nested_data = d3.nest()
    .key(function(d){return d.Year; }) 
    .key(function(d){return d.Team; }) 
    .rollup(function(v) { return d3.mean(v, function(d) { return Math.round(d.AST); }); })
    .entries(data);

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1400 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svgassists = d3.select("#teamAssists")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");    
    

        var x = d3.scaleTime()
        .domain(d3.extent(assists_nested_data, function(d) { return Date.parse(d.key); }))
        .range([ 0, width ]);
      
      svgassists.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));
  
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(assists_nested_data, function(d) { return +d.values[0].value; })])
        .range([ height, 0 ]);
  
      svgassists.append("g")
        .call(d3.axisLeft(y));
      
        svgassists.append("path")
        .datum(assists_nested_data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return x(Date.parse(d.key)) })
          .y(function(d) { return y(d.values[0].value) })
          )
      
          svgassists.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", width)
          .attr("y", height - 6)
          .text("Year");
      
          svgassists.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", 7)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Average Assists");
        
          var focus = svgassists.append("g")
            .attr("class", "focus")
            .style("display", "none");

          focus.append("rect")
          .attr("class", "tooltip")
          .attr("width", 225)
          .attr("height", 100)
          .attr("x", 500)
          .attr("y", 250)
          .attr("rx", 4)
          .attr("ry", 4);

      focus.append("text")
          .attr("class", "tooltip-team")
          .attr("x", 570)
          .attr("y", 270);

      focus.append("text")
          .attr("x", 510)
          .attr("y", 290)
          .text("Avg Assists Scored:  ");

      focus.append("text")
          .attr("class", "tooltip-assists")
          .attr("x", 680)
          .attr("y", 290);
        
      focus.append("text")
          .attr("x", 510)
          .attr("y", 310)
          .text("Year: ");
      
      focus.append("text")
          .attr("class", "tooltip-year")
          .attr("x", 680)
          .attr("y", 310);
      
      focus.append("text")
          .attr("class", "tooltip-assists-caption")
          .attr("x", 505)
          .attr("y", 330)
          .text("Assists over 7 game series ");

          svgassists.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);

          var bisectDate = d3.bisector(function(d) { return d.key; }).left; 

          console.log(points_nested_data.find(x => x.key === '1980'));  


          function mousemove() {
              var x0 = x.invert(d3.mouse(this)[0]); 
              var i = bisectDate(points_nested_data, x0, 1); 
              var year = x0.getFullYear();
              console.log(typeof(year))
              let d0 = assists_nested_data.find(x => x.key === year.toString()); 

              //focus.attr("transform", "translate(" + x(d0["key"]) + "," + y(d0["values"][0].value) + ")");
              focus.select("circle.y")                       
              .attr("transform",                             
                "translate(" + x(d0["key"]) + "," +        
                               y(d0["values"][0].value) + ")");
              focus.select(".tooltip-assists").text(Math.round(d0["values"][0].value));
              focus.select(".tooltip-team").text(d0["values"][0].key);
              focus.select(".tooltip-year").text(d0["key"]);

          }

}

function getReboundsChartForTeam(data) { 
    rebounds_nested_data = d3.nest()
    .key(function(d){return d.Year; }) 
    .key(function(d){return d.Team; }) 
    .rollup(function(v) { return d3.mean(v, function(d) { return (d.TRB); }); })
    .entries(data);

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1400 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svgrebounds = d3.select("#teamRebounds")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");    
    

        var x = d3.scaleTime()
        .domain(d3.extent(rebounds_nested_data, function(d) { return Date.parse(d.key); }))
        .range([ 0, width ]);
      
      svgrebounds.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));
  
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(rebounds_nested_data, function(d) { return +d.values[0].value; })])
        .range([ height, 0 ]);
  
      svgrebounds.append("g")
        .call(d3.axisLeft(y));
      
        svgrebounds.append("path")
        .datum(assists_nested_data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return x(Date.parse(d.key)) })
          .y(function(d) { return y(d.values[0].value) })
          )
      
          svgrebounds.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", width)
          .attr("y", height - 6)
          .text("Year");
      
          svgrebounds.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", 7)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Average Rebounds");

          var focus = svgrebounds.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 235)
            .attr("height", 100)
            .attr("x", 500)
            .attr("y", 320)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-team")
            .attr("x", 570)
            .attr("y", 340);

        focus.append("text")
            .attr("x", 510)
            .attr("y", 360)
            .text("Avg Rebounds Scored:  ");

        focus.append("text")
            .attr("class", "tooltip-rebounds")
            .attr("x", 680)
            .attr("y", 360);
        
        focus.append("text")
            .attr("x", 510)
            .attr("y", 380)
            .text("Year:  ");

        focus.append("text")
            .attr("class", "tooltip-year")
            .attr("x", 620)
            .attr("y", 380);
        
        focus.append("text")
            .attr("class", "tooltip-rebounds-caption")
            .attr("x", 505)
            .attr("y", 400)
            .text("Rebounds over 7 game series ");
            ;

            svgrebounds.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

            var bisectDate = d3.bisector(function(d) { return d.key; }).left; 

            console.log(points_nested_data.find(x => x.key === '1980'));  


            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]); 
                var i = bisectDate(points_nested_data, x0, 1); 
                var year = x0.getFullYear();
                console.log(typeof(year))
                let d0 = rebounds_nested_data.find(x => x.key === year.toString()); 

                //focus.attr("transform", "translate(" + x(d0["key"]) + "," + y(d0["values"][0].value) + ")");
                focus.select("circle.y")                       
                .attr("transform",                             
                  "translate(" + x(d0["key"]) + "," +        
                                 y(d0["values"][0].value) + ")");
                focus.select(".tooltip-rebounds").text(Math.round(d0["values"][0].value));
                focus.select(".tooltip-team").text(d0["values"][0].key);
                focus.select(".tooltip-year").text(d0["key"]);

            }

}
async function init() { 
    const data = await d3.csv(
        'https://raw.githubusercontent.com/sairanga123/NBAFinalsVisualizations/main/championsdata.csv'
    ); 

    var nested_data = d3.nest()
    .key(function(d) { return d.Team; })
    .key(function(d) { return d.Year; })
    .rollup(function(year) {
        return year.length; 
    })
    .entries(data);
    nested_data = nested_data.slice(0,11); 
    
    console.log(nested_data); 
    console.log(nested_data[0].values.length); 
    var color = ['#552583','#007A33','#006BB6','#C8102E','#CE1141','#C4CED4', '#000000','#98002E','#00538C','#FFC72C','#860038'];

    var svg = d3.select("svg"), 
    margin = 100, 
    width = svg.attr("width") - margin,
    height = svg.attr("height") - 200;

    const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

    const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 10]);

    chart.append('g')
    .call(d3.axisLeft(yScale));

    const xScale = d3.scaleBand()
    .range([0, width])
    .domain(nested_data.map((d) => d.key))
    .padding(0.2)

    chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

    chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));
    
    chart.selectAll()
    .data(nested_data)
    .enter()
    .append('rect')
    .attr('x', (s) => xScale(s.key))
    .attr('y', (s) => yScale(s.values.length))
    .attr("fill", function(d,i) {return color[i];})
    .attr('height', (s) => height - yScale(s.values.length))
    .attr('width', xScale.bandwidth())
    
    const lakersannotations = [
        {
          note: {
            label: "The Lakers have won the most titles (10) thanks to players such as Kobe, Shaq and Magic Johnson",
            title: "The Lake Show:"
          },
          x: 150,
          y: 350,
          dy: -100,
          dx: 100
        }
      ]

      const makeAnnotations = d3.annotation()
      .annotations(lakersannotations)
    
    d3.select("svg")
      .append("g")
      .attr("id", "lakersAnnotation")
      .call(makeAnnotations)


      const cavsannotations = [
        {
          note: {
            label: "Superstar Lebron James returns back to his hometown team Cleavland Cavs to win the title over a superteam Warriors",
            title: "The King Keeps His Promise: "
          },
          x: 950,
          y: 460,
          dy: -100,
          dx: -10
        }
      ]

      const makeCavsAnnotations = d3.annotation()
      .annotations(cavsannotations)

      d3.select("svg")
      .append("g")
      .attr("id", "cavsAnnotation")
      .call(makeCavsAnnotations)
    
      const bullsannotations = [
        {
          note: {
            label: "Michael Jordan has led the Chicago bulls to all of their 6 titles throughout this era",
            title: "Jordan Era: "
          },
          x: 480,
          y: 300,
          dy: -100,
          dx: 100
        }
      ]

      const makeBullsAnnotations = d3.annotation()
      .annotations(bullsannotations)

      d3.select("svg")
      .append("g")
      .attr("id", "bullsAnnotation")
      .call(makeBullsAnnotations)
}   

