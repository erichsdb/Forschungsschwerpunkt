import { Graph } from "../Graph.ts";

var g = new Graph();

var vertices = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "U", "V"];

// Knoten hinzufügen
for (var i = 0; i < vertices.length; i++) {
  g.addVertex(vertices[i]);
}

// Kanten hinzufügen
g.addEdge("U", "A");
g.addEdge("U", "J");
g.addEdge("A", "B");
g.addEdge("B", "C");
g.addEdge("I", "J");
g.addEdge("C", "D");
g.addEdge("E", "I");
g.addEdge("E", "A");
g.addEdge("D", "F");
g.addEdge("E", "G");
g.addEdge("E", "V");
g.addEdge("V", "F");
g.addEdge("V", "H");
g.addEdge("F", "H");
g.addEdge("F", "G");

// Start- und Endwerte definieren
var start = "U";
var end = "V";

// Kürzesten Weg von Start zu Ziel finden mit Breitensuche
g.bfs(start);
g.modify_adjacency_list(g.find_path(start, end));

// Tiefensuche mit Low-Werten
g.dfs(start);

// Zwei-fache Komponenten finden
g.zweifache_Komponenten(start);

console.log(g.components);

g.create_circle(start, end);
console.log(g.circle);

//intialize data
var graph = g.getGraphD3();

//initilize svg or grab svg
var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

// Slider
var xRangeSlider = document.getElementById("mySlider");
xRangeSlider.min = 0;
xRangeSlider.max = g.circle_animation.length - 1
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
  .force("charge", d3.forceManyBody().strength(-100))
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
  .style("stroke", (d) => d.color);

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

function update(selectedValue) {
  console.log(selectedValue);
  graph = g.circle_animation[selectedValue];

  console.log(graph.nodes);

  // recolors circles
  svg.selectAll("circle").data(graph.nodes).style("fill", (d) => d.color);
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
