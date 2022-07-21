import { Graph } from "../src/Graph";

test("Kreis besitzt einen Kreis", () => {
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
  var end = "C";

  // Kürzesten Weg von Start zu Ziel finden mit Breitensuche
  g.bfs(start);
  g.modify_adjacency_list(g.find_path(start, end));

  // Tiefensuche mit Low-Werten
  g.dfs(start);

  g.circle_finder(start, end);
  g.create_circle(start, end);

  // Komponenten vergleichen
  expect(g.circle).toEqual(["A", "D", "C", "B", "A"]);
});

test("K_4 besitzt einen Kreis", () => {
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
  g.dfs(start);

  g.circle_finder(start, end);
  g.create_circle(start, end);

  // Komponenten vergleichen
  expect(g.circle).toEqual(["A", "B", "C", "A"]);
});
