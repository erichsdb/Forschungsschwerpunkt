import {Graph} from "./Graph";

var g = new Graph();
var vertices = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'U', 'V'];

// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}
 
// adding edges
g.addEdge('U', 'A');
g.addEdge('U', 'J');
g.addEdge('A', 'B');
// g.addEdge('A', 'J');
g.addEdge('B', 'C');
g.addEdge('I', 'J');
g.addEdge('C', 'D');
g.addEdge('E', 'I');
g.addEdge('E', 'A');
//g.addEdge('D', 'I');
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
//// console.log("Entdeckzeit");
//console.log(g.d);
//// 
//console.log("Low-Werte");
//console.log(g.l);
//// 
//console.log("Tiefensuchwald");
//console.log(g.pi);

// Start- und Endwerte definieren
var start = 'U';
var end = 'V'

// Kürzesten Weg von Start zu Ziel finden mit Breitensuche
g.bfs(start);
g.modify_adjacency_list(g.find_path(start, end));

// Tiefensuche mit Low-Werten
g.dfs(start);

// Zwei-fache Komponenten finden
g.zweifache_Komponenten(start);

console.log(g.components);

g.circle_finder(start, end);
g.create_circle(start, end);