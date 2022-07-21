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

  g.dfs("A");

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

test("Low-Werte für Graph mit zwei Rückwärtskanten", () => {
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

  g.dfs("A");

  expect(g.l).toEqual(
    new Map([
      ["A", 0],
      ["B", 0],
      ["C", 0],
      ["D", 0],
    ])
  );
});
