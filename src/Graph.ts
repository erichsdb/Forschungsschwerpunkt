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
  back_edges: Array<Array<string>>;
  isCircle: boolean;
  bfs_animation: Array<{}>;
  circle_animation: Array<{}>;
  circles: Array<Array<string>>;
  complexity_counter: number;
  done: boolean = false;

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
    this.back_edges = [];
    this.isCircle = false;
    this.bfs_animation = [];
    this.circle_animation = [];
    this.circles = [];
    this.complexity_counter = 0;
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

  getGraphD3() {
    var visited_nodes = [];
    var nodes = [];
    for (const v of this.AdjList.keys()) {
      nodes.push({ name: v, color: this.col.get(v) });
    }

    var edges = [];
    for (const v of this.AdjList.keys()) {
      var v_index = this.circle.indexOf(v);
      for (const u of this.AdjList.get(v)!) {
        if (visited_nodes.indexOf(u) != -1) continue;
        const u_index = this.circle.indexOf(u);
        if (
          v_index != -1 &&
          u_index != -1 &&
          (u_index - 1 == v_index ||
            u_index + 1 == v_index ||
            (v_index != this.circle.lastIndexOf(v) &&
              this.circle.lastIndexOf(v) == u_index + 1) ||
            (u_index != this.circle.lastIndexOf(u) &&
              this.circle.lastIndexOf(u) == v_index + 1))
        ) {
          edges.push({ source: v, target: u, color: State.circle });
        } else edges.push({ source: v, target: u, color: "black" });
      }
      visited_nodes.push(v);
    }

    return { nodes: nodes, links: edges };
  }

  setNodeColor(v: string) {
    this.col.set(v, "red");
  }

  checkIfCirlce(start: string, end: string) {
    var col: Map<string, string> = new Map();

    // Alle Knoten weiß setzen
    for (const v of this.AdjList.keys()) {
      col.set(v, State.white);
    }

    // Starte bei Start
    this.circle_dfs(start, start, end, new Array<string>(), new Map(col));
  }

  circle_dfs(
    v: string,
    start: string,
    end: string,
    current_circle: Array<string>,
    col: Map<string, string>
  ) {
    const v_col = col.get(v);
    // Ist V kein Nachbar vom letzten Knoten im Kreis?
    if (
      this.done ||
      v_col == State.black ||
      (current_circle.length > 0 &&
        this.AdjList.get(current_circle[current_circle.length - 1])!.indexOf(
          v
        ) == -1)
    ) {
      return;
    }

    this.complexity_counter++;
    // Kreis gefunden -> Kreis ausgeben
    if (v_col == State.grey) {
      // Kreise mit Start & Ende und Anfang == Ende & Länge > 2
      if (
        current_circle.length > 2 &&
        current_circle.indexOf(end) != -1 &&
        this.AdjList.get(current_circle[current_circle.length - 1])!.indexOf(
          current_circle[0]
        ) != -1
      ) {
        // Start am Ende hinzufügen um Kreis zu schließen
        current_circle.push(current_circle[0]);
        // Kreis den gültigen Kreisen hinzufügen
        this.circles.push(current_circle);
        // true <=> findet nur einen Kreis, false <=> findet alle Kreise
        this.done = true;
        return;
      }
      // Kein Kreis gefunden -> DFS fortsetzen
    } else if (v_col == State.white) {
      if (v == start) col.set(v, State.grey);
      else col.set(v, State.black);

      // unbesuchte Knoten gefunden
      current_circle.push(v);
      for (var u of this.AdjList.get(v)!) {
        this.circle_dfs(
          u,
          start,
          end,
          Array.from(current_circle),
          new Map(col)
        );
      }
    }
  }

  colorCircle(chosen_circle: number = 0) {
    if (this.circles.length == 0) return;

    // Alle Knoten weiß setzen
    for (var u of this.AdjList.keys()) {
      this.col.set(u, State.white);
    }
    this.circle_animation.push(this.getGraphD3());
    // Kanten dem Graphen hinzufügen
    for (const v of this.circles[chosen_circle]) {
      this.circle.push(v);
      this.circle_animation.push(this.getGraphD3());
    }
  }

  eqSet(xs: Set<string>, ys: Set<string>) {
    return xs.size === ys.size && [...xs].every((x) => ys.has(x));
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

    this.bfs_animation.push(this.getGraphD3());

    // 2. Breitensuche mit Warteschlange
    this.col.set(s, State.grey);
    var Q = [];
    Q.push(s);

    this.bfs_animation.push(this.getGraphD3());

    while (Q.length != 0) {
      var u = Q[0];
      for (const v of this.AdjList.get(u)!) {
        if (this.col.get(v) == State.white) {
          this.col.set(v, State.grey);
          this.pi.set(v, u);
          this.bfs_animation.push(this.getGraphD3());
          Q.push(v);
        }
      }
      Q.shift();
      this.col.set(u, State.black);
      this.bfs_animation.push(this.getGraphD3());
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

  /**
   * Findet alle zweifachen Zusammenhangskomponenten in einem beliebigen Graph.
   * @param start Startknoten, vom dem aus gesucht wird
   */
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

  /**
   * Hilfsfunktion für zweichfache_Komponenten(start). Rekursive Suche nach Komponenten.
   * @param u derzeitige Knoten
   */
  ndfs_visit(u: string) {
    this.col.set(u, State.grey);
    for (const v of this.AdjList.get(u)!) {
      if (this.col.get(v) == State.white) {
        this.keller.push(v);
        this.ndfs_visit(v);

        if (this.l.get(v)! >= this.d.get(u)!) {
          // Solange Knoten von S entfernen und Ausgeben, bis v ausgegeben. Knoten u auch mit ausgeben;
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
  find_back_edges(
    u: string,
    start: string,
    end: string,
    edge: Array<string>,
    done: Boolean
  ) {
    // Derzeitiger Knoten ist zum 2. Mal am Start (Ende)
    if (u == start && this.col.get(u) == State.black) {
      this.back_edges.push(edge);
      for (const node of edge) this.col.set(node, State.black);

      edge = [];
      done = false;
      return;
    }

    if (this.col.get(u) == State.white)
      // entdecke u
      this.col.set(u, State.grey);

    // Bearbeitung von u
    var neighbours = this.AdjList.get(u)!;
    // Wenn es keine Nachbarn gibt, kann direkt
    if (neighbours == undefined) return;
    const precedessor = this.pi.get(u);
    // Vorgänger wird entfernt
    neighbours = neighbours.filter(
      (node) => node !== precedessor || this.col.get(node) == State.black
    );

    if (neighbours.length == 0) return;

    // Wenn das Ende bereits entdeckt ist ...
    if (this.col.get(end)! == State.black) {
      // weißem Knoten mit niedrigstem Low-Wert folgen ODER dem Nachfolger
      const next_array: Array<string> = [];
      var next = neighbours[0];
      // 3x Loopup O(1) -> pro Nachbar max. O(n-1)
      for (const neighbour of neighbours) {
        if (
          // Falls low(nachbar) <= low(current) UND col(nachbar) == white
          this.l.get(next)! >= this.l.get(neighbour)! &&
          (this.col.get(neighbour) != State.black || neighbour == start) &&
          neighbour != u
        ) {
          if (this.l.get(next)! >= this.l.get(neighbour)!)
            next_array.push(neighbour);
        }
      }

      for (var next of next_array) {
        var my_done = done;
        var my_edge = Array.from(edge);
        // Ist nächster Knoten grau? -> (Rückwertkante beendet und wieder auf Hauptpfad ODER noch auf Hauptpfad)
        if (this.col.get(next) == State.grey) {
          // Hauptpfad -> nächste Rückwärtskante suchen
          if (!my_done) {
            // Startpunkt der Rückwärtskante
            my_done = true;
            // Startpunkt d. Rückwärtskante markieren
            this.col.set(next, State.black);
          } else {
            my_edge.push(next);
            // Entpunkt d. Rückwärtskante markieren
            this.col.set(next, State.black);
            // Endpunkt der Rückwärtskante
            this.back_edges.push(my_edge);
            for (const node of my_edge) this.col.set(node, State.black);

            my_edge = [];
            // this.edge.push(next);
            my_done = false;
          }
          this.find_back_edges(next, start, end, my_edge, my_done);
        } else {
          // Hauptpfad -> Rückwärtskante
          if (
            my_edge.length == 0 &&
            // grau/weiß
            this.col.get(u) != State.white &&
            this.col.get(next) == State.white
          ) {
            my_edge.push(u);
            this.col.set(u, State.black);
            my_done = true;
          }
          // Rückwärtskante -> Rückwärtskante
          my_edge.push(next);
          this.find_back_edges(next, start, end, my_edge, my_done);
        }
      }
      //Ende noch nicht entdeckt (suche Ende)
    } else {
      // nächsten Knoten auf Hauptpfad aufrufen (Adjazenzliste ist sortiert)
      if (neighbours[0] == end) {
        done = true;
        // Startpunkt d. Rückwärtskante markieren
        this.col.set(neighbours[0], State.black);
      }
      this.find_back_edges(neighbours[0], start, end, edge, done);
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
    this.circle_animation.push(this.getGraphD3());

    // Rückwärtskanten finden
    this.find_back_edges(start, start, end, [], false);

    // Färbe Hauptkanten ein
    this.color_main_path(start, end);

    // Graph ohne Rückwärtskanten, kann keinen Kreis bilden
    if (this.back_edges.length < 1) {
      this.circle = [];
      return;
    }

    // zwei miteinander verbundene Knoten sind zweifach zusammenhängend, aber haben keinen ungerichteten Kreis
    if (Array.from(this.AdjList.keys()).length < 3) {
      this.circle = [];
      return;
    }

    // Startknoten behandeln und zu Kreis hinzufügen
    var next = start;

    this.circle.push(next);
    this.circle_animation.push(this.getGraphD3());

    // Startknoten der Rückwärtskanten
    var start_nodes = this.back_edges.map(
      (back_edges) => back_edges[back_edges.length - 2]
    );
    // Finde Ende
    while (next != end) {
      var index = -1;
      for (const neighbour of this.AdjList.get(next)!) {
        const temp = start_nodes.indexOf(neighbour);
        if (temp != -1 && this.col.get(start_nodes[index]) != State.circle)
          index = temp;
      }
      // Wenn es eine Rückwärtskante gibt, die noch nicht besucht wurde ...
      if (
        index >= 0 &&
        this.col.get(next) != State.black &&
        this.col.get(this.back_edges[index][0]) != State.black &&
        this.col.get(this.back_edges[index][1]) != State.circle
      ) {
        next = this.back_edges[index][0];
        // Nehme Rückwärtskante (Richtung Ende) und füge alle Knoten dem Kreis hinzu
        // Kante auf Hauptpfad schwarz färben
        this.col.set(next, State.black);

        const current_edge = this.back_edges[index]
          .reverse()
          .slice(1, this.back_edges[index].length);
        for (const v of current_edge) {
          this.circle.push(v);
          this.col.set(v, State.circle);
          this.circle_animation.push(this.getGraphD3());
        }

        // Lösche Rückwärtskante
        this.back_edges[index] = [];
        // Wenn es keine Rückwärtskante gibt
      } else {
        // Gehe Richtung Ende (nach unten) auf dem Hauptpfad
        next = this.AdjList.get(next)![0];
        this.circle.push(next);
        this.col.set(next, State.circle);
        this.circle_animation.push(this.getGraphD3());
      }
    }

    // Endknoten der Rückwärtskanten
    var end_nodes = this.back_edges.map((back_edges) => back_edges[1]);
    // Finde Start
    while (next != start) {
      var index = -1;
      for (const neighbour of this.AdjList.get(next)!) {
        const temp = end_nodes.indexOf(neighbour);
        if (temp != -1 && this.col.get(end_nodes[index]) != State.circle)
          index = temp;
      }
      // Wenn es eine Rückwärtskante gibt, die noch nicht besucht wurde ...
      if (
        index >= 0 &&
        this.col.get(next) != State.black &&
        this.col.get(
          this.back_edges[index][this.back_edges[index].length - 1]
        ) != State.black &&
        this.col.get(
          this.back_edges[index][this.back_edges[index].length - 2]
        ) != State.circle
      ) {
        // Nehme Rückwärtskante (Richtung Start) und füge alle Knoten dem Kreis hinzu
        next = this.back_edges[index][this.back_edges[index].length - 1];
        this.col.set(next, State.black);
        const current_back_edge = this.back_edges[index].slice(
          1,
          this.back_edges[index].length
        );
        for (const v of current_back_edge) {
          this.circle.push(v);
          this.col.set(v, State.circle);
          this.circle_animation.push(this.getGraphD3());
        }
        // Wenn es keine Rückwärtskante gibt
      } else {
        // Gehe Richtung Start (nach oben) auf dem Hauptpfad
        next = this.pi.get(next)!;
        this.circle.push(next);
        this.col.set(next, State.circle);
        this.circle_animation.push(this.getGraphD3());
      }
    }
  }

  color_main_path(start: string, end: string) {
    var next = this.AdjList.get(start)![0];
    this.col.set(start, State.main);
    if (next == end) this.col.set(next, State.main);
    else this.color_main_path(next, end);
  }
}
