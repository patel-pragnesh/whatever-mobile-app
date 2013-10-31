function ZoomCropWindow(image, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');
	var NotificationView = require('whateverapp/ui/common/NotificationView');
	//var accountClient = require('whateverapp/client/AccountClient');
	
	// Set the original mime type
	var mimeType = image.mimeType;
	
	//Set black frame
	var win = Ti.UI.createWindow({
		backgroundColor: 'black',
		height: '100%',
		width: '100%',
		orientationModes: [Ti.UI.PORTRAIT],
		layout:'vertical'
		});
		
	if(config.platform === 'android')
		{
		win.fullscreen = false;
		win.navBarHidden = true;
		}
	else
		{
		win.borderRadius = 5;
		}
		
	var mainContainer = Ti.UI.createView({
		height: '100%',
		width: '100%',
		zIndex: 1
		});
		
	var notifications = NotificationView.create();
		
		
	var cancelButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: 'black',
		backgroundColor: 'gray',
		left: 5, top: 5,
		width: 40, height: 40,
		title: 'X',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius: 0,
		borderColor: 'white'
	});
	cancelButton.addEventListener('click',function()
			{
			callback(false);
			notifications.hideIndicator();
			win.close();
			});
	
	var doneButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: 'black',
		backgroundColor: 'gray',
		left: '80%', top: 5,
		width: 40, height: 40,
		title: 'Done',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius: 0,
		borderColor: 'white'
	});
	
	win.add(cancelButton);
	win.add(doneButton);
	
	
	var scale = 1.0; // The scale of the image initialized
	var imageViewPortSize = 300;
	var imageView;
	
		
	var scaleSize = imageViewPortSize + 40;

		
	if(image.height >= image.width && image.height > scaleSize)
		{
		scale = scaleSize / image.width;
		}
	else if(image.width > scaleSize)
		{
		scale = scaleSize / image.height;
		}
		
		
	var xWidth = image.width * scale;
	var yHeight = image.height * scale;
	

	
	var scrollView = Ti.UI.createScrollView({
		backgroundColor: 'black',
		borderWidth: 1,
		borderColor: 'white',
		showVerticalScrollIndicator: false,
		showHorizontalScrollIndicator: false,
		width: imageViewPortSize,
		height: imageViewPortSize,
		contentHeight: Ti.UI.SIZE,
		contentWidth: Ti.UI.SIZE,
		});
		
	if(config.platform !== 'android')
		{
		scrollView.disableBounce = true;
		scrollView.minZoomScale = 1;
		
		if(image.height >= image.width && image.height > imageViewPortSize)
			{
			zoomScale = image.height / imageViewPortSize;
			}
		else if(image.width > imageViewPortSize)
			{
			zoomScale = image.width / imageViewPortSize;
			}
		
		scrollView.maxZoomScale = zoomScale;
		}
	
	if(config.platform === 'android')
		{
		var photoView = require('com.mywebrank.photoview');

		var photoImageView = photoView.createPhotoView({
			backgroundColor: 'transparent',
			width: xWidth,
			height: yHeight,
			images: [image]
			});
		
		
			
		// Place the photo image view into a view
		// Do this because if we use the scrollview for the image, we get the edge effects of the scrollview
		imageView = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE
			});
			
		imageView.add(photoImageView);
		}
	else
		{
		imageView = Ti.UI.createImageView({
			image: image,
			width: xWidth,
			height: yHeight
			});
		}
	
	scrollView.add(imageView);
		
	var xScroll = ((image.width - xWidth) / 2) + (xWidth > imageViewPortSize ? (xWidth - imageViewPortSize) / 2 : 0);
	var yScroll = ((image.height - yHeight) / 2) + (yHeight > imageViewPortSize ? (yHeight - imageViewPortSize) / 2 : 0);
	
	
	scrollView.scrollTo(xScroll, yScroll);

	mainContainer.add(scrollView);
	
	
	if(1==1)
		{
		doneButton.addEventListener('click', sendImageBack)
		
		function sendImageBack()
			{
		
				
			doneButton.removeEventListener('click', sendImageBack)

			var currentImageWidth = image.width * scale;
			var currentImageHeight = image.height * scale;
			
			if(currentImageWidth >= imageViewPortSize && currentImageHeight >= imageViewPortSize)
				{
				notifications.showIndicator();
				
				var imageBlob;
				var cropImage;
				
				if(config.platform === 'android')
					{
					cropImage = Ti.UI.createImageView({
						image: imageView.toImage()
						});
					}
				else
					{
					cropImage = Ti.UI.createImageView({
						image: scrollView.toImage()
						});
					}
				
				
				imageBlob = cropImage.toBlob().imageAsResized(300,300);

				
				var mediaDialog = Ti.UI.createAlertDialog(
					{
					title: 'Like this Picture?',
					message: 'I like this Picture',
					buttonNames: ['Yes', 'No']
					});
					
				mediaDialog.show();
					
				mediaDialog.addEventListener('click', function(e)
					{
					if(e.index == 0)
						{
						var request = {
							mimeType: mimeType,
							image: imageBlob
							};
							//TODO: Send new profile image to server
							/*
						accountClient.updateProfileImage(whatever.getAccount().id, request, function(success)
							{
							if(success)
								{
								callback(true, imageBlob);
								
								Ti.App.fireEvent('completeRefreshPlayView');
								
								notifications.hideIndicator();
								win.close();
								}
							else
								{
								notifications.hideIndicator();
								whatever.errorHandler(null, L('profile_image_upload_error'));
								}
							});*/
							
						
						var callBackImage;
						
						
						callBackImage = 
						{
							image:imageBlob
						}
						
							
						callback(true, callBackImage);								
						notifications.hideIndicator();
						win.close();
						}
					else
						{
						callback(false);
						notifications.hideIndicator();
						win.close();
						}
					});
				}
			else
				{
				alert(L('profile_image_size_larger'));
				}
			}
		}
	
	win.add(mainContainer);
	win.add(notifications);
	
	return win;
	};
		
module.exports = ZoomCropWindow;