import { Graph } from "../src/Graph";

test("Low-Werte für einen beliebigen Graphen", () => {
  var g = new Graph();
  var vertices = ["A", "B", "C", "D", "E", "F"];

  // adding vertices
  for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
  }

  // adding edges
  g.addEdge("A", "B");
  g.addEdge("A", "D");
  g.addEdge("A", "E");
  g.addEdge("B", "C");
  g.addEdge("D", "E");
  g.addEdge("E", "F");
  g.addEdge("E", "C");
  g.addEdge("C", "F");

  g.dfs_ti();

  expect(g.l).toEqual(
    new Map([
      ["A", 0],
      ["B", 1],
      ["C", 2],
      ["F", 3],
      ["D", 7],
      ["E", 8],
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

  g.dfs_ti();
  
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

test("Low-Werte einen Kreis", () => {
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

  g.dfs_ti();
  
  expect(g.l).toEqual(
    new Map([
      ["A", 0],
      ["B", 0],
      ["C", 0],
      ["D", 0]
    ])
  );
});
