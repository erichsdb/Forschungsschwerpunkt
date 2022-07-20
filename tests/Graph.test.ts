import { Graph } from "../src/Graph";

test("Low-Werte für Pfad", () => {
  var g = new Graph();
  var vertices = ["A", "B", "C", "D", "E", "F"];

  // adding vertices
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // adding edges
  g.addEdge("A", "B");
  g.addEdge("B", "C");
  g.addEdge("C", "D");
  g.addEdge("D", "E");
  g.addEdge("E", "F");

  g.dfs_start("A");

  expect(g.l).toEqual(
    new Map([
      ["A", 0],
      ["B", 1],
      ["C", 2],
      ["D", 3],
      ["E", 4],
      ["F", 5],
    ])
  );
});

test("Low-Werte für Graph mit zwei Rückwertskanten", () => {
  var g = new Graph();
  var vertices = ["A", "B", "C", "D", "E", "F"];

  // adding vertices
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // adding edges
  g.addEdge("A", "B");
  g.addEdge("B", "C");
  g.addEdge("C", "D");
  g.addEdge("D", "A");
  g.addEdge("D", "E");
  g.addEdge("E", "F");
  g.addEdge("F", "D");

  g.dfs_start("A");

  expect(g.l).toEqual(
    new Map([
      ["A", 0],
      ["B", 0],
      ["C", 0],
      ["D", 0],
      ["E", 3],
      ["F", 3],
    ])
  );
});

test("Low-Werte für einen Kreis", () => {
  var g = new Graph();
  var vertices = ["A", "B", "C", "D"];

  // adding vertices
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // adding edges
  g.addEdge("A", "B");
  g.addEdge("B", "C");
  g.addEdge("C", "D");
  g.addEdge("D", "A");

  g.dfs_start("A");

  expect(g.l).toEqual(
    new Map([
      ["A", 0],
      ["B", 0],
      ["C", 0],
      ["D", 0],
    ])
  );
});

test("Kreis finden im einfachen Kreis", () => {
  var g = new Graph();
  var vertices = ["A", "B", "C", "D"];

  // adding vertices
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // adding edges
  g.addEdge("A", "B");
  g.addEdge("B", "C");
  g.addEdge("C", "D");
  g.addEdge("D", "A");

  // Start- und Endwerte definieren
  var start = "A";
  var end = "B";

  // Kürzesten Weg von Start zu Ziel finden mit Breitensuche
  g.bfs(start);
  g.modify_adjacency_list(g.find_path(start, end));

  // Tiefensuche mit Low-Werten
  g.dfs_start(start);

  // Kreis finden mit erneuter Tiefensuche
  expect(g.create_circle(start)).toEqual(["A", "B", "C", "D"]);
});

test("Kreis im K_4", () => {
  var g = new Graph();
  var vertices = ["A", "B", "C", "D"];

  // adding vertices
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // adding edges
  g.addEdge("A", "B");
  g.addEdge("A", "C");
  g.addEdge("A", "D");
  g.addEdge("B", "C");
  g.addEdge("B", "D");
  g.addEdge("C", "D");

  // Start- und Endwerte definieren
  var start = "A";
  var end = "C";

  // Kürzesten Weg von Start zu Ziel finden mit Breitensuche
  g.bfs(start);
  g.modify_adjacency_list(g.find_path(start, end));

  // Tiefensuche mit Low-Werten
  g.dfs_start(start);

  // Kreis finden mit erneuter Tiefensuche
  expect(g.create_circle(start)).toEqual(["A", "C", "B", "D"]);
});
