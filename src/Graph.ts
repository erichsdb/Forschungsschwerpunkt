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
  bfs_animation: Array<{}>;
  circle_animation: Array<{}>;
  iteration_counter: number;
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
    this.bfs_animation = [];
    this.circle_animation = [];
    this.iteration_counter = 0;
  }

  addVertex(v: string) {
    this.AdjList.set(v, []);
  }

  addEdge(src: string, dest: string) {
    if (this.AdjList.get(src) !== undefined) {
      this.AdjList.get(src)?.push(dest);
      this.AdjList.get(dest)?.push(src);
    }
  }

  /**
   * Erstellt eine Visualisierung der Knoten und Kanten, basierend auf den derzeitigen Knotenfärbungen.
   * Eine Kante wird gefärbt, wenn bei benachbarte Knoten im Kreis auch benachbart sind.
   * @returns Objekt aus Knoten und Kanten mit Farben und Namen
   */
  getGraphD3() {
    // Visualisierung der Knoten
    var visited_nodes = [];
    var nodes = [];
    for (const v of this.AdjList.keys()) {
      nodes.push({ name: v, color: this.col.get(v) });
    }

    // Visualisierung der Kanten
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
          // Kante liegt im Kreis
          edges.push({ source: v, target: u, color: State.circle });
        } // Kante liegt nicht im Kreis 
        else edges.push({ source: v, target: u, color: "black" });
      }
      visited_nodes.push(v);
    }
    return { nodes: nodes, links: edges };
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
    var result = [];
    var current = end;
    var next = current;
    // Nur der Startknoten hat keinen Vorgänger
    while (next != null) {
      result.push(next);
      next = this.pi.get(next)!;

      // Schiebe Hauptpfadknoten an Position 0 der Adjazenzliste
      var neighbours = this.AdjList.get(next);
      if (neighbours && neighbours[0] != current) {
        // Finde index des nächsten Knotens
        const index = neighbours.findIndex((x) => x === current);
        // Tausche mit erster Stelle
        const b = neighbours[0];
        neighbours[0] = neighbours[index];
        neighbours[index] = b;
        // Aktualisiere Adajenzliste
        this.AdjList.set(next, neighbours);
      }
      current = next;
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

    // 2. Hauptschleife (bei zusammenhängenden Graphen passiert hier nichts)
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
    // Tiefensuche für L-Werte muss bereits gelaufen sein

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
   * Baut einen Kreis über zwei disjunkte Wege von start nach end.
   * Diese Methode nutzt Breitensuche, um den Hauptpfad zu finden und
   * die Adjazenzliste zu verändern und Tiefensuche, um die Low-Werte,
   * Entdeckzeit, Beendezeit und Vorgänger zu ermitteln. 
   * @param start Startknoten
   * @param end Endknoten
   */
  build_circle(start: string, end: string) {
    // Breitensuche um kürzesten Weg zu finden
    this.bfs(start);
    // Sortiere Adjazenzliste, so dass Hauptpfad immer an Adj.get(u)[0] ist
    this.find_path(end);
    // Tiefensuche um Low-Werte zu finden
    this.dfs(start);
    // Alle Knoten auf weiß setzen
    for (var u of this.AdjList.keys()) {
      this.col.set(u, State.white);
    }
    // Hauptpfad einfärben
    this.color_main_path(start, end);
    this.circle_animation.push(this.getGraphD3());
    // Kreis finden
    this.end_to_start(end, start, end, true);
    if (this.circle.length != 0) {
      this.col.set(start, State.main);
      this.connect_edge(start, []);
    }
  }

  /**
   * Diese Methode baut den Kreis von Endpunkt aus, bis der Start erreicht wird
   * @param current Derzeitiger zu bearbeitender Knoten
   * @param start Startknoten
   * @param end Endknoten
   * @param done Wahr -> Suche Low-Kante, Falsch -> Gehe auf Hauptpfad nach unten
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
          continue;
        }
      }
      // Falls eine Rückwärtskante gefunden wurde ...
      if (next != this.AdjList.get(current)![0]) {
        // Füge alle Knoten entland des Hauptpfades an den Kreis
        this.connect_edge(current, []);
        this.search_back_edge = false;
      } 
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
        // Entdecken der Rückwärtskante
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
            this.bfs_back_edge([current], []);
            done = false;
            continue;
          }
        }
        // Letzter Knoten der Rückärtskante ist Ausgangspunkt für die nächste Iteration
        if (this.last_node != "") {
          next = this.last_node;
          this.last_node = "";
        } else {
          console.log("Keine Rückwärtskante gefunden!");
          this.circle = [];
          return;
        }
      }
    }
    this.end_to_start(next, start, end, done);
  }

  /**
   * Diese Methode findet eine Rückwärtskante über die Low-Werte.
   * Fügt gefundene Knoten dem Kreis hinzu.
   * @param queue Warteschlange mit noch abzuarbeitenden Knoten
   * @param path bisher entdeckte Rückwärtskante
   */
  bfs_back_edge(queue: Array<string>, path: Array<string>) {
    if (queue.length == 0) return;

    const s = queue.shift()!;
    const col_s = this.col.get(s);
    this.col.set(s, State.grey);
    path.push(s);

    for (const v of this.AdjList.get(s)!) {
      // Füge Knoten der Warteschlange hinzu, wenn Low-Werte übereinstimmmen
      if (this.col.get(v) == State.white && this.l.get(s) == this.l.get(v)) {
        queue.push(v);
        // Füge Pfad dem Kreis hinzu, wenn Low-Wert gleich Entdeckzeit des Hauptpfadknotens
      } else if (
        col_s != State.main &&
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
    }
    this.bfs_back_edge(queue, Array.from(path));
  }

  /**
   * Geht vom Hauptpfad nach unten, bis wir bei einem bereits besuchten Hauptpfadknoten ankommen.
   * Fügt gefundene Knoten dem Kreis hinzu.
   * @param start Startknoten der Verbindung
   * @param edges Knoten der Verbindung als Array
   */
  connect_edge(start: string, edges: Array<string>) {
    // Füge Pfad dem Kreis hinzu, wenn ein bereits besuchter Knoten erreicht wird
    if (
      this.col.get(start) == State.black ||
      this.col.get(start) == State.grey
    ) {
      if (this.forward) this.circle.push(...edges);
      else this.circle.unshift(...edges.reverse());
      this.circle_animation.push(this.getGraphD3());
      return;
    }
    // Rufe nächsten Hauptknoten in Adjazenzliste auf
    this.col.set(start, State.grey);
    edges.unshift(start);
    this.circle_animation.push(this.getGraphD3());

    // Gehe auf Hauptpfad nach unten
    var next = this.AdjList.get(start)![0];
    this.connect_edge(next, edges);
  }

  /**
   * Diese Methode färbt alle Hauptkantenknoten, nachdem die Adjazenzliste sortiert wurde
   * @param start Startknoten
   * @param end Endknoten
   */
  color_main_path(start: string, end: string) {
    var next = this.AdjList.get(start)![0];
    this.col.set(start, State.main);
    if (next == end) this.col.set(next, State.main);
    else this.color_main_path(next, end);
  }
}
