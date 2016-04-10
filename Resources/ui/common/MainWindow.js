
function MainWindow() {
	
	var config = require('config');
	var context = require('context');
	
	var moment = require('lib/Moment');
	var _ = require('lib/Underscore');
	var httpClient = require('lib/HttpClient');
	
	var bubblesView = require('ui/common/BubblesView');
	var startConvoCard = require('ui/common/StartConvoCard');
	var convoCard = require('ui/common/ConvoCard');
	var localUserProfileWindow = require('ui/common/LocalUserProfileWindow');
	
	var purple = config.purple;
	var account = Ti.App.properties.getObject('account');
	
	var topNavHeight;
	var mainViewTop;
	
	// Monitor silent push notifications
	Ti.App.iOS.addEventListener('silentpush', function(e){
		Ti.API.info(JSON.stringify(e));
		Ti.App.fireEvent('app:refresh');
		
		var notifyDate = moment();
			notifyDate.add(10, "s");
			
		Ti.App.iOS.scheduleLocalNotification({
			alertBody: "Local Notification",
			date: new Date(notifyDate.valueOf())
		});
		
		setTimeout(function(){
			Ti.App.iOS.endBackgroundHandler(e.handlerId);
			Ti.API.info('background ended');
		}, 10000);	
	});
	
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
			top: 70,
			bottom: 0,
			layout: 'absolute',	
			backgroundColor: 'green'
	});	
	
		
	//create top nav view to hold logo and user profile 
	
	var topNavView = Ti.UI.createView
	({
		top: 20,
		height: 50,
		width: '100%'
	});

	//avoid overclick when touching close icon on cardView
	Ti.App.addEventListener('app:cardRaised', function(e){
		if(e.raised)
		{
			topNavView.setTouchEnabled(false);
		}else{
			topNavView.setTouchEnabled(true);
		}
	});

		//Add Whatever label upper-left and profile image and name button.  
	    var labelView = Ti.UI.createImageView
	    ({
			height: '60.41%',
			left: 12,
			image: "/images/whateverlabel",
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
				height: '95%',
				backgroundColor: '#D3D3D3',
				borderWidth: 1,
				borderColor: 'white',
				opacity: 0.0
			});
			
				profilePicture.addEventListener('postlayout', function(){
					profilePicture.setWidth(profilePicture.size.height);
					getProfile();
					profilePicture.setOpacity(1.0);
				});
				
				Ti.App.addEventListener('updateProfilePicture', getProfile);
				
				function getProfile(){
					if (config.profileFile.exists())
					{
						profilePicture.setImage(config.profileFile.read());
					}
				}
			
			var userNameLabel = Ti.UI.createLabel({
				right: 0,
				left: 10,
				height: Ti.UI.FILL,
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
		
		profileView.addEventListener('click', function(e){
			profileWin = new localUserProfileWindow();
			profileWin.open();
		});
			
	//Add Whatever button and make it dissapear when scrolling
    var whateverButton = Ti.UI.createImageView
    ({
		image: "/images/BTN",
		width: '21%',
		bottom: '5%'
	});
	
		Ti.Accelerometer.addEventListener('update', accelerometerCallback);
		
		Ti.App.addEventListener('pause', function(){
			Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
		});
		Ti.App.addEventListener('paused', function(){
			Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
		});
		
		Ti.App.addEventListener('resume', function(){
			Ti.Accelerometer.addEventListener('update', accelerometerCallback);
		});
		Ti.App.addEventListener('resumed', function(){
			Ti.Accelerometer.addEventListener('update', accelerometerCallback);
		});
		
		function accelerometerCallback(e)
		{
			y = (e.y * 6) * -1;
			x = e.x * 6;
			whateverButton.setViewShadowOffset({x: x ,y: y});
		}
		
		whateverButton.addEventListener('postlayout', function(){
			this.setBorderRadius(whateverButton.size.width / 2);
			this.setViewShadowColor('#2f2f2f');
			this.setViewShadowOffset({x:2, y:3});
		});
		
	
		var friends = [];
		//friends.push({firstName: 'Joe', lastName: 'McMahon', userId: '206'});
		//friends.push({firstName: 'Cole', lastName: 'Halverson', userId: '406'});
		
		getFriends();
		Ti.App.addEventListener('app:refresh', getFriends);
		
		function getFriends(){
			var req = {userId: account.id};
			
			httpClient.doPost('/v1/getFriendships', req, function(success, response){
				if(success)
				{
					friends = response;
				}
			});
		}
	
	    //whatever button click event creates StartConvoCard view
		whateverButton.addEventListener('click', function(e)
		{
			whateverButton.setTouchEnabled(false);
			
			var startCard = new startConvoCard(win, mainContainerView.size.height, friends);
			win.add(startCard);
			startCard.animate({top: '5%', duration: 250});
			Ti.App.fireEvent('app:cardRaised', {raised: true});			
			whateverButton.setTouchEnabled(true);
		});	

	
	var tableData = [];
	
	var row = Ti.UI.createTableViewRow({
		backgroundColor: purple,
		height: Ti.UI.SIZE,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE, 
	});
	tableData.push(row);
	var bottomPadding = Ti.UI.createTableViewRow({
		width: '100%',
		height: 150,
		backgroundColor: purple,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	tableData.push(bottomPadding);
		row.addEventListener('postlayout', function(e){
			
			if(row.size.height > 1500)
			{
				tableView.setShowVerticalScrollIndicator(true);
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
			}else{
				tableView.setShowVerticalScrollIndicator(false);
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
		refreshControl: control,
		showVerticalScrollIndicator: false
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
	tableView.setData(tableData);
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
	
	Ti.API.info('remote notify enabled  = ' + JSON.stringify(Titanium.Network.getRemoteNotificationsEnabled()));
	Ti.API.info('notify types = ' + JSON.stringify(Ti.Network.getRemoteNotificationTypes()));
	Ti.API.info('uuid  =  ' + Ti.Network.getRemoteDeviceUUID());
	Ti.API.info(Titanium.App.iOS.getCurrentUserNotificationSettings());
	
	var req = {};
	req.message = "Hello World";
	req.payload = {};
	req.payload ["event"] = "payload event";
	req.user_ids = ["14066974685"];
	req.callback = "receivePush";
	
	
	httpClient.doPost('/v1/sendPushNotification', req, function(success, response){
		Ti.API.info(JSON.stringify(response));
	});
});


///////// end test buttons   //////////////	
	

	
return win;
}

module.exports = MainWindow;	
	
					

	


