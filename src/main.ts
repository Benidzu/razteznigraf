
export{}
//import * as d3 from 'd3';
import * as _d3 from "d3";

declare global {
  const d3: typeof _d3;
}

interface dataobject {
  [key: string]: string|number;
}
 
const outerWidth = 520;
const outerHeight = 520;

const margin = { left: 90, top: 30, right: 30, bottom: 80 };

let innerWidth = outerWidth - margin.left - margin.right;
let innerHeight = outerHeight - margin.top  - margin.bottom;

let xColumn = "Sell";
let yColumn = "Living";

let xAxisText = xColumn;
let xAxisLabelOffset = 50;
let yAxisText = yColumn;
let yAxisLabelOffset = 45;

//most outer element
let svg = d3.select("body").append("svg")
.attr("width",  outerWidth)
.attr("height", outerHeight);

//element within outer svg, centered via margins
let g = svg.append("g")
.attr("transform", "translate("+margin.left+","+margin.top+")");

let xAxisG = g.append("g")
.attr("transform", "translate(0," + innerHeight + ")")
.attr("class", "x axis");
let xAxisLabel = xAxisG.append("text")
.style("text-anchor", "middle")
.attr("x", innerWidth / 2)
.attr("y", xAxisLabelOffset)
.attr("class", "label")
.text(xAxisText);
let yAxisG = g.append("g")
.attr("class", "y axis");
let yAxisLabel = yAxisG.append("text")
.style("text-anchor", "middle")
.attr("transform","translate(-"+yAxisLabelOffset+","+innerHeight/2+") rotate(-90)")
.attr("class", "label")
.text(yAxisText);

//x and y scales (y inverted because top->bottom)
let xScale = d3.scale.linear().range([0, innerWidth]);
let yScale = d3.scale.linear().range([innerHeight, 0]);

let xAxis = d3.svg.axis().scale(xScale).orient("bottom")
  .outerTickSize(0)
  .ticks(5);
let yAxis = d3.svg.axis().scale(yScale).orient("left")
  .ticks(5)
  .tickFormat(d3.format("s"))
  .outerTickSize(0);


function render(data: Array<any>){
// Bind data
    //console.log(data);
    let xDomain = d3.extent(data, function (d){ return d[xColumn]; });
    let yDomain = d3.extent(data, function (d){ return d[yColumn]; });
    xScale.domain([xDomain[0]*0.9,xDomain[1]*1.1]);
    yScale.domain([yDomain[0]*0.9,yDomain[1]*1.1]);

    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
   
    let circles = g.selectAll("circle").data(data);

    // Enter
    circles.enter().append("circle")
    .attr("r", 5);

    // Update
    circles
    .attr("cx", function (d){ return xScale(d[xColumn]); })
    .attr("cy", function (d){ return yScale(d[yColumn]); });

    // Exit
    circles.exit().remove();
}

//parses strings from file to ints
function type(d: dataobject){
    d[yColumn] = +d[yColumn];
    d[xColumn] = +d[xColumn];
    return d;
}

d3.csv("data/homes.csv",type,render);
