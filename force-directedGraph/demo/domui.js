NODE_RADIUS=6;

// GraphUI:
var GraphUI = function(){};
GraphUI.prototype = {

  initialize: function( frame, origin,displayOriginEdges, displayEdges) {
    this['frame']=frame;    // frame dom object
	this['frame_width']=parseInt(frame.getAttribute("width"));
    this['frame_height']=parseInt(frame.getAttribute("height"));
	div = document.getElementById("div:"+frame.getAttribute("id"));
	this['frame_left'] = parseInt(div.offsetLeft);
	this['frame_top'] = parseInt(div.offsetTop);
	
	if (origin!=null) {
		this['origin'] = origin;
	}
	else 
	{
		var w = this['frame_width'];
		var h = this['frame_height'];
		var Tmp = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		Tmp.setAttributeNS(null,"cx",this['frame_width'] / 2);
		Tmp.setAttributeNS(null,"cy",this['frame_height'] / 2);
		Tmp.setAttributeNS(null,"r","0");
		this['frame'].appendChild(Tmp);
		this['origin'] = Tmp;
	}
	
    // switch for displaying origin edges
    this['displayOriginEdges'] = true;
    if ( displayOriginEdges != null ) {
      this['displayOriginEdges'] = displayOriginEdges;
    }

    // switch for displaying non-origin edges
    this['displayEdges'] = true;
    if ( displayEdges != null ) {
      this['displayEdges'] = displayEdges;
    }
	
	

  },

  // draw all nodes
  drawNodes: function() {
    for( var i=0; i<graph['nodes'].length; i++ ) {
      this.drawNode( graph.nodes[i] );
    }
  },

  // draw all edges
  drawEdges: function() {
    for( var i=0; i<graph.nodes.length; i++ ) {
      if ( this['displayOriginEdges'] ) {
        if ( graph.originEdges[i] ) {
          nodeI = graph.getNode(i);
          nodeJ = graph.origin;
          var distance = new Distance();
          distance.calculate( nodeI.position, nodeJ.position );
          this.drawEdge( nodeI, nodeJ, distance );
        }
      }
      
      if ( this['displayEdges'] ) {
        for( var j=0; j<graph.nodes.length; j++ ) {
          if ( graph.edges[i] && graph.edges[i][j] ) {
            nodeI = graph.getNode(i);
            nodeJ = graph.getNode(j);
            var distance = new Distance();
            distance.calculate( nodeI.position, nodeJ.position );
            this.drawEdge( nodeI, nodeJ, distance );
          }
        }
      }
    }
  },

  //
  setOriginText: function( text ) {
    this['origin'].innerHTML=text;
  },

  nodeRadius: function( node ) {
    return( NODE_RADIUS );
  },

  // draw the node at it's current position
  drawNode: function( node ) {
    try {
		var domNode = this.getNode(node.id);
		domNode.setAttributeNS(null,"cx",node['position']['x']);
		domNode.setAttributeNS(null,"cy",node['position']['y']);
      //this.getNode(node.id).style.left = (this['frame_left'] + node['position']['x']);
      //this.getNode(node.id).style.top = (this['frame_top'] + node['position']['y']);
    } catch( e ) {
    }
  },

  // draw the frame
  drawFrame: function( frame_width, frame_height ) {
    this['frame_width']=frame_width;
    this['frame_height']=frame_height;
    this.frame.style.width=frame_width;
    this.frame.style.height=frame_height;
  },

  // draw the origin
  drawOrigin: function( node ) {
	  
    this['origin'].setAttributeNS(null,"cx",node['position']['x']);
	this['origin'].setAttributeNS(null,"cy",node['position']['y']);
	//this.origin.style.left = (this['frame_left'] + node['position']['x']);
    //this.origin.style.top = (this['frame_top'] + node['position']['y']);
  },

  // add an edge to the display
  addEdge: function( nodeI, nodeJ ) {
    var edge = document.createElementNS("http://www.w3.org/2000/svg", "path");
    edge.id = 'edge'+nodeI.id+':'+nodeJ.id;
	var path = "M" + nodeI['position']['x'].toString() + "," + nodeI['position']['y'].toString() + " L" +
			   nodeJ['position']['x'].toString() + "," + nodeJ['position']['y'];
	edge.setAttributeNS(null,"d",path);
	edge.setAttributeNS(null,"fill","none");
	edge.setAttributeNS(null,"stroke","#123");
	edge.setAttributeNS(null,"stroke-width",0.3);
	if (!this['displayOriginEdges'] && (nodeI.id=='origin' || nodeJ.id=='origin')) 
		edge.setAttributeNS(null,"stroke-width",0);
    this['frame'].appendChild(edge);
  },

  // add a node to the display
  addNode: function( node, text ) {
    var domNode;
    //var radius = this.nodeRadius(node);
	domNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	domNode.setAttributeNS(null,"cx",parseInt(node['position']['x']));
	domNode.setAttributeNS(null,"cy",parseInt(node['position']['y']));
    domNode.setAttributeNS(null,"r",parseInt(node['mass']));
	domNode.setAttributeNS(null,"fill","#FF7F24")
	domNode.id='node'+node.id;
	this['frame'].appendChild(domNode);
    return domNode;
  },

  // return the UI representation of the graph node
  getNode: function( nodeId ) {
    if ( nodeId == 'origin' ) {
      return document.getElementById( 'origin' );
    }
    return document.getElementById( 'node' + nodeId );
  }, 

  // render an edge
  drawEdge: function ( nodeI, nodeJ, distance ) {

    // edges should appear between center of nodes
    var i = new Object();
	i.x = nodeI['position']['x'];
	i.y = nodeI['position']['y'];
	i.r = nodeI['mass'];
	
	var j = new Object();
	j.x = nodeJ['position']['x'];
	j.y = nodeJ['position']['y'];
	j.r = nodeJ['mass'];
    // get a distance vector between nodes
	
	if (Math.abs(i.x - j.x) < 0.0001)
	{
		if (i.y > j.y)
		{
			var tmp = i;
			i = j;
			j = tmp;
		}
		x1 = i.x;
		x2 = j.x;
		y1 = i.y + i.r;
		y2 = j.y - j.r;
	}
	else
	{	
		if (i.x > j.x)
		{
			var tmp = i;
			i = j;
			j = tmp;
		}
		var k = (i.y - j.y)/(i.x - j.x);
		x1 = i.x + i.r / Math.sqrt(k*k+1);
		x2 = j.x - j.r / Math.sqrt(k*k+1);
		y1 = k * (x1 - i.x) + i.y;
		y2 = k * (x2 - i.x) + i.y;
	}
	
	//draw line
	edge = document.getElementById('edge'+nodeI.id+':'+nodeJ.id);
	path = "M" + x1.toString() + "," + y1.toString() + " L" + x2.toString() + "," + y2.toString();
	edge.setAttributeNS(null,"d",path);
	
  }
}
    
// Text Node Template
var textNodeTmpl = document.createElement('div');
textNodeTmpl.style.position = 'absolute';
textNodeTmpl.style.zIndex = 3;
textNodeTmpl.style.fontFamily = "sans-serif";
textNodeTmpl.style.fontSize = "12px";
textNodeTmpl.style.textAlign = "center";
textNodeTmpl.style.height = "16px";
textNodeTmpl.style.width = "100px";
textNodeTmpl.style.textAlign = "left";

// Synset Node Template
var color = new Object();
color['adjective']="http://youarehere.kylescholz.com/cgi-bin/pinpoint.pl?title=&r=" +
  (NODE_RADIUS*2) + "&pt=8&b=656565&c=99ee55";
color['adverb']="http://youarehere.kylescholz.com/cgi-bin/pinpoint.pl?title=&r=" +
  (NODE_RADIUS*2) + "&pt=8&b=656565&c=eeee66";
color['verb']="http://youarehere.kylescholz.com/cgi-bin/pinpoint.pl?title=&r=" +
  (NODE_RADIUS*2) + "&pt=8&b=656565&c=ee9944";
color['noun']="http://youarehere.kylescholz.com/cgi-bin/pinpoint.pl?title=&r=" +
  (NODE_RADIUS*2) + "&pt=8&b=656565&c=6688ee";


