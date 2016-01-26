
function MainWindow() {
	
	var config = require('config');
	var context = require('context');
	
	var moment = require('lib/Moment');
	var _ = require('lib/Underscore');
	var httpClient = require('lib/HttpClient');
	
	var bubblesView = require('ui/common/BubblesView');
	var startConvoCard = require('ui/common/StartConvoCard');
	var convoCard = require('ui/common/ConvoCard');
	
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
			backgroundColor: 'orange'
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
			//width: '29.06%',
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
		
		var account = Ti.App.properties.getObject('account');
		
		//Profile name and picture
		var profileView = Ti.UI.createView({
			height: '80%',
			width: Titanium.UI.SIZE,
			right: 12,
			layout: 'horizontal',
			
		});
		topNavView.add(profileView);
			
		
			var profilePicture = Ti.UI.createImageView({
				right: 0,
				image: 'images/joe',
				borderWidth: 1,
				borderColor: 'white'
			});
			
			
			var userNameLabel = Ti.UI.createLabel({
				right: 0,
				left: 10,
				height: Titanium.UI.SIZE,
				width: 100,
				width: Titanium.UI.SIZE,
				text: account.first_name + " " + account.last_name,
				color: 'white',
				font: {fontFamily: 'AvenirNext-Regular',
						fontSize: 16}
			});
			
	
		profileView.addEventListener('postlayout', function(e)
		{
			profileView.removeEventListener('postlayout', arguments.callee);
			var profileViewHeight = profileView.size.height;
			
			profilePicture.setHeight(profileViewHeight);
			profilePicture.setBorderRadius(profileViewHeight / 2);
			
			profileView.add(profilePicture);
			profileView.add(userNameLabel);
			
		});
			
	//Add Whatever button and make it dissapear when scrolling
    var whateverButton = Ti.UI.createImageView
    ({
		image: "/images/BTN",
		//zIndex: 2,
		width: '22%',
		bottom: '5%'
	});
	
	//whatever button click event creates StartConvoCard view
	whateverButton.addEventListener('click', function(e)
	{
		whateverButton.setTouchEnabled(false);
		var cardArgs = {};
		cardArgs.context = 'new';
		
			var startCard = new startConvoCard(win, cardArgs, mainContainerView.size.height);
			
			win.add(startCard);
		
			startCard.addEventListener('postlayout', function(e)
			{
				startCard.removeEventListener('postlayout', arguments.callee);
				
				var animation = Titanium.UI.createAnimation();
						animation.top = '5%';
						animation.duration = 250;
							
						startCard.animate(animation);
						
						whateverButton.setTouchEnabled(true);
			});	
	});	

	
	//Create scrollView to hold scrollViewContainer				
	var scrollView = Ti.UI.createScrollView
	({
		    showVerticalScrollIndicator: false,
			showHorizontalScrollIndicator: false,
			backgroundColor: purple,
			width: '100%',
			height: '100%',
			opacity: 1,
			layout: 'vertical',
			backgroundColor: purple
	});
		
		var bottomSpacer = Ti.UI.createView
		({
			width: '100%',
			height: 150,
			bottom: 0,
			backgroundColor: purple
		});
		
        scrollView.addEventListener('scrollend', showWhateverButton);	
        scrollView.addEventListener('scrollstart', hideWhateverButton);
        
        function hideWhateverButton(e) 
        {
			whateverButton.hide();
   		}
    
    	function showWhateverButton(e) 
    	{
    		whateverButton.show();
    	}
	

mainContainerView.add(scrollView);
mainContainerView.add(whateverButton);
win.add(mainContainerView);

		
win.addEventListener('postlayout', function(e){
	this.removeEventListener('postlayout', arguments.callee);
	
	//set screen dimensions in config.  They are used to size some UI elements including the convo bubbles
	var winHeight = win.size.height;
	var winWidth = win.size.width;
	
	config.setDimensions(winHeight, winWidth);
	
	//add BubblesView, which has a postlayout event to refresh 
	var bubbleView = new bubblesView(winHeight, winWidth);
	scrollView.add(bubbleView);
	scrollView.add(bottomSpacer);
});

//Event listener to create a card for a conversation.  These views persist for the lifespan of its conversation
Ti.App.addEventListener('app:createcard', function(e)
{
	var conversationCard = new convoCard(win, e, mainContainerView.size.height);
	win.add(conversationCard);
});


	
// /////////    testing buttons   ///////////////////

var testButton2 = Ti.UI.createView({
	height: 50,
	width: 100,
	bottom: 150,
	right: 50,
	backgroundColor: 'green',
	zIndex: 10
});

var button2Label = Ti.UI.createLabel({
	text: 'Refresh',
	color: 'black'
});

testButton2.add(button2Label);
win.add(testButton2);


testButton2.addEventListener('click', function(e){
	Ti.App.fireEvent('app:refresh');
});


///////// end test buttons   //////////////	
	

	
return win;
}

module.exports = MainWindow;	
	
					

	


