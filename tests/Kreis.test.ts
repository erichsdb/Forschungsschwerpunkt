import { Graph } from "../src/Graph";
import { create_articulation_point_graph } from "../src/graphs/articulation_point";
import { create_31_nodes_graph } from "../src/graphs/31_nodes";

test("Kreis besitzt einen Kreis", () => {
  var g = new Graph();
  var vertices = ["A", "B", "C", "D"];

  // Knoten hinzufügen
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // Kanten hinzufügen
  g.addEdge("A", "B");
  g.addEdge("B", "C");
  g.addEdge("C", "D");
  g.addEdge("D", "A");

  // Start- und Endwerte definieren
  var start = "A";
  var end = "C";

  // Kreis bauen
  g.build_circle(start, end);

  // Komponenten vergleichen
  expect(g.circle).toEqual(["A", "B", "C", "D", "A"]);
});

test("K_4 besitzt einen Kreis", () => {
  var g = new Graph();
  var vertices = ["A", "B", "C", "D"];

  // Knoten hinzufügen
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // Kanten hinzufügen
  g.addEdge("A", "B");
  g.addEdge("A", "C");
  g.addEdge("A", "D");
  g.addEdge("B", "C");
  g.addEdge("B", "D");
  g.addEdge("C", "D");

  // Start- und Endwerte definieren
  var start = "A";
  var end = "C";

  // Kreis bauen
  g.build_circle(start, end);

  // Komponenten vergleichen
  expect(g.circle).toEqual(["A", "C", "B", "A"]);
});

test("Komplexes Beispiel besitzt einen Kreis", () => {
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

  // Kreis bauen
  g.build_circle(start, end);

  expect(g.circle).toEqual([
    "U",
    "J",
    "I",
    "E",
    "V",
    "F",
    "D",
    "C",
    "B",
    "A",
    "U",
  ]);
});

test("Graph mit zwei möglichen Rückwärtskanten besitzt einen Kreis", () => {
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
    "U",
    "V",
  ];

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

  expect(g.circle).toEqual([
    "U",
    "O",
    "N",
    "M",
    "L",
    "K",
    "D",
    "V",
    "F",
    "G",
    "E",
    "C",
    "B",
    "A",
    "U",
  ]);
});

test("Komplexes Beispiel besitzt einen Kreis", () => {
  var g = create_31_nodes_graph();

  // Start- und Endwerte definieren
  var start = "U";
  var end = "V";

  // Kreis bauen
  g.build_circle(start, end);

  // Komponenten vergleichen
  expect(g.circle).toEqual([
    "U",
    "A",
    "E",
    "H",
    "J",
    "M",
    "N",
    "L",
    "O",
    "R",
    "W",
    "X",
    "Y",
    "D1",
    "V",
    "C1",
    "B1",
    "A1",
    "Z",
    "S",
    "Q",
    "P",
    "K",
    "I",
    "G",
    "F",
    "C",
    "U",
  ]);
});
