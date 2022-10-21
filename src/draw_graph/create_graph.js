import { create_31_nodes_graph } from "../graphs/31_nodes";

var g = create_31_nodes_graph()

// Start- und Endwerte definieren
var start = "U";
var end = "V";

// Kreis bauen
g.build_circle(start, end);
console.log(g.circle);

//intialize data
var graph = g.circle_animation[0];
console.log(g.circle_animation)

//initilize svg or grab svg
var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

// Set start, end
var start_field = d3.select("#start");
start_field.text("Start: " + start);
var target_field = d3.select("#end");
target_field.text("End: " + end);

// Slider
var xRangeSlider = document.getElementById("mySlider");
xRangeSlider.min = 0;
xRangeSlider.max = g.circle_animation.length - 1;
xRangeSlider.value = 0;

var simulation = d3
  .forceSimulation(graph.nodes)
  .force(
    "link",
    d3
      .forceLink()
      .id((d) => d.name)
      .links(graph.links)
  )
  .force("charge", d3.forceManyBody().strength(-60))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .on("tick", ticked);

var links = svg
  .append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter()
  .append("line")
  .attr("stroke-width", function (d) {
    return 3;
  })
  .attr('class', function(d) {
    if(d.dashed) return 'dashed';
  })
  .style("stroke", (d) => d.color)

var drag = d3
  .drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended);

var textsAndNodes = svg
  .append("g")
  .selectAll("g")
  .data(graph.nodes)
  .enter()
  .append("g")
  .call(drag);

var cirlces = textsAndNodes
  .data(graph.nodes)
  .append("circle")
  .attr("r", 5)
  .style("fill", (d) => d.color);
var texts = textsAndNodes
  .append("text")
  .attr("x", 6)
  .attr("y", 3)
  .text((d) => d.name);

var slider = d3.select("#mySlider").on("change", (d) => {
  update(xRangeSlider.value);
});

var slider_button = d3.select("#slider-button");
var timer = null;

slider_button.on("click", (d) => {
  var button = d3.select("#slider-button");

  if (parseInt(xRangeSlider.value) == parseInt(xRangeSlider.max))
    xRangeSlider.value = xRangeSlider.min;

  if (button.text() == "Play") {
    timer = setInterval(step, 300);
    button.text("Pause");
  } else if (button.text() == "Pause") {
    clearInterval(timer);
    button.text("Play");
  }
});

function step() {
  update(++xRangeSlider.value);

  if (parseInt(xRangeSlider.value) >= parseInt(xRangeSlider.max)) {
    xRangeSlider.value = 0;
    clearInterval(timer);
    slider_button.text("Play");
  }
}

function update(selectedValue) {
  graph = g.circle_animation[selectedValue];
  // recolors circles
  svg
    .selectAll("circle")
    .data(graph.nodes)
    .style("fill", (d) => d.color);

  // keep force on links
  simulation = simulation
    .force(
      "link",
      d3
        .forceLink()
        .id((d) => d.name)
        .links(graph.links)
    )
    .force("charge", d3.forceManyBody().strength(-60))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  // recolor edges
  svg
    .selectAll("line")
    .data(graph.links)
    .style("stroke", (d) => d.color)
    .style("stroke-dasharray", function(d) {
      if(d.dashed) return '5.5'
      else return 0;
    })
}

function ticked() {
  // translate (x, y)
  textsAndNodes.attr("transform", (d) => "translate(" + d.x + ", " + d.y + ")");

  links
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
