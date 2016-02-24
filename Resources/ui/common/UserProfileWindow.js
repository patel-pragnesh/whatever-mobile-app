/**
 * View that shows when a user is clicked
 */



function UserProfileWindow(userId)
{
	var config = require('config');
	var account = Ti.App.properties.getObject('account');
	var httpClient = require('lib/HttpClient');
	
	
	var profileWindow = Ti.UI.createWindow({
		height: '100%',
		width: '100%'
	});
	
	
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
		borderRadius: 40,
		borderColor: 'gray',
		borderWidth: 1,
		layout: 'vertical'
	});
		view.addEventListener('swipe', close);
	
	profileWindow.add(view);
	
		var pictureView = Ti.UI.createImageView({
			top: '6%',
			height: "45%",
			autorotate: false,
			backgroundColor: '#D3D3D3',
			borderWidth: 3,
			borderColor: config.purple,
			opacity: 0.0
		});
		
		
			pictureView.addEventListener('postlayout', function(e){
				pictureView.setWidth(pictureView.size.height);
				pictureView.setBorderRadius(pictureView.size.height / 2);
				
				
				httpClient.doMediaGet('/v1/media/' + userId + '/PROFILE/profilepic.jpeg', function(success, response){
					if(success)
					{
						pictureView.setImage(Ti.Utils.base64decode(response));
						pictureView.animate({opacity: 1.0, duration: 200});
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
	
	
	function close(){
		profileWindow.setTouchEnabled(false);
		profileWindow.animate({duration: 250, opacity: 0.0}, function(){
			profileWindow.close();
		});
	}
	
	return profileWindow;
	
}

module.exports = UserProfileWindow;