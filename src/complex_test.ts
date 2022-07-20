import {Graph} from "./Graph";

var g = new Graph();
var vertices = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'U', 'V'];

// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}
 
// adding edges
g.addEdge('U', 'A');
g.addEdge('U', 'B');
g.addEdge('A', 'B');
g.addEdge('A', 'J');
g.addEdge('B', 'C');
g.addEdge('C', 'I');
g.addEdge('I', 'J');
g.addEdge('C', 'D');
g.addEdge('E', 'I');
g.addEdge('D', 'E');
g.addEdge('D', 'F');
g.addEdge('E', 'G');
g.addEdge('E', 'V');
g.addEdge('V', 'F');
g.addEdge('V', 'H');
g.addEdge('F', 'H');
g.addEdge('F', 'G');


// console.log("Farbe");
// console.log(g.col);
// 
// console.log("Beendezeit");
// console.log(g.f)
// 
// console.log("Entdeckzeit");
// console.log(g.d);
// 
// console.log("Low-Werte");
// console.log(g.l);
// 
// console.log("Tiefensuchwald");
// console.log(g.pi);

// Start- und Endwerte definieren
var start = 'U';
var end = 'V'

// Kürzesten Weg von Start zu Ziel finden mit Breitensuche
g.bfs(start);
g.modify_adjacency_list(g.find_path(start, end));

// Tiefensuche mit Low-Werten
g.dfs_start(start);

// Kreis finden mit erneuter Tiefensuche
g.create_circle('U');