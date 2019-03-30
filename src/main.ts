
export{}
import * as d3 from 'd3';
//import * as _d3 from "d3";

//declare global {
//  const d3: typeof _d3;
//}

interface dataobject {
  [key: string]: string|number;
}
 
let outerWidth = 700;
let outerHeight = 520;

let rMin = 1;
let rMax = 20;

let sidebarwidth = 150;
let margin = { left: 90, top: 30, right: 30, bottom: 80 };

let innerWidth = outerWidth - margin.left - margin.right - sidebarwidth;
let innerHeight = outerHeight - margin.top  - margin.bottom;

let xColumn = "Living";
let yColumn = "Sell";
let rColumn = "List";
let colorColumn = "Category";

let xAxisText = xColumn;
let xAxisLabelOffset = 50;
let yAxisText = yColumn;
let yAxisLabelOffset = 45;

//most outer element
/*let svg = d3.select("body").append("svg")
.attr("width",  outerWidth)
.attr("height", outerHeight);*/
let container = d3.select("body").append("div")
.attr("class","container");

let svg = container.append("svg")
.attr("width",  "100%")
.attr("height", "100%")
.attr("max-width", "500")
.attr("max-height", "500")
.attr('viewBox','0 0 '+outerWidth+' '+outerHeight)
.attr('preserveAspectRatio','xMinYMin meet')

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

let colors = ["rgba(53, 219, 227, 0.6)","rgba(146, 53, 227, 0.6)","rgba(134, 230, 51, 0.6)"];
//x and y scales (y inverted because top->bottom)
let xScale = d3.scale.linear().range([0, innerWidth]);
let yScale = d3.scale.linear().range([innerHeight, 0]);
let rScale = d3.scale.sqrt().range([rMin,rMax]);
let colorScale = d3.scale.ordinal().range(colors);

//sidebar - legenda
let sidebarLeftMargin = margin.left + innerWidth;
let sidebar = svg.append("g")
.attr("transform", "translate("+sidebarLeftMargin+","+margin.top+")")
.attr("class","sidebar");

//kategorije - barve
let colorLegend = sidebar.append("g")
colorLegend.append("text")
.text("Category")
.attr("class","categorylabel")

let colorLegendDataYoffset = 20;
let colorLegendData = colorLegend.append("g")
.attr("transform","translate(0,"+colorLegendDataYoffset +")");

function addLabel(item:string, index:number){
  colorLegendData.append("rect")
  .attr("y",index*30)
  .attr("height",20)
  .attr("width",20)
  .attr("fill",item);

  colorLegendData.append("text")
  .attr("y",15+index*30)
  .attr("x",30)
  .attr("class","categorydata")
  .text(colorScale.domain()[index])
}

//velikost kroga primerjava
let sizeLegend = sidebar.append("g")
.attr("")

//
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
    rScale.domain(d3.extent(data, function(d){ return d[rColumn]}));

    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
   
    let circles = g.selectAll("circle").data(data);

    // Enter
    circles.enter().append("circle");

    // Update
    circles
    .attr("cx", function (d){ return xScale(d[xColumn]); })
    .attr("cy", function (d){ return yScale(d[yColumn]); })
    .attr("r", function(d){ return rScale(d[rColumn])})
    .attr("class",function (d) { return d[colorColumn]})
    .attr("fill", function(d) { return colorScale(d[colorColumn]).toString()});

    colors.forEach(addLabel);
    // Exit
    circles.exit().remove();
}

//parses strings from file to ints
function type(d: dataobject){
    d[yColumn] = +d[yColumn];
    d[xColumn] = +d[xColumn];
    d[rColumn] = +d[rColumn];
    return d;
}

d3.csv("data/homes.csv",type,render);
