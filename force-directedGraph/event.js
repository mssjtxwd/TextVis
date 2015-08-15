
    // EventHandler: a factory for producing event handlers window extual scope
    // - context: an object with scope needed by handler
    // - handler: an event handler function
    var EventHandler = function( context, handler, e ){
      return(
        function( e ) {
          handler( context, e );
        }
      );
    };

