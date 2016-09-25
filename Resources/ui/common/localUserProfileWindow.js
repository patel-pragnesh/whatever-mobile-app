/**
 * View that shows when a user is clicked
 */



function LocalUserProfileWindow()
{
	var config = require('config');
	var account = Ti.App.properties.getObject('account');
	var camera = require('ui/common/ProfileCamera');
	var gallery = require('ui/common/AccessGallery');
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
		borderRadius: 20,
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
				if (config.profileFile.exists()){pictureView.setImage(config.profileFile.read());}
				pictureView.animate({opacity: 1.0, duration: 200});
			});
			
			pictureView.addEventListener('click', function(e){
				var dialog = Ti.UI.createOptionDialog({
					cancel: 2,
					options: ['From Camera', 'From Photos', 'Cancel'],
					title: 'Add Profile Picture'
				});
				dialog.show();
				
				dialog.addEventListener('click', function(e){
					if (e.index == 0){
						camera(function(media){
							handleImage(media);
						});
					}else if(e.index == 1){
						gallery(function(media){
							handleImage(media);
						});
					}
				});
			});
	view.add(pictureView);
	
	
		var actionsView = Ti.UI.createView({
			width: '100%',
			height: Ti.UI.SIZE,
			top: 3,
			layout: 'vertical'
		});
		
			var tapLabel = Ti.UI.createLabel({
				font: {fontFamily: 'AvenirNext-UltraLight',
						fontSize: 12},
				color: 'black',
				text: 'Tap to change',
				top: 0,
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE
			});
			
				tapLabel.addEventListener('click', function(e){pictureView.fireEvent('click');});
		
		actionsView.add(tapLabel);
			
			var uploadButton = Ti.UI.createButton({
			height: 60,
			width: '40%',
			title: 'Looks good!',
			top: 5,
			backgroundColor: 'white',
			borderColor: config.purple,
			borderWidth: 1,
			borderRadius: 10,
			color: config.purple,
			font: {fontFamily: 'AvenirNext-Medium',
					fontSize: 18},
			opacity: 0.0
		});
			
	view.add(actionsView);
	
		var nameLabel = Ti.UI.createLabel({
			font: {fontFamily: 'AvenirNext-DemiBold',
					fontSize: 25},
			text: account.first_name + ' ' + account.last_name,
			top: "1.5%",
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			opacity: 0.8
		});
	view.add(nameLabel);

	var actionsViewExpanded = false;
	
	function handleImage(media)
	{
		var image = media;
		var w = image.width;
		var h = image.height;
		
		Ti.API.info('ratio = ' + (w / h));
		//reduce the image  -- shooting for a 400 x 400 pixel square after crop
		var factor = 0;
		
		if (w > h){
			factor = (300 / h).toFixed(2);
		}else{
			factor = (300 / w).toFixed(2);
		}
		
		Ti.API.info(factor);
		image = image.imageAsResized((w * factor),(h * factor));
		
		Ti.API.info('ratio = ' + image.width + '  ' + image.height);
		
		//crop image to square	
			
		if (w > h){
			Ti.API.info('wide');
			image = image.imageAsCropped({
				width: image.height
			});
		}else if (h > w){	
				Ti.API.info('tall');
			image = image.imageAsCropped({
				height: image.width
			});			
		}
				
		pictureView.setImage(image);
		Ti.API.info(image.getWidth() + "  " + image.getHeight());
		
		
		
		if (!actionsViewExpanded)
		{
			var actionsViewHeight = actionsView.size.height;
		
			uploadButton.addEventListener('click', function(){
				uploadButton.removeEventListener('click', arguments.callee);
				uploadButton.setTouchEnabled(false);
				upload();
				uploadButton.setColor('white');
				uploadButton.setBackgroundColor(config.purple);
				//save to local file
				config.profileFile.write(image);
				Ti.App.fireEvent('updateProfilePicture');
				var timer = setTimeout(function(){
					uploadButton.animate({opacity: 0.0, duration: 200}, function(){
						actionsView.remove(uploadButton);
						uploadButton.setBackgroundColor('white');
						uploadButton.setColor(config.purple);
						uploadButton.setTouchEnabled(true);
						actionsView.animate({height: actionsViewHeight, duration: 200});
					});
				}, 1500);
				
				
			});
			actionsView.add(uploadButton);
			actionsView.animate({height: actionsViewHeight + uploadButton.getHeight() + 5, duration: 200});
			uploadButton.animate({opacity: 1.0, duration: 200});
			
			actionsViewExpanded = true;
		}
		
		
		function upload()
		{
			var req = {};
				req.userId = account.id;
				req.mediaFileType = "PROFILE";
				req.filename = 'profilepic.jpeg';
										
				var fileString = Titanium.Utils.base64encode(image).toString();	
				var bytes = [];
										
				for (var i = 0; i < fileString.length; i++)
				{
					bytes.push(fileString.charCodeAt(i));
				}
				req.file = bytes;
										
			httpClient.doPost('/v1/media/', req, function(success, response){
					Ti.API.info(JSON.stringify(response));
			});		
		}
		
	}
	
	
	
	
	function close(){
		profileWindow.setTouchEnabled(false);
		profileWindow.animate({duration: 250, opacity: 0.0}, function(){
			profileWindow.close();
		});
	}
	
	return profileWindow;
	
}

module.exports = LocalUserProfileWindow;