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
  components: Array<Array<string>>;
  circle_stack: Array<Array<string>>;
  circle: Array<string>;

  constructor() {
    this.AdjList = new Map();

    this.col = new Map();
    this.pi = new Map();
    this.d = new Map();
    this.f = new Map();
    this.l = new Map();
    this.time = 0;
    this.keller = [];
    this.components = [];
    this.circle_stack = [];
    this.circle = [];
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
   *
   * Diese Methode initialisiert und ruft die rekursive Tiefensuche auf.
   * Als Ergebnis fallen Low-Werte, Entdeck-, Abschlusszeit und Elternliste an.
   * @param start Startknoten, vom dem gesucht wird
   */
  dfs(start: string) {
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

  zweifache_Komponenten(start: string) {
    // Tiefensuche für L-Werte bereits gelaufen

    // 1. Initialisierung
    for (const v of this.AdjList.keys()) {
      this.col.set(v, State.white);
    }

    // Keller ist bereits als leere Liste initialisiert
    // this.keller = [];

    // Beginne beim Startknoten (dieselbe Reihenfolge wie bei 1.)
    this.ndfs_visit(start);

    for (const v of this.AdjList.keys()) {
      if (this.col.get(v) == State.white) {
        this.ndfs_visit(v);
        // Kann bei isolierten Knoten passieren
        if (this.keller.length != 0) {
          // Knote in Q(?) ausgeben
          this.keller = [];
        }
      }
    }
  }

  ndfs_visit(u: string) {
    this.col.set(u, State.grey);
    for (const v of this.AdjList.get(u)!) {
      if (this.col.get(v) == State.white) {
        this.keller.push(v);
        this.ndfs_visit(v);

        if (this.l.get(v)! >= this.d.get(u)!) {
          // Solange Knoten von S entfernen und Ausgeben, bis v ausgegeben. Knoten u auch mit ausgeben;
          console.log("Komponente gefunden");
          var component = [this.keller.pop()!];
          while (component[component.length - 1] !== v) {
            component.push(this.keller.pop()!);
          }
          component.push(u);
          this.components.push(component);
        }
      }
    }
    this.col.set(u, State.black);
  }

  /**
   * ...
   */
  circle_finder(start: string, end: string) {
    // 1. Initialisierung
    for (var u of this.AdjList.keys()) {
      this.col.set(u, State.white);
    }

    this.circle_stack = [];

    // Startpunkt
    this.find_next_edge(start, start, end);

    // Ausgabe
  }

  /**
   * ...
   * @param u Knoten, der besucht wird
   * @returns
   */
  find_next_edge(u: string, start: string, end: string) {
    if (u == start && this.col.get(u) == State.grey) {
      return;
    }
    // entdecke u
    this.col.set(u, State.grey);

    // Bearbeitung von u
    var neighbours = this.AdjList.get(u);
    if (neighbours == undefined) return;

    if (this.col.get(end)! == State.grey) {
      // Knoten mit niedrigstem Low-Wert folgen
      var next = neighbours[0];
      for (const neighbour of neighbours) {
        if (
          this.pi.get(u) == next ||
          (this.l.get(next)! > this.l.get(neighbour)! &&
            this.pi.get(u) != neighbour)
        )
          next = neighbour;
      }

      // Ist nächster Knoten grau? -> (Rückwertkante)
      if (this.col.get(next) == State.grey) {
        // Hauptpfad -> nächste Rückwärtskante suchen
        console.log("Hauptkante " + next);
        this.circle_stack.push(["H", next]);
      } else {
        // Nebenpfad -> Rückwärtskante weiter verfolgen
        console.log("Rückwärtskante " + next);
        this.circle_stack.push(["R", next]);
      }
      this.find_next_edge(next, start, end);
    } else {
      // nächsten Knoten aufrufen (Adjazenzliste ist sortiert)
      console.log("Suche " + end + " über " + u);
      if (neighbours[0] == end) {
        console.log("Hauptkante " + end);
        this.circle_stack.push(["H", end]);
      }
      this.find_next_edge(neighbours[0], start, end);
    }
  }

  create_circle(start: string, end: string) {
    var back_edges: Array<Array<string>> = [];
    var done = false;
    var edge = [];

    while (this.circle_stack.length > 0) {
      const next = this.circle_stack.pop()!;
      edge.push(next[1]);

      if (next[0] == "H") {
        if (!done) {
          done = true;
        } else {
          back_edges.push(edge);
          edge = [];
          done = false;
        }
      }
    }

    var next = start;
    var start_nodes = back_edges.map((back_edges) => back_edges[0]);
    var circle = [];
    circle.push(next);

    // Finde Ende
    while (next != end) {
      const index = start_nodes.indexOf(next);
      if (index >= 0) {
        circle.push(
          ...back_edges[index].slice(1, back_edges[index].length)
        );
        next = back_edges[index][back_edges[index].length - 1];
        back_edges[index] = [];
      } else {
        next = this.AdjList.get(next)![0];
        circle.push(next);
      }
    }


    var end_nodes = back_edges.map(
      (back_edges) => back_edges[back_edges.length - 1]
    );
    // Finde Start
    while (next != start) {
      const index = end_nodes.indexOf(next);
      if (index >= 0) {
        circle.push(
          ...(back_edges[index].reverse().slice(1, back_edges[index].length))
        );
        next = back_edges[index][back_edges[index].length - 1];
      } else {
        next = this.pi.get(next)!;
        circle.push(next);
      }
    }

    this.circle = circle;
  }
}
