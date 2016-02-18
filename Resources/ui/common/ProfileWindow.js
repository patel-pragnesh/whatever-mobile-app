/**
 * View that shows when a user is clicked
 */



function ProfileWindow()
{
	var config = require('config');
	var account = Ti.App.properties.getObject('account');
	var camera = require('ui/common/ProfileCamera');
	var gallery = require('ui/common/AccessGallery');
	
	var profileWindow = Ti.UI.createWindow({
		height: '100%',
		width: '100%'
	});
	
	
	var shadeView = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		backgroundColor: 'black',
		opacity: 0.5
	});
	profileWindow.add(shadeView);
	
	var view = Ti.UI.createView({
		height: '85%',
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 40,
		layout: 'vertical'
	});
	profileWindow.add(view);
	
	view.addEventListener('swipe', function(e){
		profileWindow.setTouchEnabled(false);
		profileWindow.animate({duration: 250, opacity: 0.0}, function(){
			profileWindow.close();
		});
	});
	
		var pictureView = Ti.UI.createView({
			top: '10%',
			height: '40%',
			width: '100%'
		});
		view.add(pictureView);
	
	return profileWindow;
	
}

module.exports = ProfileWindow;