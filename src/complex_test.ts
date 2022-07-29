import { Graph } from "./Graph";
import {create_31_nodes_graph} from "./graphs/31_nodes";

var g = create_31_nodes_graph();

// console.log("Farbe");
// console.log(g.col);
//
// console.log("Beendezeit");
// console.log(g.f)
//// console.log("Entdeckzeit");
//console.log(g.d);
////

////
//console.log("Tiefensuchwald");
//console.log(g.pi);

// Start- und Endwerte definieren
var start = "U";
var end = "V";

// Kürzesten Weg von Start zu Ziel finden mit Breitensuche
g.bfs(start);

var shortest_path = g.find_path(start, end)
g.modify_adjacency_list(shortest_path);

// Tiefensuche mit Low-Werten
g.dfs(start);

console.log("Low-Werte");
console.log(g.l);

// Zwei-fache Komponenten finden
g.zweifache_Komponenten(start);

console.log(g.components);

g.create_circle(start, end);
console.log(g.circle);

g.checkIfCirlce(start, end);
console.log(g.isCircle);
