import { Graph } from "./Graph";

var g = new Graph();
var vertices = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "A1",
  "B1",
  "C1",
  "D1",
  "E1",
];

// Knoten hinzufügen
for (var i = 0; i < vertices.length; i++) {
  g.addVertex(vertices[i]);
}

// Kanten hinzufügen
g.addEdge("U", "A");
g.addEdge("U", "B");
g.addEdge("U", "C");
g.addEdge("A", "B");
g.addEdge("A", "E");
g.addEdge("B", "E");
g.addEdge("B", "D");
g.addEdge("C", "F");
g.addEdge("D", "F");
g.addEdge("D", "G");
g.addEdge("E", "H");
g.addEdge("F", "G");
g.addEdge("G", "H");
g.addEdge("G", "I");
g.addEdge("G", "J");
g.addEdge("H", "I");
g.addEdge("I", "K");
g.addEdge("I", "M");
g.addEdge("I", "L");
g.addEdge("J", "M");
g.addEdge("K", "P");
g.addEdge("L", "N");
g.addEdge("L", "O");
g.addEdge("M", "N");
g.addEdge("O", "Q");
g.addEdge("O", "R");
g.addEdge("O", "S");
g.addEdge("P", "Q");
g.addEdge("R", "W");
g.addEdge("R", "N");
g.addEdge("S", "T");
g.addEdge("S", "W");
g.addEdge("S", "Z");
g.addEdge("T", "A1");
g.addEdge("W", "X");
g.addEdge("X", "Y");
g.addEdge("Y", "Z");
g.addEdge("Y", "E1");
g.addEdge("Z", "E1");
g.addEdge("Z", "A1");
g.addEdge("A1", "B1");
g.addEdge("B1", "C1");
g.addEdge("C1", "V");
g.addEdge("D1", "V");
g.addEdge("D1", "E1");
g.addEdge("E1", "V");

// console.log("Farbe");
// console.log(g.col);
//
// console.log("Beendezeit");
// console.log(g.f)
//// console.log("Entdeckzeit");
//console.log(g.d);
////

////
//console.log("Tiefensuchwald");
//console.log(g.pi);

// Start- und Endwerte definieren
var start = "U";
var end = "V";

// Kürzesten Weg von Start zu Ziel finden mit Breitensuche
g.bfs(start);

var shortest_path = g.find_path(start, end)
g.modify_adjacency_list(shortest_path);

// Tiefensuche mit Low-Werten
g.dfs(start);

console.log("Low-Werte");
console.log(g.l);

// Zwei-fache Komponenten finden
g.zweifache_Komponenten(start);

console.log(g.components);

g.create_circle(start, end);
console.log(g.circle);

g.checkIfCirlce(g.circle);
console.log(g.isCircle);
