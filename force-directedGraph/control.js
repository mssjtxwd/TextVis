

// mouse move capture for IE
var IE = document.all?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE)

// UserControl:
var UserControl = function(){};
UserControl.prototype = {

  initialize: function( timer, graph, ui ) {
    this['timer'] = timer;
    this['graph'] = graph;
    this['ui'] = ui;
    this['lastSelectedNode']=-1;
    this['liveNode']=-1;
    var context=this;


    // append the mousemove eventhandler
    document.onmousemove = function( e ) {
      return(
        context.moveSelected( e )
      );
    };

    // append the mouseup eventhandler
    document.onmouseup = function( e ) {
      return(
        context.unselectNode( e )
      );
    };
  },


  // make this node 'selected' in the graph
  selectNode: function( e, node ) {
    if ( node == this['liveNode'] ) {
        this.unattach( e, this['liveNode'] );
    } else if ( this['liveNode'] != -1 ) {
      this.graph.addEdge( graph.getNode(this['liveNode']), graph.getNode(node), 48 );
    }
    this['graph'].setSelected( node );
  },

  focusNode: function( e, node ) {
    this['liveNode'] = node;
    graphui.setLive( graph.getNode(node) );
  },

  unattach: function( e, node ) {
    if ( this['liveNode'] != -1 ) {
      var at = this['liveNode'];
      graphui.unSetLive( graph.getNode(node) );
      this['liveNode'] = -1;
    }
  },

  // unselect this node in the graph
  unselectNode: function() {
    this['lastSelectedNode'] = this['graph'].getSelected();
    this['graph'].clearSelected();
  },

  // handle mouse movement when a node is selected
  moveSelected: function( e ) {
    if ( graph.hasSelected() ) {
      var selectedNode = graph.getSelected();

      var tempX;
      var tempY;
      // get the cursor position
      if (IE) {
        tempX = event.clientX + document.body.scrollLeft;
        tempY = event.clientY + document.body.scrollTop;
      } else {
        tempX = e.pageX;
        tempY = e.pageY;
      }

      tempX -= graphui.frame_left;
      tempY -= graphui.frame_top;

      // set the node position
      graph.getNode( selectedNode ).position['x']=tempX;
      graph.getNode( selectedNode ).position['y']=tempY;

      // if the timer is interrupted, we still want the graph to move while we move the selected node around
      if ( this.timer['interupt'] ) {
        this.graph.applyForce();
      }
    }
  },

  // 
  addEdge: function( node1, node2, weight ) {
    if ( !weight ) { weight=48; }
    this.graph.addEdge( node1, node2, weight );
  },

  // 
  addNode: function( text, mass, originEdge, originEdgeWeight ) {

    var node;
    
    if (!mass) { mass=1; }
    node = graph.addNode( mass, text );

    var domNode = this.ui.getNode( node.id );
    var context = this;

    if ( originEdge ) { 
      if ( !originEdgeWeight ) { originEdgeWeight=92 }
      this.graph.addOriginEdge( node, originEdgeWeight );
      this.ui.addEdge( node, graph.getOrigin(), originEdgeWeight );
    }

    // add a mousedown event handler
    domNode.onmousedown=function(e) {
      return(
        context.selectNode(e, node.id)
      );
    };

    return node;
  }
}
