import {Graph} from "./Graph";

var g = new Graph();
var vertices = [ 'A', 'B', 'C', 'D', 'E', 'F' ];

// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}
 
// adding edges
g.addEdge('A', 'B');
g.addEdge('A', 'D');
g.addEdge('A', 'E');
g.addEdge('B', 'C');
g.addEdge('D', 'E');
g.addEdge('E', 'F');
g.addEdge('E', 'C');
g.addEdge('C', 'F');

g.printGraph();

g.bfs('D');
g.modify_adjacency_list(g.find_path('D', 'C'));

g.printGraph();

g.dfs_start('D');

console.log("Entdeckzeit");
console.log(g.d);

console.log("Tiefensuchwald");
console.log(g.pi);

console.log("Farbe");
console.log(g.col);

console.log("Beendezeit");
console.log(g.f)

console.log("Low-Werte");
console.log(g.l);

