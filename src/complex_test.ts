import { Graph } from "./Graph";
import {create_31_nodes_graph} from "./graphs/31_nodes";
// import {create_12_nodes_graph} from "./graphs/12_nodes";
import {create_articulation_point_graph} from "./graphs/articulation_point";

var g = new Graph();
  var vertices = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J","K","L","M","N","O", "U", "V"];

  // Knoten hinzufügen
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // Pfad
  g.addEdge("U", "A");
  g.addEdge("A", "B");
  g.addEdge("B", "C");
  g.addEdge("C", "D");
  g.addEdge("D", "V");
  // 1. Rückwärtskante
  g.addEdge("V", "I");
  g.addEdge("I", "J");
  g.addEdge("J", "D");
  // 2. Rückwärtskante
  g.addEdge("V", "F");
  g.addEdge("F", "G");
  g.addEdge("G", "E");
  g.addEdge("E", "C");
  // Rückwärtskante zu U
  g.addEdge("D", "K");
  g.addEdge("K", "L");
  g.addEdge("L", "M");
  g.addEdge("M", "N");
  g.addEdge("N", "O");
  g.addEdge("O", "U");

  // Start- und Endwerte definieren
  var start = "U";
  var end = "V";

  // Kreis bauen
  g.build_circle(start, end);
console.log(g.circle);

console.log(g.col);


