
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
	var account = Ti.App.properties.getObject('account');
	
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
			backgroundColor: 'green'
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
			
			startCard.open();
		
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

	
	var tableData = [];
	
	var row = Ti.UI.createTableViewRow({
		backgroundColor: purple,
		height: Ti.UI.SIZE,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE, 
		//layout: 'vertical'
	});
	
	var bottomPadding = Ti.UI.createTableViewRow({
		width: '100%',
		height: 150,
		backgroundColor: purple,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
		row.addEventListener('postlayout', function(e){
			if(row.size.height > 1500)
			{
				tableView.addEventListener('scrollend', showWhateverButton);	
		        tableView.addEventListener('scroll', hideWhateverButton);
			              
		        function hideWhateverButton(e) 
		        {
					whateverButton.hide();
		   		}
		    
		    	function showWhateverButton(e) 
		    	{
		    		whateverButton.show();
		    	}
			}
		});
	
	var control = Ti.UI.createRefreshControl({
    tintColor:'white'
	});
	
	control.addEventListener('refreshstart', function(e){
		Ti.API.info('refreshstart');
		Ti.App.fireEvent('app:refresh');
		setTimeout(function(){
			control.endRefreshing();
		}, 1500);
	});
	
	
	var tableView = Ti.UI.createTableView({
		width: '100%',
		height: '100%',
		backgroundColor: purple,
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		refreshControl: control
	});
		

mainContainerView.add(tableView);
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
	
	row.add(bubbleView);
	tableData.push(row);
	tableData.push(bottomPadding);
	tableView.setData(tableData);
});

//Event listener to create a card for a conversation.  These views persist for the lifespan of its conversation
Ti.App.addEventListener('app:createcard', function(e)
{
	var conversationCard = new convoCard(win, e, mainContainerView.size.height);
	conversationCard.open();
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
//win.add(testButton2);


testButton2.addEventListener('click', function(e){
	Ti.App.fireEvent('app:refresh');
});


///////// end test buttons   //////////////	
	

	
return win;
}

module.exports = MainWindow;	
	
					

	


