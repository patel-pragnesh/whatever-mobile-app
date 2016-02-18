
function ProfileCamera()
{
	
	var overlay = Ti.UI.createView();
	
		var overlayImage = Ti.UI.createImageView({
			image: 'images/cameraMask',
			height: Ti.UI.FILL
		});
		overlay.add(overlayImage);
		
		var buttons = Ti.UI.createButtonBar({
			labels: ['Cancel', 'Take', 'Switch'],
			bottom: 0,
			height: '10%',
			width: Ti.UI.FILL,
			borderColor: 'white',
			tintColor: 'white'	
		});
		overlay.add(buttons);
		
			buttons.addEventListener('click', function(e){
				if (e.index == 0){
					Titanium.Media.hideCamera();
				}else if (e.index == 1){
					Titanium.Media.takePicture();
				}else if (e.index == 2){
					if (Ti.Media.camera == Ti.Media.CAMERA_FRONT){
						 Ti.Media.switchCamera(Ti.Media.CAMERA_REAR);
					}else{
						Ti.Media.switchCamera(Ti.Media.CAMERA_FRONT);
					}
				}
			});
	
	Titanium.Media.showCamera({
		success: function(e){Titanium.Media.hideCamera();},
		cancel: function(){},
		error: function (error){},
		overlay: overlay,
		showControls: false,
		autohide: false,
		autorotate: false,
		animated: false
	});
	
}

module.exports = ProfileCamera;