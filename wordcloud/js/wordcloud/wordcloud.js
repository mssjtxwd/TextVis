
define(function (require) {
	var wcldConfig = require('./config');

	var self = {};
	var idBase = new Date() - 0; //随机id
	var DOM_WORDCLOUD_KEY = '_wCloud_instance_';
	var instances = {};

    var messages = {
        "dataError":"something wrong!"
    }

	self.init = function(dom){
		dom = dom instanceof Array ? dom[0] : dom;
		var key = dom.getAttribute(DOM_WORDCLOUD_KEY);
        if (!key) {
            key = idBase++;
            dom.setAttribute(DOM_WORDCLOUD_KEY, key);
        }

        instances = new WCloud(dom);
        instances.id = key;

		return instances;
	};
 
	function WCloud(dom){
        this.dom = dom;
        this.init();
	};

    function normalInt(min, max, iter) {
        iter = iter==0?1:iter;
        var arr = [];
        for (var i = 0; i < iter; i++) {
            arr[i] = Math.random();
        };
        return  Math.floor(arr.reduce(function(i,j){return i+j})/iter*(max-min))+min;  
    };

    //test whether the px has been set
    function collision(wordImageData){
        var wdata, wy, widx, widxend, fidx, wv, fv;
        wdata = wordImageData.data;
        for (var wy = 0;wy<wdata.length;wy++){         
                if(wdata[wy]) {return true;}   
        };
        return false;
    };

    WCloud.prototype= {
        init:function(){
            //create my canvas
            var canvas = document.createElement("canvas");
            canvas.width=this.dom.scrollWidth;
            canvas.height=this.dom.scrollHeight;
            this.dom.appendChild(canvas);
            this.canvas = canvas;
            if ( canvas.getContext) {
                var ctx = this.ctx = canvas.getContext('2d');
            };
        },
        
        //find the date
        setOption:function(option){
            if (option.data) {
                this.draw(option);
                return this;
            }else{
                alert("Data is not found!");
                return this;
            }
        },
             
        createAxis:function(ctx){
            ctx.save();
            var width = this.dom.scrollWidth;
            var height = this.dom.scrollHeight;

            ctx.translate(width/2,height/2);

            ctx.beginPath();
            ctx.moveTo(-(width/2),0);
            ctx.lineTo(width/2,0);

            ctx.moveTo(0,height/2); 
            ctx.lineTo(0,-height/2);
                        ctx.rotate(90 * Math.PI / 180);
            ctx.stroke();
            ctx.restore();
        },
        
        draw:function(option){
            var data=option.data;
            var ctx = this.ctx;
            ctx.translate(this.canvas.width/2,this.canvas.height/2);
            for (var i = 0; i < data.length; i++) { 
                ctx.save();  
                ctx.fillStyle = "#DEB887"; //color
                var fontsize ="Bold "+ data[i].frq +"px 微软雅黑"; 
                ctx.font = fontsize; //size
                var text = data[i].word;               
                var tWidth = ctx.measureText(text).width;
                var tHeight = data[i].frq;
                var x,y;
                while(true) {
                    x = normalInt(-this.canvas.width/2, this.canvas.width/2,10) - tWidth/2;  //randomly x
                    y = normalInt(-this.canvas.height/2, this.canvas.height/2,20)+tHeight/2;   //randomly y
                    var isCollision = collision(ctx.getImageData(x+this.canvas.width/2,y-tHeight+this.canvas.height/2,tWidth+3,tHeight+3));              
                    if (!isCollision) break;
                };
                ctx.fillText(text,x,y);
                ctx.restore();
            };

        }
    }

	return self;
});