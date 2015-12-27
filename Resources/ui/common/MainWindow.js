
exports.winHeight;
exports.winWidth;

function MainWindow() {
	
	var config = require('config');
	var context = require('context');
	
	var moment = require('lib/Moment');
	var _ = require('lib/Underscore');
	var httpClient = require('lib/HttpClient');
	
	var bubblesView = require('ui/common/BubblesView');
	var CreateCard = require('ui/common/CreateCard');
	
	var purple = config.purple;
	
	//TODO use blurView module to blur scroll container when bubble is selected - except selected bubble
	
	// Create the main window
	var win = Ti.UI.createWindow({
		backgroundColor: purple,
		width: '100%',
		height: '100%',
		orientationModes: [Ti.UI.PORTRAIT],
		});
	
	
	//Android specific stuff
	if(config.platform === config.platform_android) {
		win.exitOnClose = true;
		}

    
    //mainContainerView size is set from top and bottom of win
	var mainContainerView = Ti.UI.createView
	({
			width: '100%',
			top: '10.1%',
			bottom: 0,
			layout: 'absolute',	
	});	
	
		
	//create top nav view to hold logo and user profile 
	var topNavView = Ti.UI.createView
	({
		top: 20,
		height: '7.2%',
		width: '100%',	
	});
		

	//Add Whatever label upper-left and profile image and name button.  
    
    var labelView = Ti.UI.createImageView
    ({
		height: '60.41%',
		width: '29.06%',
		top: 7,
		left: 12,
		image: "/images/whateverlabel",
		backgroundColor: purple,
		zIndex: 2
	});	
	
	topNavView.add(labelView);
	win.add(topNavView);
	
	
	labelView.addEventListener('postlayout', function(e) 
		{
			this.removeEventListener('postlayout', arguments.callee);
			labelHeight = labelView.size.height;
			labelWidth = labelView.size.width;
		});

		
	//Add Whatever button and make it dissapear when scrolling
    var btnImageView = Ti.UI.createImageView
    ({
		image: "/images/BTN",
		//zIndex: 2,
		width: '22%',
		bottom: '5%'
	});
	
	btnImageView.addEventListener('click', popNewCard);	

	
	//Create scrollView to hold scrollViewContainer				
	var scrollView = Ti.UI.createScrollView
	({
		    showVerticalScrollIndicator: false,
			showHorizontalScrollIndicator: false,
			backgroundColor: purple,
			width: '100%',
			height: '100%',
			opacity: 1	
	});
		
        scrollView.addEventListener('scrollend', showWhateverButton);	
        scrollView.addEventListener('scrollstart', hideWhateverButton);
        
        function hideWhateverButton(e) 
        {
			btnImageView.visible = false;
   		}
    
    	function showWhateverButton(e) 
    	{
    		btnImageView.visible = true;
    	}
	

mainContainerView.add(scrollView);
mainContainerView.add(btnImageView);
win.add(mainContainerView);

		
win.addEventListener('postlayout', function(e){
	this.removeEventListener('postlayout', arguments.callee);
	
	Ti.API.info('win postlayout ran');
	exports.winHeight = win.size.height;
	exports.winWidth = win.size.width;
	
	//add BubblesView, which will have a postlayout event to refresh 
	var bubbleView = new bubblesView();
	scrollView.add(bubbleView);
});


	var cardContext = {};
	function popBubbleCard(args)
	{
		Ti.API.info(args);
		cardContext.context = 'else';
		var cardView = new CreateCard(cardContext, mainContainerView.size.height);
		mainContainerView.add(cardView);
		
		cardView.addEventListener('postlayout', function(e)
		{
			cardView.removeEventListener('postlayout', function(e){});
	
				var animation = Titanium.UI.createAnimation();
					animation.top = 0;
					animation.duration = 400;
					
				cardView.animate(animation);	
		});
	}
	
	function popNewCard()
	{
		cardContext.context = 'new';
		var cardView = new CreateCard(cardContext);
		mainContainerView.add(cardView);
		cardView.show();
	}
	
	
	
	
// /////////    testing buttons   ///////////////////

var testButton1 = Ti.UI.createView({
	height: 200,
	width: 200,
	bottom: 150,
	left: 50,
	backgroundColor: 'orange',
	zIndex: 10
});

win.add(testButton1);

testButton1.addEventListener('click', function(e){
	Ti.API.info('create convo');
	
	var request = {};
		
		account = Ti.App.Properties.getObject("account");
		
		request.userId = 12067189809;
		request.status = "OPEN";
		request.topic = "Call your friends lets get drunk";
		
		var invited = ['14066974685'];
		
		request.invitedUsers = invited;
		
		Ti.API.info(JSON.stringify(request));
		
		httpClient.doPost('/v1/conversation', request, function(success, response)
		{
			Ti.API.info(JSON.stringify(response));
		});
});

var testButton2 = Ti.UI.createView({
	height: 200,
	width: 200,
	bottom: 150,
	right: 50,
	backgroundColor: 'green',
	zIndex: 10
});

win.add(testButton2);


testButton2.addEventListener('click', function(e){
	Ti.API.info('refresh');
	Ti.App.fireEvent('app:refresh');
});


///////// end test buttons   //////////////	
	
	
	
	
	
return win;
}

module.exports = MainWindow;	
	
					

	


