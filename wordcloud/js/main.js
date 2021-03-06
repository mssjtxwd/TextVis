require.config({
	baseUrl:"js/wordcloud",
    paths: {
    	jquery:'../jquery-1.11.1.min',
    	wCloud:"wordcloud"
    }
});

require(["jquery","wCloud"], function($,w) {
    var wcld = w;
    var option = {
    	data:[
			{"word":"word cloud","frq":50,"otherMsg":"tip Messege"},
			{"word":"word","frq":39,"otherMsg":"tip Messege"},
			{"word":"cloud","frq":14,"otherMsg":"tip Messege"},
			{"word":"ycw","frq":43,"otherMsg":"tip Messege"},
			{"word":"hyw","frq":20,"otherMsg":"tip Messege"},
			{"word":"hjf","frq":20,"otherMsg":"tip Messege"},
			{"word":"word","frq":19,"otherMsg":"tip Messege"},
			{"word":"cloud","frq":32,"otherMsg":"tip Messege"},
			{"word":"msf","frq":10,"otherMsg":"tip Messege"},
			{"word":"你好","frq":20,"otherMsg":"tip Messege"},
			{"word":"好困","frq":30,"otherMsg":"tip Messege"},
			{"word":"背锅侠","frq":15,"otherMsg":"tip Messege"},
		
			]
    }
    var wd = wcld.init($("#wordcloud")[0]);
    console.log(wd);
    wd = wd.setOption(option);

});
