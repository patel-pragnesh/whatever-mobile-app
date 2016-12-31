/**
 * View that shows when a user is clicked
 */



function UserProfileWindow(userId)
{
	var config = require('config');
	var account = Ti.App.properties.getObject('account');
	var httpClient = require('lib/HttpClient');
	var account = Ti.App.Properties.getObject("account");
	var NotificationView = require('ui/common/NotificationView');
	var userUtil = require('lib/UserUtil');
	
	
	var profileWindow = Ti.UI.createWindow({
		height: '100%',
		width: '100%'
	});
	
	// The notification view has a zIndex that blocks the UI and provides an indicator
	var notificationView = require('ui/common/NotificationView').create();
	
	var shadeView = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		backgroundColor: 'black',
		opacity: 0.6
	});
		
	profileWindow.add(shadeView);
	
	var view = Ti.UI.createView({
		height: '85%',
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 20,
		borderColor: 'gray',
		borderWidth: 1,
		layout: 'vertical'
	});
		view.addEventListener('swipe', close);
	
	profileWindow.add(view);
	
		var closeButton = Ti.UI.createLabel({
			top: '1%',
			right: '6%',
			height: '6%',
			width: Ti.UI.SIZE,
			text: 'close',
			font: {fontFamily: config.avenir_next_light,
					fontSize: 15}
		});
			closeButton.addEventListener('click', close);
		view.add(closeButton);
	
		var pictureView = Ti.UI.createImageView({
			top: '6%',
			height: "35%",
			autorotate: false,
			backgroundColor: '#D3D3D3',
			borderWidth: 3,
			borderColor: config.purple
		});
		
			pictureView.addEventListener('postlayout', function(e){
				pictureView.setWidth(pictureView.size.height);
				pictureView.setBorderRadius(pictureView.size.height / 2);
				
				
				httpClient.doMediaGet('/v1/media/' + userId + '/PROFILE/profilepic.jpeg', function(success, response){
					if(success)
					{
						pictureView.setImage(Ti.Utils.base64decode(response));
					}
				});
			});
		
	view.add(pictureView);
	
		var nameLabel = Ti.UI.createLabel({
			font: {fontFamily: 'AvenirNext-DemiBold',
					fontSize: 25},
			top: "1.5%",
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			opacity: 0.0
		});
	
		var request = {userId: userId};
		
		httpClient.doPost('/v1/getUser', request, function(success, response){
			if (success)
			{
				nameLabel.setText(response.firstName + " " + response.lastName);
				nameLabel.animate({opacity: 0.8, duration: 200});
			}
		});
		
	view.add(nameLabel);
	
	
	var buttons = Ti.UI.createView({
		top: '4%',
		bottom: '5%',
		width: '75%',
		layout: 'vertical'
	});
		
		var addToFriends = Ti.UI.createButton({
			width: Ti.UI.FILL,
			top: 0,
			height: '20%',
			title: 'Add to Friends List',
			font: {fontFamily: 'AvenirNext-DemiBold',
					fontSize: 20},
			color: config.purple
		});
		buttons.add(addToFriends);
		
			addToFriends.addEventListener('click', function(){
				var friendshipReq = {
					friender: account.id,
					friendee: userId 
				};
				httpClient.doPost('/v1/createfriendship', friendshipReq, function(success, response){
					if(success){
						Ti.API.info('success friendship');
					}
				});
			});
		
		var callButton = Ti.UI.createButton({
			width: Ti.UI.FILL,
			top: '5%',
			height: '20%',
			title: 'Call',
			font: {fontFamily: 'AvenirNext-DemiBold',
					fontSize: 20},
			color: config.purple
		});
		buttons.add(callButton);
		
			callButton.addEventListener('click', function(){
				Ti.Platform.openURL('tel:' + userId);
			});
		
		var textButton = Ti.UI.createButton({
			width: Ti.UI.FILL,
			top: '5%',
			height: '20%',
			title: 'Text',
			font: {fontFamily: 'AvenirNext-DemiBold',
					fontSize: 20},
			color: config.purple
		});
		buttons.add(textButton);
		
		textButton.addEventListener('click', function(){
				Ti.Platform.openURL('sms://' + userId);
		});		
		
		var blockButton = Ti.UI.createButton({
			width: Ti.UI.FILL,
			top: '5%',
			height: '20%',
			title: 'Block',
			font: {fontFamily: 'AvenirNext-DemiBold',
					fontSize: 20},
			color: config.red
		});
		buttons.add(blockButton);
		
		function blockButtonClick(){
			blockButton.removeEventListener('click', blockButtonClick);
			
			var dialog = Ti.UI.createAlertDialog({
				title: 'Are you sure?',
				message: "Are you sure you want to block this user?  This can't be undone.",
				cancel: 0,
				buttonNames: ['Cancel', 'Block'],
				destructive: 1
			});
			
			dialog.addEventListener('click', function(e){
				if(e.index === e.source.cancel){
					Ti.API.info('canceled');
					blockButton.addEventListener('click', blockButtonClick);
				}else if(e.index == 1){
					
					notificationView.showIndicator();
					
					var blockReq = {
							blocker: account.id,
							blockee: userId
						};
						
						httpClient.doPost('/v1/blockUser', blockReq, function(success, response){
								if(success){
									Ti.API.info('blocked:   ' + JSON.stringify(response));
									
									account.blockList = response.blockList;
									Ti.App.Properties.setObject('account', account);
									
									Ti.App.fireEvent('app:reactToBlock', {blockee: response.blockee});
									Ti.App.fireEvent('app:refresh');
									
									profileWindow.close();
								}else{
									alert('error');
								}
								notificationView.hideIndicator();
					});
				}
			});
			
			dialog.show();
			
			
		}
		
		if(userUtil.checkIfBlockedUser(userId)){
			blockButton.setColor('gray');
			blockButton.setTitle('Blocked');
		}else{
			blockButton.addEventListener('click', blockButtonClick);
		}
				
			
	view.add(buttons);
	
	
	function close(){
		profileWindow.setTouchEnabled(false);
		profileWindow.animate({duration: 250, opacity: 0.0}, function(){
			profileWindow.close();
		});
	}
	
	profileWindow.add(notificationView);
	
	return profileWindow;
	
}

module.exports = UserProfileWindow;