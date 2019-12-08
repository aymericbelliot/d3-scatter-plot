// Data source
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

/************************************
 * JSON request to load data from url
 ************************************/
document.addEventListener('DOMContentLoaded', () => {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      populateScatterPlot("#scatterPlot", data);
    })
});

/************************************
 * Creat bar chart from dataset
 ************************************/
populateScatterPlot = (id, dataset) => {
  // Define w/h/p ratio
  const w = 1000;
  const h = 500;
  const padding = 50;

  const setDataYear = (year) => new Date(JSON.stringify(year));
  const setDataTime = (time) => {
    m = new Date(0).setMinutes(JSON.stringify(time).slice(1, 3));
    s = new Date(0).setSeconds(JSON.stringify(time).slice(4, 6));
    return (m + s);
  }

  const yearFormat = d3.timeFormat("%Y");
  const timeFormat = d3.timeFormat("%M : %S");

  // Define scaling functions
  const xScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => setDataYear(d.Year)),
    d3.max(dataset, d => setDataYear(d.Year))])
    .range([padding, w - padding]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => setDataTime(d.Time)),
    d3.max(dataset, d => setDataTime(d.Time))])
    .range([padding, h - padding]);

  // Create SVG layout
  const svg = d3.select(id)
    .append("svg")
    .attr("viewBox", "0 0 " + w + " " + h)

  // Create Axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(yearFormat);
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(timeFormat);

  svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");

  svg.append("g")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis)
    .attr("id", "y-axis");

  // Add y axis label
  svg.append("text")
    .attr("x", - h / 2 - padding)
    .attr("y", padding + 20)
    .attr("transform", "rotate(270)")
    .text("Time in minutes");

  // Create plots 
  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(setDataYear(d.Year)))
    .attr("cy", d => yScale(setDataTime(d.Time)))
    .attr("r", 5)
    .attr("class", "dot")
    .attr("data_xvalue", d => d.Year)
    .attr("data_yvalue", d => d.Time)
    .style("fill", d => d.Doping == "" ? "red" : "blue")
    .append("title")
    .attr("id", "tooltip")
    .attr("data-year", d => d.Year)
    .text((d) => d.Name + " : " + d.Nationality + "\nYear : " + d.Year + ", Time : " + d.Time + "\n\n" + d.Doping);

  // Add legend 
  svg.append("rect")
    .attr("x", w - padding)
    .attr("y", h / 2)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "blue");

  svg.append("rect")
    .attr("x", w - padding)
    .attr("y", h / 2 + 30)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "red");

  svg.append("text")
    .attr("x", w - padding - 137)
    .attr("y", h / 2 + 16)
    .text("Doping allegation")
    .attr("id", "legend");

  svg.append("text")
    .attr("x", w - padding - 160)
    .attr("y", h / 2 + 46)
    .text("No doping allegation");
}
