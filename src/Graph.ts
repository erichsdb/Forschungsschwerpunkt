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
  circle: Array<string>;
  done: Boolean;
  back_edges: Array<Array<string>>;
  edge: Array<string>;

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
    this.circle = [];
    this.done = false;
    this.back_edges = [];
    this.edge = [];
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
   * Diese Methode findet Rückwärtskanten (inkl Start- und Endpunkt) und fügt diese this.back_edges hinzu.
   * @param u Knoten in Bearbeitung
   * @param start Startknoten
   * @param end Zielknoten
   * @returns Nothing
   */
  find_back_edges(u: string, start: string, end: string) {
    // Derzeitiger Knoten ist zum 2. Mal am Start (Ende)
    if (u == start && this.col.get(u) == State.grey) {
      this.back_edges.push(this.edge);
      this.edge = [];
      this.done = false;
      return;
    }

    // entdecke u
    this.col.set(u, State.grey);

    // Bearbeitung von u
    var neighbours = this.AdjList.get(u);
    if (neighbours == undefined) return;

    // Wenn das Ende bereits entdeckt ist ...
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
        if (!this.done) {
          this.done = true;
        } else {
          this.back_edges.push(this.edge);
          this.edge = [];
          this.done = false;
        }
        this.edge.push(next);
      } else {
        // Nebenpfad -> Rückwärtskante weiter verfolgen
        this.edge.push(next);
      }
      this.find_back_edges(next, start, end);
      //Ende noch nicht entdeckt (suche Ende)
    } else {
      // nächsten Knoten auf Hauptpfad aufrufen (Adjazenzliste ist sortiert)
      if (neighbours[0] == end) {
        this.edge.push(end);
      }
      this.find_back_edges(neighbours[0], start, end);
    }
  }

  /**
   * Diese Methode erstellt einen Kreis auf den gefundenen Rückwärtskanten und
   * fügt alle Knoten auf diesem Kreis this.circle hinzu.
   * @param start Startknoten
   * @param end Endknoten
   */
  create_circle(start: string, end: string) {
    // Alle Knoten weiß setzen
    for (var u of this.AdjList.keys()) {
      this.col.set(u, State.white);
    }
    // Rückwärtskanten finden
    this.find_back_edges(start, start, end);

    // Startknoten behandeln und zu Kreis hinzufügen
    var next = start;
    this.circle.push(next);

    // Startknoten der Rückwärtskanten
    var start_nodes = this.back_edges.map(
      (back_edges) => back_edges[back_edges.length - 1]
    );
    // Finde Ende
    while (next != end) {
      const index = start_nodes.indexOf(next);
      // Wenn es eine Rückwärtskante gibt, die noch nicht besucht wurde ...
      if (
        index >= 0 &&
        this.col.get(next) != State.black &&
        this.col.get(this.back_edges[index][0]) != State.black
      ) {
        next = this.back_edges[index][0];
        // Kante auf Hauptpfad schwarz färben
        this.col.set(next, State.black);
        // Nehme Rückwärtskante (Richtung Ende) und füge alle Knoten dem Kreis hinzu
        this.circle.push(
          ...this.back_edges[index]
            .reverse()
            .slice(1, this.back_edges[index].length)
        );
        // Lösche Rückwärtskante
        this.back_edges[index] = [];
        // Wenn es keine Rückwärtskante gibt
      } else {
        // Gehe Richtung Ende (nach unten) auf dem Hauptpfad
        next = this.AdjList.get(next)![0];
        this.circle.push(next);
      }
    }

    // Endknoten der Rückwärtskanten
    var end_nodes = this.back_edges.map((back_edges) => back_edges[0]);
    // Finde Start
    while (next != start) {
      const index = end_nodes.indexOf(next);
      // Wenn es eine Rückwärtskante gibt, die noch nicht besucht wurde ...
      if (
        index >= 0 &&
        this.col.get(next) != State.black &&
        this.col.get(
          this.back_edges[index][this.back_edges[index].length - 1]
        ) != State.black
      ) {
        // Nehme Rückwärtskante (Richtung Start) und füge alle Knoten dem Kreis hinzu
        next = this.back_edges[index][this.back_edges[index].length - 1];
        this.circle.push(
          ...this.back_edges[index].slice(1, this.back_edges[index].length)
        );
        // Wenn es keine Rückwärtskante gibt
      } else {
        // Gehe Richtung Start (nach oben) auf dem Hauptpfad
        next = this.pi.get(next)!;
        this.circle.push(next);
      }
    }
  }
}
