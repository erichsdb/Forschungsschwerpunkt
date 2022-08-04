import { Graph } from "../src/Graph";

test("zwei Knoten besitzt keinen Kreis", () => {
  var g = new Graph();
  var vertices = ["A", "B"];

  // Knoten hinzufügen
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // Kanten hinzufügen
  g.addEdge("A", "B");

  // Start- und Endwerte definieren
  var start = "A";
  var end = "B";

  g.build_circle(start, end);

  // Komponenten vergleichen
  expect(g.circle).toEqual([]);
});

test("Pfad besitzt keinen Kreis", () => {
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

  // Start- und Endwerte definieren
  var start = "A";
  var end = "D";

  // Kreis bauen
  g.build_circle(start, end);

  // Komponenten vergleichen
  expect(g.circle).toEqual([]);
});

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
  expect(g.circle).toEqual(["A", "C", "D", "B", "A"]);
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
