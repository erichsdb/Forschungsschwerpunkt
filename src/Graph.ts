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
  search_back_edge: boolean = false;
  forward: boolean = true;
  last_node: string = "";

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
   * @param end Endknoten
   * @returns Array<string> mit Pfad von Start zu Ende
   */
  find_path(end: string) {
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

  build_circle(start: string, end: string) {
    for (var u of this.AdjList.keys()) {
      this.col.set(u, State.white);
    }
    this.color_main_path(start, end);
    this.circle_animation.push(this.getGraphD3());

    //this.circle.push(end);
    //this.col.set(end, State.grey);

    this.end_to_start(end, start, end, true);
    if (this.circle.length != 0) {
      this.start_to_end(start, start, end, []);
    }

    console.log(this.circle);
  }

  /**
   * Diese Methode findet alle benötigten Rückwärtskanten für einen Kreis
   * @param current Derzeitiger zu bearbeitender Knoten
   * @param start Startknoten
   * @param end Endknoten
   * @param done Wahr -> Suche Low-Kante, Falsch -> Gehe auf Hauptpfad nach unten
   * @returns Nichts
   */
  end_to_start(current: string, start: string, end: string, done: boolean) {
    // Abfangen beim Erreichen des Start
    if (current == start) {
      this.col.set(current, State.black);
      if (this.forward) this.circle.push(current);
      else this.circle.unshift(current);
      this.forward = !this.forward;
      this.circle_animation.push(this.getGraphD3());
      return;
    }

    // Abbruchbedingung für bereits besuchte Knoten (nicht auf Hauptpfad)
    if (this.col.get(current) == State.black) {
      this.circle = [];
      return;
    }

    // Nächste Knoten der Adjazenzliste
    var next = this.AdjList.get(current)![0];

    // Suchen der nächsten Rückwärtskante entlang des Hauptpfades
    if (this.search_back_edge) {
      var l_current = this.l.get(current)!;

      // Iterieren über alle Nachbarn
      for (const neighbour of this.AdjList.get(current)!) {
        const l_temp = this.l.get(neighbour)!;
        // Exisitiert eine Rückwärtskante?
        if (
          (l_current == l_temp && this.col.get(neighbour) == State.white) ||
          neighbour == start
        ) {
          next = neighbour;
        }
      }
      // Falls eine Rückwärtskante gefunden wurde ...
      if (next != this.AdjList.get(current)![0]) {
        // Füge alle Knoten entland des Hauptpfades an den Kreis
        this.connect_edge(current, []);
        this.search_back_edge = false;
      }
      // Nehmen der nächsten Rückwärtskante
    } else {
      // Einen Knoten nach unten gehen, wenn Rückwärtskante verlassen wurde -> Suchen der nächsten Rückwärtskante entlang des Hauptpfades
      if (!done) {
        this.col.set(current, State.grey);
        if (this.forward) this.circle.push(current);
        else this.circle.unshift(current);
        this.circle_animation.push(this.getGraphD3());

        done = true;
        // Richtungsänderung, wie Knoten dem Kreis hinzugefügt werden (von vorne/hinten)
        this.forward = !this.forward;
        // Suchen der nächsten Rückwärtskante entlang des Hauptpfades
        this.search_back_edge = true;
        // Weiterverfolgen der Rückwärtskante, bzw. Beenden der Suche -> Tiefensuche bis wieder auf Hauptpfad
      } else {
        var l_current = this.l.get(current)!;
        // Mit Low-Wert Rückwärtskante verfolgen (gibt es keine, wird next nicht verändert)
        for (const neighbour of this.AdjList.get(current)!) {
          const l_temp = this.l.get(neighbour)!;
          if (
            (l_current == l_temp && this.col.get(neighbour) == State.white) ||
            neighbour == start
          ) {
            // Finden vom Ende der Rückwärtskante
            this.bfs_back_edge(end, [current], []);
            done = false;
          }
        }
        if (this.last_node != "") {
          next = this.last_node;
          this.last_node = "";
        } else {
          console.log("Keine Rückwärtskante gefunden!");
          return;
        }
      }
    }

    if (
      this.col.get(current) == State.white
    ) {
      this.col.set(current, State.black);
      if (this.forward) this.circle.push(current);
      else this.circle.unshift(current);
      this.circle_animation.push(this.getGraphD3());
    } else if (
      this.col.get(current) == State.main &&
      this.col.get(next) == State.main &&
      next == this.pi.get(current)!
    ) {
      this.circle = [];
      return;
    }
    this.end_to_start(next, start, end, done);
  }
  bfs_back_edge(end: string, queue: Array<string>, path: Array<string>) {
    if (queue.length == 0) return;
    const s = queue.shift()!;
    path.push(s);

    // Breitensuche rekursiv
    this.col.set(s, State.grey);

    for (const v of this.AdjList.get(s)!) {
      if (this.col.get(v) == State.white && this.l.get(s) == this.l.get(v)) {
        this.col.set(v, State.grey);
        queue.push(v);
      } else if (
        this.col.get(v) == State.main &&
        this.l.get(s) == this.d.get(v)
      ) {
        // Kanten zum Kreis hinzufügen (je nach Richtung)
        if (this.forward) this.circle.push(...path);
        else this.circle.unshift(...path.reverse());
        // Warteschlange leeren
        queue = [];
        // Rückkehr auf Hauptpfad
        this.last_node = v;
        return;
      }

      this.bfs_back_edge(end, queue, Array.from(path));
    }
  }

  connect_edge(start: string, edges: Array<string>) {
    console.log(start);
    if (
      this.col.get(start) == State.black ||
      this.col.get(start) == State.grey
    ) {
      if (this.forward) this.circle.push(...edges);
      else this.circle.unshift(...edges.reverse());
      this.circle_animation.push(this.getGraphD3());
      return;
    }
    this.col.set(start, State.grey);
    edges.unshift(start);
    this.circle_animation.push(this.getGraphD3());

    var next = this.AdjList.get(start)![0];
    this.connect_edge(next, edges);
  }

  start_to_end(
    current: string,
    start: string,
    end: string,
    path: Array<string>
  ) {
    if (current == end) {
      this.col.set(current, State.black);
      if (this.forward) this.circle.push(...path);
      else this.circle.unshift(...path.reverse());
      this.circle_animation.push(this.getGraphD3());
      return;
    }

    if (
      (this.col.get(current) == State.black ||
        this.col.get(current) == State.grey) &&
      current != start
    ) {
      if (this.forward) this.circle.push(...path);
      else this.circle.unshift(...path.reverse());
      this.circle_animation.push(this.getGraphD3());
      return;
    }

    // Nächstes Element auf Hauptpfad wählen
    var next = this.AdjList.get(current)![0];

    this.col.set(current, State.black);
    if (this.forward) path.push(current);
    else path.unshift(current);

    this.start_to_end(next, start, end, path);
  }

  color_main_path(start: string, end: string) {
    var next = this.AdjList.get(start)![0];
    this.col.set(start, State.main);
    if (next == end) this.col.set(next, State.main);
    else this.color_main_path(next, end);
  }
}
