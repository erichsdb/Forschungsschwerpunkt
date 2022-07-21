import { Graph } from "../src/Graph";

test("Kreis ist eine Zusammenhangskomponente", () => {
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

  // Finde zweifache Zusammenhangskomponenten
  g.zweifache_Komponenten(start);

  // Komponenten vergleichen
  expect(g.components).toEqual([["D", "C", "B", "A"]]);
});

test("K_4 ist eine zweifache Zusammenhangskomponente", () => {
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

  // Finde zweifache Zusammenhangskomponenten
  g.zweifache_Komponenten(start);

  // Komponenten vergleichen
  expect(g.components).toEqual([["D", "B", "C", "A"]]);
});

test("zwei Komponenten bei zwei miteinander verbundenen Kreisen", () => {
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

  g.dfs("A");

  // Start- und Endwerte definieren
  var start = "A";
  var end = "F";

  // Kürzesten Weg von Start zu Ziel finden mit Breitensuche
  g.bfs(start);
  g.modify_adjacency_list(g.find_path(start, end));

  // Tiefensuche mit Low-Werten
  g.dfs(start);

  // Finde zweifache Zusammenhangskomponenten
  g.zweifache_Komponenten(start);

  // Komponenten vergleichen
  expect(g.components).toEqual([
    ["E", "F", "D"],
    ["B", "C", "D", "A"],
  ]);
});

test("Komponenten im Pfad", () => {
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

  g.dfs("A");

  // Start- und Endwerte definieren
  var start = "A";
  var end = "F";

  // Kürzesten Weg von Start zu Ziel finden mit Breitensuche
  g.bfs(start);
  g.modify_adjacency_list(g.find_path(start, end));

  // Tiefensuche mit Low-Werten
  g.dfs(start);

  // Finde zweifache Zusammenhangskomponenten
  g.zweifache_Komponenten(start);

  // Komponenten vergleichen
  expect(g.components).toEqual([
    ["F", "E"],
    ["E", "D"],
    ["D", "C"],
    ["C", "B"],
    ["B", "A"],
  ]);
});
