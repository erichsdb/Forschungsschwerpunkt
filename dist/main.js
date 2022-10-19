/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Graph.ts":
/*!**********************!*\
  !*** ./src/Graph.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Graph = void 0;\r\nconst State_1 = __webpack_require__(/*! ./State */ \"./src/State.ts\");\r\n// Klasse für ungerichtete Graphen\r\nclass Graph {\r\n    constructor() {\r\n        this.search_back_edge = false;\r\n        this.forward = true;\r\n        this.last_node = \"\";\r\n        this.AdjList = new Map();\r\n        this.col = new Map();\r\n        this.pi = new Map();\r\n        this.d = new Map();\r\n        this.f = new Map();\r\n        this.l = new Map();\r\n        this.time = 0;\r\n        this.keller = [];\r\n        this.components = [];\r\n        this.circle = [];\r\n        this.bfs_animation = [];\r\n        this.circle_animation = [];\r\n    }\r\n    addVertex(v) {\r\n        this.AdjList.set(v, []);\r\n    }\r\n    addEdge(src, dest) {\r\n        var _a, _b;\r\n        if (this.AdjList.get(src) !== undefined) {\r\n            (_a = this.AdjList.get(src)) === null || _a === void 0 ? void 0 : _a.push(dest);\r\n            (_b = this.AdjList.get(dest)) === null || _b === void 0 ? void 0 : _b.push(src);\r\n        }\r\n    }\r\n    /**\r\n     * Erstellt eine Visualisierung der Knoten und Kanten, basierend auf den derzeitigen Knotenfärbungen.\r\n     * Eine Kante wird gefärbt, wenn bei benachbarte Knoten im Kreis auch benachbart sind.\r\n     * @returns Objekt aus Knoten und Kanten mit Farben und Namen\r\n     */\r\n    getGraphD3() {\r\n        // Visualisierung der Knoten\r\n        var visited_nodes = [];\r\n        var nodes = [];\r\n        for (const v of this.AdjList.keys()) {\r\n            nodes.push({ name: v, color: this.col.get(v) });\r\n        }\r\n        // Visualisierung der Kanten\r\n        var edges = [];\r\n        for (const v of this.AdjList.keys()) {\r\n            var v_index = this.circle.indexOf(v);\r\n            for (const u of this.AdjList.get(v)) {\r\n                if (visited_nodes.indexOf(u) != -1)\r\n                    continue;\r\n                const u_index = this.circle.indexOf(u);\r\n                if (v_index != -1 &&\r\n                    u_index != -1 &&\r\n                    (u_index - 1 == v_index ||\r\n                        u_index + 1 == v_index ||\r\n                        (v_index != this.circle.lastIndexOf(v) &&\r\n                            this.circle.lastIndexOf(v) == u_index + 1) ||\r\n                        (u_index != this.circle.lastIndexOf(u) &&\r\n                            this.circle.lastIndexOf(u) == v_index + 1))) {\r\n                    // Kante liegt im Kreis\r\n                    edges.push({ source: v, target: u, color: State_1.State.circle });\r\n                } // Kante liegt nicht im Kreis\r\n                else\r\n                    edges.push({ source: v, target: u, color: \"black\" });\r\n            }\r\n            visited_nodes.push(v);\r\n        }\r\n        return { nodes: nodes, links: edges };\r\n    }\r\n    /**\r\n     * Diese Methode initialisiert und führt die Breitensuche durch.\r\n     * @param s Startknoten\r\n     */\r\n    bfs(s) {\r\n        // 1. Initialisierung\r\n        for (var u of this.AdjList.keys()) {\r\n            this.col.set(u, State_1.State.white);\r\n            this.pi.set(u, null);\r\n        }\r\n        this.bfs_animation.push(this.getGraphD3());\r\n        // 2. Breitensuche mit Warteschlange\r\n        this.col.set(s, State_1.State.grey);\r\n        var Q = [s];\r\n        this.bfs_animation.push(this.getGraphD3());\r\n        while (Q.length != 0) {\r\n            var u = Q[0];\r\n            for (const v of this.AdjList.get(u)) {\r\n                if (this.col.get(v) == State_1.State.white) {\r\n                    this.col.set(v, State_1.State.grey);\r\n                    this.pi.set(v, u);\r\n                    this.bfs_animation.push(this.getGraphD3());\r\n                    Q.push(v);\r\n                }\r\n            }\r\n            Q.shift();\r\n            this.col.set(u, State_1.State.black);\r\n            this.bfs_animation.push(this.getGraphD3());\r\n        }\r\n    }\r\n    /**\r\n     * Nach der Breitensuche findet diese Funktion den kürzesten Weg von Start zu Ende\r\n     * über die Elternknoten.\r\n     * @param end Endknoten\r\n     */\r\n    find_path(end) {\r\n        var current = end;\r\n        var next = this.pi.get(current);\r\n        // Nur der Startknoten hat keinen Vorgänger\r\n        while (next != null) {\r\n            // Schiebe Hauptpfadknoten an Position 0 der Adjazenzliste\r\n            var neighbours = this.AdjList.get(next);\r\n            if (neighbours[0] != current) {\r\n                // Finde index des nächsten Knotens\r\n                const index = neighbours.findIndex((x) => x === current);\r\n                // Tausche mit erster Stelle\r\n                const b = neighbours[0];\r\n                neighbours[0] = neighbours[index];\r\n                neighbours[index] = b;\r\n                // Aktualisiere Adajenzliste\r\n                this.AdjList.set(next, neighbours);\r\n            }\r\n            current = next;\r\n            next = this.pi.get(next);\r\n        }\r\n    }\r\n    /**\r\n     * Diese Methode initialisiert und ruft die rekursive Tiefensuche auf.\r\n     * Als Ergebnis fallen Low-Werte, Entdeck-, Abschlusszeit und Elternliste an.\r\n     * @param start Startknoten, vom dem gesucht wird\r\n     */\r\n    dfs(start) {\r\n        // 1. Initialisierung\r\n        for (var u of this.AdjList.keys()) {\r\n            this.col.set(u, State_1.State.white);\r\n            this.pi.set(u, null);\r\n        }\r\n        this.time = 0;\r\n        // Beginne beim Startknoten\r\n        this.mdfs_visit(start);\r\n        // 2. Hauptschleife (bei zusammenhängenden Graphen passiert hier nichts)\r\n        for (var u of this.AdjList.keys()) {\r\n            if (this.col.get(u) == State_1.State.white)\r\n                this.mdfs_visit(u);\r\n        }\r\n    }\r\n    /**\r\n     * Diese Methode implementiert den Algorithmus von S.78 des Skripts.\r\n     * Der Graph wird mittels DFS rekursiv traversiert. Der Low-Wert wird u.a. berechnet.\r\n     * @param u Knoten, der besucht wird\r\n     * @returns\r\n     */\r\n    mdfs_visit(u) {\r\n        // entdecke u\r\n        this.col.set(u, State_1.State.grey);\r\n        this.d.set(u, this.time);\r\n        this.l.set(u, this.d.get(u));\r\n        this.time += 1;\r\n        // Bearbeitung von u\r\n        var neighbours = this.AdjList.get(u);\r\n        if (neighbours == undefined)\r\n            return;\r\n        for (var v of neighbours) {\r\n            if (this.col.get(v) == State_1.State.white) {\r\n                this.pi.set(v, u);\r\n                this.mdfs_visit(v);\r\n                // Kleinern Low-Wert des Kindes übernehmen\r\n                this.l.set(u, Math.min(this.l.get(u), this.l.get(v)));\r\n            }\r\n            // Rückwärtskante\r\n            if (this.col.get(v) == State_1.State.grey && this.pi.get(u) != v)\r\n                // Merken, welche am, weitesten zurück reicht\r\n                this.l.set(u, Math.min(this.l.get(u), this.d.get(v)));\r\n        }\r\n        this.col.set(u, State_1.State.black);\r\n        this.f.set(u, this.time);\r\n        this.time += 1;\r\n    }\r\n    /**\r\n     * Findet alle zweifachen Zusammenhangskomponenten in einem beliebigen Graph.\r\n     * @param start Startknoten, vom dem aus gesucht wird\r\n     */\r\n    zweifache_Komponenten(start) {\r\n        // Tiefensuche für L-Werte muss bereits gelaufen sein\r\n        // 1. Initialisierung\r\n        for (const v of this.AdjList.keys()) {\r\n            this.col.set(v, State_1.State.white);\r\n        }\r\n        // Keller ist bereits als leere Liste initialisiert\r\n        // this.keller = [];\r\n        // Beginne beim Startknoten (dieselbe Reihenfolge wie bei 1.)\r\n        this.ndfs_visit(start);\r\n        for (const v of this.AdjList.keys()) {\r\n            if (this.col.get(v) == State_1.State.white) {\r\n                this.ndfs_visit(v);\r\n                // Kann bei isolierten Knoten passieren\r\n                if (this.keller.length != 0) {\r\n                    // Knote in Q(?) ausgeben\r\n                    this.keller = [];\r\n                }\r\n            }\r\n        }\r\n    }\r\n    /**\r\n     * Hilfsfunktion für zweichfache_Komponenten(start). Rekursive Suche nach Komponenten.\r\n     * @param u derzeitige Knoten\r\n     */\r\n    ndfs_visit(u) {\r\n        this.col.set(u, State_1.State.grey);\r\n        for (const v of this.AdjList.get(u)) {\r\n            if (this.col.get(v) == State_1.State.white) {\r\n                this.keller.push(v);\r\n                this.ndfs_visit(v);\r\n                if (this.l.get(v) >= this.d.get(u)) {\r\n                    // Solange Knoten von S entfernen und Ausgeben, bis v ausgegeben. Knoten u auch mit ausgeben;\r\n                    var component = [this.keller.pop()];\r\n                    while (component[component.length - 1] !== v) {\r\n                        component.push(this.keller.pop());\r\n                    }\r\n                    component.push(u);\r\n                    this.components.push(component);\r\n                }\r\n            }\r\n        }\r\n        this.col.set(u, State_1.State.black);\r\n    }\r\n    /**\r\n     * Baut einen Kreis über zwei disjunkte Wege von start nach end.\r\n     * Diese Methode nutzt Breitensuche, um den Hauptpfad zu finden und\r\n     * die Adjazenzliste zu verändern und Tiefensuche, um die Low-Werte,\r\n     * Entdeckzeit, Beendezeit und Vorgänger zu ermitteln.\r\n     * @param start Startknoten\r\n     * @param end Endknoten\r\n     */\r\n    build_circle(start, end) {\r\n        // Breitensuche um kürzesten Weg zu finden\r\n        this.bfs(start);\r\n        // Sortiere Adjazenzliste, so dass Hauptpfad immer an Adj.get(u)[0] ist\r\n        this.find_path(end);\r\n        // Tiefensuche um Low-Werte zu finden\r\n        this.dfs(start);\r\n        // Alle Knoten auf weiß setzen\r\n        for (var u of this.AdjList.keys()) {\r\n            this.col.set(u, State_1.State.white);\r\n        }\r\n        // Hauptpfad einfärben\r\n        this.color_main_path(start, end);\r\n        this.circle_animation.push(this.getGraphD3());\r\n        // Kreis finden\r\n        this.end_to_start(end, start, end, true);\r\n        if (this.circle.length != 0) {\r\n            this.col.set(start, State_1.State.black);\r\n            this.connect_edge(start, []);\r\n        }\r\n    }\r\n    /**\r\n     * Diese Methode baut den Kreis von Endpunkt aus, bis der Start erreicht wird\r\n     * @param current Derzeitiger zu bearbeitender Knoten\r\n     * @param start Startknoten\r\n     * @param end Endknoten\r\n     * @param done Wahr -> Suche Low-Kante, Falsch -> Gehe auf Hauptpfad nach unten\r\n     */\r\n    end_to_start(current, start, end, done) {\r\n        // Abfangen beim Erreichen des Start\r\n        if (current == start) {\r\n            this.col.set(current, State_1.State.grey);\r\n            if (this.forward)\r\n                this.circle.push(current);\r\n            else\r\n                this.circle.unshift(current);\r\n            this.forward = !this.forward;\r\n            this.circle_animation.push(this.getGraphD3());\r\n            return;\r\n        }\r\n        // Nächster Knoten der Adjazenzliste\r\n        var next = this.AdjList.get(current)[0];\r\n        // Suchen der nächsten Rückwärtskante entlang des Hauptpfades\r\n        if (this.search_back_edge) {\r\n            var l_current = this.l.get(current);\r\n            // Iterieren über alle Nachbarn\r\n            for (const neighbour of this.AdjList.get(current)) {\r\n                const l_temp = this.l.get(neighbour);\r\n                // Exisitiert eine Rückwärtskante?\r\n                if (l_current == l_temp && this.col.get(neighbour) == State_1.State.white) {\r\n                    next = neighbour;\r\n                    break;\r\n                }\r\n            }\r\n            // Falls eine Rückwärtskante gefunden wurde ...\r\n            if (next != this.AdjList.get(current)[0]) {\r\n                // Füge alle Knoten entlang des Hauptpfades an den Kreis\r\n                this.connect_edge(current, []);\r\n                this.search_back_edge = false;\r\n            }\r\n            else if (this.col.get(current) != State_1.State.black) {\r\n                console.log(\"Kann Hauptpfad nicht weiter verfolgen\");\r\n                this.circle = [];\r\n                return;\r\n            }\r\n        }\r\n        else {\r\n            // Einen Knoten nach unten gehen, wenn Rückwärtskante verlassen wurde -> Suchen der nächsten Rückwärtskante entlang des Hauptpfades\r\n            if (!done) {\r\n                this.col.set(current, State_1.State.grey);\r\n                if (this.forward)\r\n                    this.circle.push(current);\r\n                else\r\n                    this.circle.unshift(current);\r\n                this.circle_animation.push(this.getGraphD3());\r\n                done = true;\r\n                // Richtungsänderung, wie Knoten dem Kreis hinzugefügt werden (von vorne/hinten)\r\n                this.forward = !this.forward;\r\n                // Suchen der nächsten Rückwärtskante entlang des Hauptpfades\r\n                this.search_back_edge = true;\r\n                // Entdecken der Rückwärtskante\r\n            }\r\n            else {\r\n                var l_current = this.l.get(current);\r\n                // Mit Low-Wert Rückwärtskante verfolgen (gibt es keine, wird next nicht verändert)\r\n                for (const neighbour of this.AdjList.get(current)) {\r\n                    const l_temp = this.l.get(neighbour);\r\n                    if (l_current == l_temp && this.col.get(neighbour) == State_1.State.white) {\r\n                        // Finden vom Ende der Rückwärtskante\r\n                        this.find_back_edge(current, []);\r\n                        done = false;\r\n                        break;\r\n                    }\r\n                }\r\n                // Letzter Knoten der Rückärtskante ist Ausgangspunkt für die nächste Iteration\r\n                if (this.last_node != \"\") {\r\n                    next = this.last_node;\r\n                    this.last_node = \"\";\r\n                }\r\n                else {\r\n                    console.log(\"Keine Rückwärtskante gefunden!\");\r\n                    this.circle = [];\r\n                    return;\r\n                }\r\n            }\r\n        }\r\n        this.end_to_start(next, start, end, done);\r\n    }\r\n    /**\r\n     * Diese Methode findet eine Rückwärtskante über die Low-Werte.\r\n     * Fügt gefundene Knoten dem Kreis hinzu.\r\n     * @param queue Warteschlange mit noch abzuarbeitenden Knoten\r\n     * @param path bisher entdeckte Rückwärtskante\r\n     */\r\n    bfs_back_edge(queue, path) {\r\n        if (queue.length == 0)\r\n            return;\r\n        const s = queue.shift();\r\n        const col_s = this.col.get(s);\r\n        this.col.set(s, State_1.State.grey);\r\n        path.push(s);\r\n        for (const v of this.AdjList.get(s)) {\r\n            // Füge Knoten der Warteschlange hinzu, wenn Low-Werte übereinstimmmen\r\n            if (this.col.get(v) == State_1.State.white && this.l.get(s) == this.l.get(v)) {\r\n                queue.push(v);\r\n                // Füge Pfad dem Kreis hinzu, wenn Low-Wert gleich Entdeckzeit des Hauptpfadknotens\r\n            }\r\n            else if (col_s != State_1.State.black &&\r\n                this.col.get(v) == State_1.State.black &&\r\n                this.l.get(s) == this.d.get(v)) {\r\n                // Kanten zum Kreis hinzufügen (je nach Richtung)\r\n                if (this.forward)\r\n                    this.circle.push(...path);\r\n                else\r\n                    this.circle.unshift(...path.reverse());\r\n                // Warteschlange leeren\r\n                queue = [];\r\n                // Rückkehr auf Hauptpfad\r\n                this.last_node = v;\r\n                return;\r\n            }\r\n        }\r\n        this.bfs_back_edge(queue, Array.from(path));\r\n    }\r\n    /**\r\n     * Diese Methode findet eine Rückwärtskante über die Low-Werte.\r\n     * Fügt gefundene Knoten dem Kreis hinzu.\r\n     * @param start Startknoten\r\n     * @param path Pfad vom Hauptpfad zur Rückwärtskante\r\n     */\r\n    find_back_edge(start, path) {\r\n        var next = start;\r\n        while (true) {\r\n            var current = next;\r\n            const low_current = this.l.get(next);\r\n            path.push(next);\r\n            const col_s = this.col.get(next);\r\n            this.col.set(next, State_1.State.grey);\r\n            for (const i of this.AdjList.get(next)) {\r\n                if (col_s != State_1.State.black &&\r\n                    this.col.get(i) == State_1.State.black && this.d.get(i) == low_current && i != this.pi.get(next)) {\r\n                    // Hauptpfad gefunden\r\n                    next = i;\r\n                    // Kanten zum Kreis hinzufügen (je nach Richtung)\r\n                    if (this.forward)\r\n                        this.circle.push(...path);\r\n                    else\r\n                        this.circle.unshift(...path.reverse());\r\n                    // Rückkehr auf Hauptpfad\r\n                    this.last_node = i;\r\n                    return;\r\n                }\r\n                else if (this.l.get(i) == low_current && this.col.get(i) == State_1.State.white) {\r\n                    // nächsten Knoten gefunden\r\n                    next = i;\r\n                    continue;\r\n                }\r\n            }\r\n            if (current == next)\r\n                return;\r\n        }\r\n    }\r\n    /**\r\n     * Geht vom Hauptpfad nach unten, bis wir bei einem bereits besuchten Hauptpfadknoten ankommen.\r\n     * Fügt gefundene Knoten dem Kreis hinzu.\r\n     * @param start Startknoten der Verbindung\r\n     * @param edges Knoten der Verbindung als Array\r\n     */\r\n    connect_edge(start, edges) {\r\n        // Füge Pfad dem Kreis hinzu, wenn ein bereits besuchter Knoten erreicht wird\r\n        if (this.col.get(start) == State_1.State.grey) {\r\n            if (this.forward)\r\n                this.circle.push(...edges.reverse());\r\n            else\r\n                this.circle.unshift(...edges);\r\n            this.circle_animation.push(this.getGraphD3());\r\n            return;\r\n        }\r\n        // Rufe nächsten Hauptknoten in Adjazenzliste auf\r\n        this.col.set(start, State_1.State.grey);\r\n        edges.push(start);\r\n        this.circle_animation.push(this.getGraphD3());\r\n        // Gehe auf Hauptpfad nach unten\r\n        var next = this.AdjList.get(start)[0];\r\n        this.connect_edge(next, edges);\r\n    }\r\n    /**\r\n     * Diese Methode färbt alle Hauptkantenknoten, nachdem die Adjazenzliste sortiert wurde\r\n     * @param start Startknoten\r\n     * @param end Endknoten\r\n     */\r\n    color_main_path(start, end) {\r\n        var next = this.AdjList.get(start)[0];\r\n        this.col.set(start, State_1.State.black);\r\n        if (next == end)\r\n            this.col.set(next, State_1.State.black);\r\n        else\r\n            this.color_main_path(next, end);\r\n    }\r\n}\r\nexports.Graph = Graph;\r\n\n\n//# sourceURL=webpack:///./src/Graph.ts?");

/***/ }),

/***/ "./src/State.ts":
/*!**********************!*\
  !*** ./src/State.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.State = void 0;\r\nexports.State = {\r\n    grey: \"orange\",\r\n    white: \"green\",\r\n    black: \"red\",\r\n    circle: \"blue\"\r\n};\r\n\n\n//# sourceURL=webpack:///./src/State.ts?");

/***/ }),

/***/ "./src/graphs/31_nodes.ts":
/*!********************************!*\
  !*** ./src/graphs/31_nodes.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.create_31_nodes_graph = void 0;\r\nconst Graph_1 = __webpack_require__(/*! ../Graph */ \"./src/Graph.ts\");\r\nfunction create_31_nodes_graph() {\r\n    var g = new Graph_1.Graph();\r\n    var vertices = [\r\n        \"A\",\r\n        \"B\",\r\n        \"C\",\r\n        \"D\",\r\n        \"E\",\r\n        \"F\",\r\n        \"G\",\r\n        \"H\",\r\n        \"I\",\r\n        \"J\",\r\n        \"K\",\r\n        \"L\",\r\n        \"M\",\r\n        \"N\",\r\n        \"O\",\r\n        \"P\",\r\n        \"Q\",\r\n        \"R\",\r\n        \"S\",\r\n        //\"T\",\r\n        \"U\",\r\n        \"V\",\r\n        \"W\",\r\n        \"X\",\r\n        \"Y\",\r\n        \"Z\",\r\n        \"A1\",\r\n        \"B1\",\r\n        \"C1\",\r\n        \"D1\",\r\n        \"E1\",\r\n    ];\r\n    // Knoten hinzufügen\r\n    for (var i = 0; i < vertices.length; i++) {\r\n        g.addVertex(vertices[i]);\r\n    }\r\n    // Kanten hinzufügen\r\n    g.addEdge(\"R\", \"W\");\r\n    g.addEdge(\"B\", \"W\");\r\n    g.addEdge(\"B\", \"R\");\r\n    g.addEdge(\"U\", \"A\");\r\n    // g.addEdge(\"U\", \"B\");\r\n    g.addEdge(\"U\", \"C\");\r\n    g.addEdge(\"A\", \"D\");\r\n    g.addEdge(\"A\", \"E\");\r\n    // g.addEdge(\"B\", \"E\");\r\n    // g.addEdge(\"B\", \"D\");\r\n    g.addEdge(\"C\", \"F\");\r\n    g.addEdge(\"D\", \"F\");\r\n    g.addEdge(\"D\", \"G\");\r\n    g.addEdge(\"E\", \"H\");\r\n    g.addEdge(\"F\", \"G\");\r\n    g.addEdge(\"G\", \"H\");\r\n    g.addEdge(\"G\", \"I\");\r\n    g.addEdge(\"H\", \"J\");\r\n    g.addEdge(\"H\", \"I\");\r\n    g.addEdge(\"I\", \"K\");\r\n    g.addEdge(\"I\", \"M\");\r\n    g.addEdge(\"I\", \"L\");\r\n    g.addEdge(\"J\", \"M\");\r\n    g.addEdge(\"K\", \"P\");\r\n    g.addEdge(\"L\", \"N\");\r\n    g.addEdge(\"L\", \"O\");\r\n    g.addEdge(\"M\", \"N\");\r\n    g.addEdge(\"O\", \"Q\");\r\n    g.addEdge(\"O\", \"R\");\r\n    g.addEdge(\"O\", \"S\");\r\n    g.addEdge(\"P\", \"Q\");\r\n    //g.addEdge(\"R\", \"L\");\r\n    g.addEdge('Q', 'S');\r\n    // g.addEdge(\"S\", \"T\");\r\n    // g.addEdge(\"S\", \"W\");\r\n    g.addEdge(\"S\", \"Z\");\r\n    // g.addEdge(\"T\", \"A1\");\r\n    g.addEdge(\"W\", \"X\");\r\n    g.addEdge(\"X\", \"Y\");\r\n    // g.addEdge(\"Y\", \"Z\");\r\n    g.addEdge(\"Y\", \"D1\");\r\n    g.addEdge(\"S\", \"E1\");\r\n    g.addEdge(\"Z\", \"A1\");\r\n    g.addEdge(\"A1\", \"B1\");\r\n    g.addEdge(\"B1\", \"C1\");\r\n    g.addEdge(\"C1\", \"V\");\r\n    g.addEdge(\"D1\", \"V\");\r\n    g.addEdge(\"D1\", \"E1\");\r\n    // g.addEdge(\"E1\", \"V\");\r\n    return g;\r\n}\r\nexports.create_31_nodes_graph = create_31_nodes_graph;\r\n\n\n//# sourceURL=webpack:///./src/graphs/31_nodes.ts?");

/***/ }),

/***/ "./src/graphs/articulation_point.ts":
/*!******************************************!*\
  !*** ./src/graphs/articulation_point.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.create_articulation_point_graph = void 0;\r\nconst Graph_1 = __webpack_require__(/*! ../Graph */ \"./src/Graph.ts\");\r\nfunction create_articulation_point_graph() {\r\n    var g = new Graph_1.Graph();\r\n    var vertices = [\"A\", \"B\", \"C\", \"D\", \"E\", \"F\", \"G\", \"H\", \"I\", \"U\", \"V\"];\r\n    // Knoten hinzufügen\r\n    for (var i = 0; i < vertices.length; i++) {\r\n        g.addVertex(vertices[i]);\r\n    }\r\n    // Kanten hinzufügen\r\n    g.addEdge(\"U\", \"A\");\r\n    g.addEdge(\"A\", \"B\");\r\n    g.addEdge(\"B\", \"C\");\r\n    g.addEdge(\"C\", \"D\");\r\n    g.addEdge(\"D\", \"E\");\r\n    g.addEdge(\"E\", \"F\");\r\n    g.addEdge(\"F\", \"V\");\r\n    g.addEdge(\"V\", \"G\");\r\n    g.addEdge(\"G\", \"H\");\r\n    g.addEdge(\"H\", \"I\");\r\n    g.addEdge(\"I\", \"F\");\r\n    return g;\r\n}\r\nexports.create_articulation_point_graph = create_articulation_point_graph;\r\n\n\n//# sourceURL=webpack:///./src/graphs/articulation_point.ts?");

/***/ }),

/***/ "./src/draw_graph/create_graph.js":
/*!****************************************!*\
  !*** ./src/draw_graph/create_graph.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _graphs_31_nodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../graphs/31_nodes */ \"./src/graphs/31_nodes.ts\");\n/* harmony import */ var _graphs_articulation_point__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../graphs/articulation_point */ \"./src/graphs/articulation_point.ts\");\n/* harmony import */ var _Graph__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Graph */ \"./src/Graph.ts\");\n\r\n\r\n\r\n\r\nvar g = (0,_graphs_31_nodes__WEBPACK_IMPORTED_MODULE_0__.create_31_nodes_graph)()\r\n\r\n// Start- und Endwerte definieren\r\nvar start = \"U\";\r\nvar end = \"V\";\r\n\r\n// Kreis bauen\r\ng.build_circle(start, end);\r\nconsole.log(g.circle);\r\n\r\n//intialize data\r\nvar graph = g.circle_animation[0];\r\n\r\n//initilize svg or grab svg\r\nvar svg = d3.select(\"svg\");\r\nvar width = svg.attr(\"width\");\r\nvar height = svg.attr(\"height\");\r\n\r\n// Set start, end\r\nvar start_field = d3.select(\"#start\");\r\nstart_field.text(\"Start: \" + start);\r\nvar target_field = d3.select(\"#end\");\r\ntarget_field.text(\"End: \" + end);\r\n\r\n// Slider\r\nvar xRangeSlider = document.getElementById(\"mySlider\");\r\nxRangeSlider.min = 0;\r\nxRangeSlider.max = g.circle_animation.length - 1;\r\nxRangeSlider.value = 0;\r\n\r\nvar simulation = d3\r\n  .forceSimulation(graph.nodes)\r\n  .force(\r\n    \"link\",\r\n    d3\r\n      .forceLink()\r\n      .id((d) => d.name)\r\n      .links(graph.links)\r\n  )\r\n  .force(\"charge\", d3.forceManyBody().strength(-60))\r\n  .force(\"center\", d3.forceCenter(width / 2, height / 2))\r\n  .on(\"tick\", ticked);\r\n\r\nvar links = svg\r\n  .append(\"g\")\r\n  .attr(\"class\", \"links\")\r\n  .selectAll(\"line\")\r\n  .data(graph.links)\r\n  .enter()\r\n  .append(\"line\")\r\n  .attr(\"stroke-width\", function (d) {\r\n    return 3;\r\n  })\r\n  .style(\"stroke\", (d) => d.color);\r\n\r\nvar drag = d3\r\n  .drag()\r\n  .on(\"start\", dragstarted)\r\n  .on(\"drag\", dragged)\r\n  .on(\"end\", dragended);\r\n\r\nvar textsAndNodes = svg\r\n  .append(\"g\")\r\n  .selectAll(\"g\")\r\n  .data(graph.nodes)\r\n  .enter()\r\n  .append(\"g\")\r\n  .call(drag);\r\n\r\nvar cirlces = textsAndNodes\r\n  .data(graph.nodes)\r\n  .append(\"circle\")\r\n  .attr(\"r\", 5)\r\n  .style(\"fill\", (d) => d.color);\r\nvar texts = textsAndNodes\r\n  .append(\"text\")\r\n  .attr(\"x\", 6)\r\n  .attr(\"y\", 3)\r\n  .text((d) => d.name);\r\n\r\nvar slider = d3.select(\"#mySlider\").on(\"change\", (d) => {\r\n  update(xRangeSlider.value);\r\n});\r\n\r\nvar slider_button = d3.select(\"#slider-button\");\r\nvar timer = null;\r\n\r\nslider_button.on(\"click\", (d) => {\r\n  var button = d3.select(\"#slider-button\");\r\n\r\n  if (parseInt(xRangeSlider.value) == parseInt(xRangeSlider.max))\r\n    xRangeSlider.value = xRangeSlider.min;\r\n\r\n  if (button.text() == \"Play\") {\r\n    timer = setInterval(step, 300);\r\n    button.text(\"Pause\");\r\n  } else if (button.text() == \"Pause\") {\r\n    clearInterval(timer);\r\n    button.text(\"Play\");\r\n  }\r\n});\r\n\r\nfunction step() {\r\n  update(++xRangeSlider.value);\r\n\r\n  if (parseInt(xRangeSlider.value) >= parseInt(xRangeSlider.max)) {\r\n    xRangeSlider.value = 0;\r\n    clearInterval(timer);\r\n    slider_button.text(\"Play\");\r\n  }\r\n}\r\n\r\nfunction update(selectedValue) {\r\n  graph = g.circle_animation[selectedValue];\r\n  // recolors circles\r\n  svg\r\n    .selectAll(\"circle\")\r\n    .data(graph.nodes)\r\n    .style(\"fill\", (d) => d.color);\r\n\r\n  // keep force on links\r\n  simulation = simulation\r\n    .force(\r\n      \"link\",\r\n      d3\r\n        .forceLink()\r\n        .id((d) => d.name)\r\n        .links(graph.links)\r\n    )\r\n    .force(\"charge\", d3.forceManyBody().strength(-60))\r\n    .force(\"center\", d3.forceCenter(width / 2, height / 2))\r\n    .on(\"tick\", ticked);\r\n\r\n  // recolor edges\r\n  svg\r\n    .selectAll(\"line\")\r\n    .data(graph.links)\r\n    .style(\"stroke\", (d) => d.color);\r\n}\r\n\r\nfunction ticked() {\r\n  // translate (x, y)\r\n  textsAndNodes.attr(\"transform\", (d) => \"translate(\" + d.x + \", \" + d.y + \")\");\r\n\r\n  links\r\n    .attr(\"x1\", function (d) {\r\n      return d.source.x;\r\n    })\r\n    .attr(\"y1\", function (d) {\r\n      return d.source.y;\r\n    })\r\n    .attr(\"x2\", function (d) {\r\n      return d.target.x;\r\n    })\r\n    .attr(\"y2\", function (d) {\r\n      return d.target.y;\r\n    });\r\n}\r\n\r\nfunction dragstarted(d) {\r\n  if (!d3.event.active) simulation.alphaTarget(0.3).restart();\r\n  d.fx = d.x;\r\n  d.fy = d.y;\r\n}\r\n\r\nfunction dragged(d) {\r\n  d.fx = d3.event.x;\r\n  d.fy = d3.event.y;\r\n}\r\n\r\nfunction dragended(d) {\r\n  if (!d3.event.active) simulation.alphaTarget(0);\r\n  d.fx = null;\r\n  d.fy = null;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/draw_graph/create_graph.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/draw_graph/create_graph.js");
/******/ 	
/******/ })()
;