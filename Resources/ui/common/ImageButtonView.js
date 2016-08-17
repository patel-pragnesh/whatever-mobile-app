exports.create = function(args, callback)
	{
	var config = require('config');
	
	var imageButtonView = Ti.UI.createImageView(args.button);
	
	function animateClick()
		{
		imageButtonView.animate({backgroundColor: args.button.backgroundSelectedColor, autoreverse: true, duration: 100}, callback);
		}
	
	imageButtonView.addEventListener('click', animateClick);
	
	return imageButtonView;
	};