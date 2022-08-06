import { Graph } from "../Graph";

export function create_articulation_point_graph() {
  var g = new Graph();
  var vertices = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "U", "V"];

  // Knoten hinzufügen
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // Kanten hinzufügen
g.addEdge("U", "A");  
g.addEdge("A", "B");
g.addEdge("B", "C");
g.addEdge("C", "D");
g.addEdge("D", "E");
g.addEdge("E", "F");
g.addEdge("F", "V");
g.addEdge("V", "G");
g.addEdge("G", "H");
g.addEdge("H", "I");
g.addEdge("I", "F");
g.addEdge("F", "J");
g.addEdge("J", "E");








  return g
}
