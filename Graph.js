"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
// Klasse für gerichtete Graphen
class Graph {
    constructor(vertices) {
        this.vertices = vertices;
        this.AdjList = new Map();
    }
    addVertex(v) {
        // initalize empty adjacency list
        this.AdjList.set(v, []);
    }
    addEdge(src, dest) {
        var _a;
        // edge from src to dest
        if (this.AdjList.get(src) !== undefined) {
            (_a = this.AdjList.get(src)) === null || _a === void 0 ? void 0 : _a.push(dest);
        }
    }
    printGraph() {
        // list of all vertices
        var vertices = this.AdjList.keys();
        for (var i of vertices) {
            var vertice_list = this.AdjList.get(i);
            var output = "";
            if (vertice_list) {
                for (var j of vertice_list) {
                    output += j + " ";
                }
                console.log(i + " -> " + output);
            }
            else {
                console.log("Vertice " + i + "had not been initialized yet.");
            }
        }
    }
    // Main DFS method
    dfs(start) {
        var visited = {};
        this.DFSUtil(start, visited);
    }
    // Recursive function which process and explore
    // all the adjacent vertex of the vertex with which it is called
    DFSUtil(vert, visited) {
        visited[vert] = true;
        console.log(vert);
        var get_neighbours = this.AdjList.get(vert);
        if (get_neighbours == undefined)
            return;
        for (var i in get_neighbours) {
            var get_elem = get_neighbours[i];
            if (!visited[get_elem])
                this.DFSUtil(get_elem, visited);
        }
    }
}
exports.Graph = Graph;
