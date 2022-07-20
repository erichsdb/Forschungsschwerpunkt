import { State } from "./State";

// Klasse für ungerichtete Graphen
export class Graph {
  AdjList: Map<string, Array<string>>;
  col: Map<string, string>;
  pi: Map<string, string | null>;
  d: Map<string, number>;
  f: Map<string, number>;
  time: number;
  l: Map<string, number>;
  keller: Array<string>;

  constructor() {
    this.AdjList = new Map();

    this.col = new Map();
    this.pi = new Map();
    this.d = new Map();
    this.f = new Map();
    this.l = new Map();
    this.time = 0;
    this.keller = [];
  }

  addVertex(v: string) {
    // initalize empty adjacency list
    this.AdjList.set(v, []);
  }

  addEdge(src: string, dest: string) {
    // edge from src to dest and dest to src
    if (this.AdjList.get(src) !== undefined) {
      this.AdjList.get(src)?.push(dest);
      this.AdjList.get(dest)?.push(src);
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

  create_circle(start: string) {
    var output: Array<string> = [];
    this.dfs(start);

    var back_edges = Array.from(this.pi.keys()).filter(
      (itm) => Array.from(this.pi.values()).indexOf(itm) === -1
    );

    for (const v of this.keller) {
      output.push(v);
      if (back_edges.includes(v)) {
        return output;
      }
    }
    // Fehler
    return output;
  }

  /**
   * Diese Methode initialisiert und ruft die rekursive Tiefensuche auf.
   */
  dfs(start: string) {
    // 1. Initialisierung
    for (var u of this.AdjList.keys()) {
      this.col.set(u, State.white);
      this.pi.set(u, null);
    }
    this.time = 0;

    // Beginne beim Startknoten
    this.keller.push(start);
    this.dfs_visit(start);

    // 2. Hauptschleife
    for (var u of this.AdjList.keys()) {
      if (this.col.get(u) == State.white) {
        // Weiße Knoten werden vor dem Aufruf auf einem Keller gespeichert
        this.keller.push(u);
        this.dfs_visit(u);
      }
    }
  }

  /**
   * Diese Methode initialisiert und ruft die rekursive Tiefensuche auf.
   */
  dfs_start(start: string) {
    // 1. Initialisierung
    for (var u of this.AdjList.keys()) {
      this.col.set(u, State.white);
      this.pi.set(u, null);
    }
    this.time = 0;

    // Beginne beim Startknoten
    this.mdfs_visit(start);

    // 2. Hauptschleife (bei zusammenhängenden Graphen passier hier nichts)
    for (var u of this.AdjList.keys()) {
      if (this.col.get(u) == State.white) this.mdfs_visit(u);
    }
  }

  /**
   * Diese Methode initialisiert und führt die Breitensuche durch.
   * @param s Startknoten
   */
  bfs(s: string) {
    // 1. Initialisierung
    for (var u of this.AdjList.keys()) {
      this.col.set(u, State.white);
      this.pi.set(u, null);
    }

    // 2. Breitensuche mit Warteschlange
    this.col.set(s, State.grey);
    var Q = [];
    Q.push(s);
    while (Q.length != 0) {
      var u = Q[0];
      for (const v of this.AdjList.get(u)!) {
        if (this.col.get(v) == State.white) {
          this.col.set(v, State.grey);
          this.pi.set(v, u);
          Q.push(v);
        }
      }
      Q.shift();
      this.col.set(u, State.black);
    }
  }

  /**
   * Nach der Breitensuche findet diese Funktion den kürzesten Weg von Start zu Ende
   * über die Elternknoten.
   * @param start Startknoten
   * @param end Endknoten
   * @returns Array<string> mit Pfad von Start zu Ende
   */
  find_path(start: string, end: string) {
    var result = [end];
    var next = this.pi.get(end);
    while (next != null) {
      result.push(next);
      next = this.pi.get(next);
    }

    result = result.reverse();
    return result;
  }

  /**
   * Diese Funktion verändert die Adjazenzliste so, dass bei DFS immer der kürzeste Weg vom
   * Startknoten zum Zielknoten gewählt wird.
   * @param path Array<string>: Kürzester Weg vom Startknoten zu Endknoten
   */
  modify_adjacency_list(path: Array<string>) {
    for (let i = 0; i < path.length - 1; i++) {
      var neighbours = this.AdjList.get(path[i]);
      if (neighbours && neighbours[0] != path[i + 1]) {
        // Finde index des nächsten Knotens
        const index = neighbours.findIndex((x) => x === path[i + 1]);
        // Tausche mit erster Stelle
        const b = neighbours[0];
        neighbours[0] = neighbours[index];
        neighbours[index] = b;
        // Aktualisiere Adajenzliste
        this.AdjList.set(path[i], neighbours);
      }
    }
  }

  /**
   * Diese Methode implementiert die Tiefensuche von S.48 des Skripts.
   * @param u Knoten, der besucht wird
   * @returns
   */
  dfs_visit(u: string) {
    // entdecke u
    this.col.set(u, State.grey);
    this.d.set(u, this.time);
    this.time += 1;

    // Bearbeitung von u
    var neighbours = this.AdjList.get(u);
    if (neighbours == undefined) return;

    for (var v of neighbours) {
      if (this.col.get(v) == State.white) {
        // Weiße Knoten werden vor dem Aufruf auf einem Keller gespeichert
        this.keller.push(v);

        this.pi.set(v, u);
        this.dfs_visit(v);
      }
    }

    this.col.set(u, State.black);
    this.f.set(u, this.time);
    this.time += 1;
  }

  /**
   * Diese Methode implementiert den Algorithmus von S.78 des Skripts.
   * Der Graph wird mittels DFS rekursiv traversiert. Der Low-Wert wird u.a. berechnet.
   * @param u Knoten, der besucht wird
   * @returns
   */
  mdfs_visit(u: string) {
    // entdecke u
    this.col.set(u, State.grey);
    this.d.set(u, this.time);
    this.l.set(u, this.d.get(u)!);
    this.time += 1;

    // Bearbeitung von u
    var neighbours = this.AdjList.get(u);
    if (neighbours == undefined) return;

    for (var v of neighbours) {
      if (this.col.get(v) == State.white) {
        this.pi.set(v, u);
        this.mdfs_visit(v);

        // Kleinern Low-Wert des Kindes übernehmen
        this.l.set(u, Math.min(this.l.get(u)!, this.l.get(v)!));
      }
      // Rückwärtskante
      if (this.col.get(v) == State.grey && this.pi.get(u) != v)
        // Merken, welche am, weitesten zurück reicht
        this.l.set(u, Math.min(this.l.get(u)!, this.d.get(v)!));
    }

    this.col.set(u, State.black);
    this.f.set(u, this.time);
    this.time += 1;
  }
}
