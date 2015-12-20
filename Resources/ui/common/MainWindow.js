
	

function MainWindow() {
	
	var config = require('config');
	var context = require('context');
	
	var moment = require('lib/Moment');
	var _ = require('lib/Underscore');
	var httpClient = require('lib/HttpClient');
	
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
	
//btnImageView.addEventListener('click', popNewCard);	

// /////// testing send push notification   ###########

btnImageView.addEventListener('click', function(e)
{
	var request = {};
	
	Ti.API.info('testing change github');
	
	httpClient.doPost('/v1/sendPushNotification', request, function(success, response) {
		Ti.API.info(JSON.stringify(response));
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
	
	
	//scrollViewContainer is inside scrollView.  The bubbles are its children.  
	var scrollViewContainer = Ti.UI.createView
	({
			backgroundColor: purple,
			layout: 'absolute',
			height: Titanium.UI.SIZE,
			width: '100%',
			top: 0
	});	

scrollView.add(scrollViewContainer);
mainContainerView.add(scrollView);
mainContainerView.add(btnImageView);
win.add(mainContainerView);
		
win.addEventListener('postlayout', calcBubbles);
	
function calcBubbles(e)
{
	Ti.API.info('calcBubbles');
	win.removeEventListener('postlayout', calcBubbles);
		
};


	function layoutBubbles(conversations)
	{
		var winHeight = win.size.height;
		var winWidth = win.size.width;
		
		for (i = 0; i < conversations.length; i++)
		{
			var bubView = new constructBubble(winHeight, winWidth, conversations[i]) ;
			
			if (i == (conversations.length - 1))   //Add extra space below last bubView being added to accomidate the whatever button
			{
				bubView.bottom = 200;
			}
	
			scrollViewContainer.add(bubView);	
			bubView.fireEvent('animate', {});
		}	
		
		if (scrollViewContainer.size.height < scrollView.size.height)
		{
			scrollViewContainer.height = scrollView.size.height + 10;
		}
		if (scrollViewContainer.size.height > 1500)
		{
			scrollView.showVerticalScrollIndicator = true;
		}
	}
	
	
		function constructBubble(winHeight, winWidth, conversation)  
		{
			var bubbleAttribute = 2;
			
			//check if iphone 4s aspect ratio
			if (winHeight / winWidth == 1.5){
				var bubViewHeight = winHeight * .255;
				var bubViewWidth = winWidth * .421; 
				
				var bubDiameter = bubViewHeight * .932;
				var bubLeftRight = bubViewWidth * .064; 
				var bubTopBottom = bubViewHeight * .034;
				var bubRadius = bubDiameter / 2;
				var bubBorder = bubDiameter *.025;
				var buttonBottom = winHeight * .02;
			} else {
				var bubViewHeight = winHeight * .221;
				var bubViewWidth = winWidth * .421;
				
				var bubDiameter = bubViewHeight * .932;
				var bubLeftRight = bubViewWidth * .064; 
				var bubTopBottom = bubViewHeight * .034;
				var bubRadius = bubDiameter / 2;
				var bubBorder = bubDiameter *.025;
				var buttonBottom = winHeight * .032;
			
			}
			
				
				
			var bubViewTop = conversation.top_y * bubViewHeight;               //get from DB 
			var bubPosition = conversation.position;
			
			var convoKey = conversation.convo_key;
			var createdBy = conversation.created_by;
			var newInfo = conversation.new_info;
			var inOut = conversation.in_out;
			var hapStatus = conversation.happening_status;
			
			
			var bubView = Ti.UI.createView({
				width: bubViewWidth,
				height: bubViewHeight,
				top: bubViewTop,                  //set to bubViewTop
				
				
				//opacity: formDB,    based off time since activity
			});
			
			bubView.special = convoKey;
			
			bubView.addEventListener('click', function(e)
			{
				popBubbleCard(bubView.special);
			});
			
			if (bubPosition == 'left')
			{
				bubView.left = '2%';
			}
			if (bubPosition == 'right')
			{
				bubView.right = '2%';
			}
			
			
			
			var mask = Ti.UI.createImageView({				
				image: '/images/joe',						//not sure where to put this to pull it from  //prolly the filesystem
				borderRadius: bubRadius,
				borderColor: 'white',
				width: bubDiameter,
				height: bubDiameter,
				top: bubTopBottom,
				botton: bubTopBottom,
				right: bubLeftRight,
				left:  bubLeftRight,
				
			});
			
			
			
			if (hapStatus == 'happening')
			{
				mask.borderWidth = bubBorder;
				
			}else{
				mask.borderColor = purple;		
				var spinnerView = Ti.UI.createView({
					height: Ti.UI.SIZE,
					width: Ti.UI.SIZE
				});
				var spinner = Ti.UI.createImageView({
					image: '/images/spinMask',
					height: bubDiameter + 10,
					width: bubDiameter + 10
				});
				spinnerView.add(spinner);
				bubView.add(spinner);
			
			var t = Ti.UI.create2DMatrix();	
					
			function startRotate()											//TODO figure out why some spinners rotate slower
			{		
					var a = Titanium.UI.createAnimation();
					t = t.rotate(7);
					a.transform = t;
					a.duration = 50;
					
					a.addEventListener('complete', startRotate);
				
					spinner.animate(a);
			}
			
				
				bubView.addEventListener('animate', function(e){
					Ti.API.info('animate');
					startRotate();
				});			
				
			}
			
			
			var bubShadeMask = Ti.UI.createImageView({
				
				backgroundColor: 'black',
				opacity: 0.45,
				width: Titanium.UI.FILL,
				height: '35%',
				bottom: 0
			});
			
			var fontSize = bubDiameter * .094;
			
			var name = Ti.UI.createLabel({
				color: 'white',
				font: {fontSize:fontSize,
					   fontFamily: 'OpenSans-Semibold'},
				text: createdBy,								//fromDB
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				bottom: '18%',
				width: Ti.UI.SIZE, 
				height: Ti.UI.SIZE,
				zIndex: 3,
				opacity: 1.0,
			});
				
			mask.add(name);
			
			var commentIndicator = Ti.UI.createImageView({
				image: '/images/commentIndicatorBlue',
				top: '2%',
				right: '14%',
				height: '20.5%',
				width: '19.2%',
				zIndex: bubbleAttribute,
				
			});
			var imInIndicator = Ti.UI.createImageView({
				image: '/images/imInIndicator',
				top: '24%',
				right: 0,
				height: '20.5%',
				width: '19.2%',
				zIndex: bubbleAttribute
			});
		mask.add(bubShadeMask);	
		bubView.add(mask);	
		
		if (newInfo == 'true')
		{
			bubView.add(commentIndicator);
		}
		
		if (inOut == 'true')
		{
			bubView.add(imInIndicator);
		}
		
	
		return bubView;
	};
	
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
	
	
return win;
}

module.exports = MainWindow;	
	
					

	


