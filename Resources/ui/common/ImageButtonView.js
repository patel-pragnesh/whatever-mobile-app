exports.create = function(args, callback)
	{
	var config = require('config');
	
	var imageButtonView = Ti.UI.createView(args.button);
		
	var buttonInnerView = Ti.UI.createView({
		right: 10,
		left: 10,
		height: Ti.UI.SIZE
		});
		
	var buttonCenterView = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		layout: 'horizontal',
		touchEnabled: false
		});
		
	var labelPositionLeft = 0;
	
	if(args.image)
		{
		var buttomImageView = Ti.UI.createImageView({
			image: args.image.image,
			width: args.image.width,
			height: args.image.height
			});
			
		buttonCenterView.add(buttomImageView);
		
		labelPositionLeft = 5;
		}
		
	var buttonLabel = Ti.UI.createLabel({
		color: args.color,
		font: args.font,
		left: labelPositionLeft,
		text: args.text
		});
		
	buttonCenterView.add(buttonLabel);
	buttonInnerView.add(buttonCenterView);
	imageButtonView.add(buttonInnerView);
	
	function animateClick()
		{
		imageButtonView.animate({backgroundColor: args.button.backgroundSelectedColor, autoreverse: true, duration: 100}, callback);
		}
	
	imageButtonView.addEventListener('click', animateClick);
	
	return imageButtonView;
	};