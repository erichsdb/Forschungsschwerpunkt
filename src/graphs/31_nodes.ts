import { Graph } from "../Graph";

export function create_31_nodes_graph() {
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
    //"T",
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
  // g.addEdge("B", "E");
  // g.addEdge("B", "D");
  // g.addEdge("U", "B");
  // g.addEdge("S", "T");
  // g.addEdge("S", "W");
  // g.addEdge("Y", "Z");
  // g.addEdge("R", "L");
  // g.addEdge("T", "A1");
  // g.addEdge("E1", "V");
  g.addEdge("R", "W");
  g.addEdge("B", "W");
  g.addEdge("B", "R");
  g.addEdge("U", "A");
  g.addEdge("U", "C");
  g.addEdge("A", "D");
  g.addEdge("A", "E");
  g.addEdge("C", "F");
  g.addEdge("D", "F");
  g.addEdge("D", "G");
  g.addEdge("E", "H");
  g.addEdge("F", "G");
  g.addEdge("G", "H");
  g.addEdge("G", "I");
  g.addEdge("H", "J");
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
  g.addEdge('Q', 'S')
  g.addEdge("S", "Z");
  g.addEdge("W", "X");
  g.addEdge("X", "Y");
  g.addEdge("Y", "D1");
  g.addEdge("S", "E1");
  g.addEdge("Z", "A1");
  g.addEdge("A1", "B1");
  g.addEdge("B1", "C1");
  g.addEdge("C1", "V");
  g.addEdge("D1", "V");
  g.addEdge("D1", "E1");
  

  return g;
}
