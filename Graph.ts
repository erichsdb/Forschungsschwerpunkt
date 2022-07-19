// Klasse für gerichtete Graphen
export class Graph {
  vertices: number;
  AdjList: Map<string, Array<string>>;

  constructor(vertices: number) {
    this.vertices = vertices;
    this.AdjList = new Map();
  }

  addVertex(v: string) {
    // initalize empty adjacency list
    this.AdjList.set(v, []);
  }

  addEdge(src: string, dest: string) {
    // edge from src to dest
    if (this.AdjList.get(src) !== undefined) {
      this.AdjList.get(src)?.push(dest);
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
      } else {
        console.log("Vertice " + i + "had not been initialized yet.");
        
      }
    }
  }

  // Main DFS method
dfs(start: string)
{
    var visited = {};
 
    this.DFSUtil(start, visited);
}
 
// Recursive function which process and explore
// all the adjacent vertex of the vertex with which it is called
DFSUtil(vert:string, visited: {[node: string]: boolean;})
{
    visited[vert] = true;
    console.log(vert);
 
    var get_neighbours = this.AdjList.get(vert);
 
    if (get_neighbours == undefined) return

    for (var i in get_neighbours) {
        var get_elem = get_neighbours[i];
        if (!visited[get_elem])
            this.DFSUtil(get_elem, visited);
    }
}
}
