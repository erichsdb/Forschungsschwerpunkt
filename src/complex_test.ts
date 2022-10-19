import { Graph } from "./Graph";
import {create_31_nodes_graph} from "./graphs/31_nodes";
// import {create_12_nodes_graph} from "./graphs/12_nodes";
import {create_articulation_point_graph} from "./graphs/articulation_point";

var g = create_31_nodes_graph();
// Start- und Endwerte definieren
var start = "U";
var end = "V";

// Kreis bauen
g.build_circle(start, end);

console.log(g.l);
console.log(g.pi);

console.log(g.d);


