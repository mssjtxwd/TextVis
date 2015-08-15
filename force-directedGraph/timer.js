

    // TimerControl: 
    var TimerControl = function(){};
    TimerControl.prototype = {
      initialize: function( timeout ) {
        this['timer'];
        this['TIMEOUT'] = timeout;
        this['interupt'] = true;
        this['subscribers'] = new Array();
        this['ontimeout'] = new EventHandler( this,
          // notify subscribers and restart timer
          function( context ) {
            context.notify();
            if ( !context.interupt ) { context.start(); }
          }
        );
      },

      start: function() {
        this['interupt']=false;
        this['timer'] = setTimeout(this.ontimeout,this['TIMEOUT']);
      },

      stop: function() {
        this['interupt']=true;
      },

      // add observers to subscribers queue
      subscribe: function( observer ) {
        this.subscribers.push( observer );
      },

      // notify observers wen an event has occured
      notify: function( key, value ) {
        for( var i=0; i<this.subscribers.length; i++ ) {
          this.subscribers[i].update();
        }
      }
    }

