import { Graph } from "../Graph.ts";

export function create_12_nodes_graph() {
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

  return g
}
