
var graph = {
  "nodes": [
    {"label": "0:今日の天気"},
    {"label": "1:屋内"},
    {"label": "2:DVD"},
    {"label": "3:寝る"},
    {"label": "4:出かける"},
    {"label": "5:映画館"},
    {"label": "6:ランニング"},
    {"label": "7:宇宙"},
    {"label": "8:世田谷"},
    {"label": "9:ここ"}
  ],
  "links": [
    {"source": 0, "target": 1},
    {"source": 0, "target": 7},
    {"source": 1, "target": 2},
    {"source": 1, "target": 3},
    {"source": 1, "target": 5},
    {"source": 0, "target": 4},
    // {"source": 4, "target": 5},
    // {"source": 4, "target": 6},
    // {"source": 5, "target": 3},
    {"source": 0, "target": 2},
    // {"source": 3, "target": 2},
    // {"source": 4, "target": 2},
    // {"source": 5, "target": 2},
    // {"source": 6, "target": 2},
    // {"source": 7, "target": 2}
  ]
};

var width = 400,
    height = 400,
    radius = 6;

var fill = d3.scale.category20();

// https://github.com/mbostock/d3/wiki/Force-Layout
var force = d3.layout.force()
    .charge(-200)
    .linkDistance(80)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", 800)
    .attr("height", 600);

function update(data) {
  var f = force
      .nodes(data.nodes)
      .links(data.links)
      .on("tick", tick)

  var nodeg = svg.selectAll("g")
    .data(data.nodes, function(d) {return d.label;});
  var nodeGroup = nodeg
    .enter()
    .append('g');
  nodeg.exit().remove();

  var node = nodeGroup.append("circle")
      .attr("r", radius - .75)
      .style("fill", function(d) { return fill(d.group); })
      .style("stroke", function(d) { return d3.rgb(fill(d.group)).darker(); })
      .on("click", click)
      .call(force.drag);

  var labels = nodeGroup.append("text")
      .text(function(d) { return d.label;});

  var linkd = svg.selectAll("line")
      .data(f.links(), function(d) {
        if (d.source instanceof Object) {
          return'id' + d.source.label + ':' + d.target.label;
        } else {
          return 'id' + d.source + ':' + d.target;
        }
      });
  linkd.enter().append("line");
  linkd.exit().remove();

  f.start();
}

update(graph);

function tick(e) {
  var k = 5 * e.alpha;

  svg.selectAll('line')
      .each(function(d) { d.source.y -= k, d.target.y += k; })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  svg.selectAll("g").attr("transform", function(d) {
    return 'translate(' + [d.x, d.y] + ')';
  });
}

function click(e) {
  graph.links.push({"source": 4, "target": 5});
  graph.links.push({"source": 4, "target": 6});
  update(graph);
}
