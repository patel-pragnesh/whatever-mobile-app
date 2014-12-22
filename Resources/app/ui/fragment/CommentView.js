exports.create = function(comment)
	{
	var config = require('app/config');
		
	var commentContainerView = Ti.UI.createView({
		backgroundColor: '#F6F6F6',
		width: '100%',
		height: Ti.UI.SIZE,
		layout: 'vertical'
		});
		
	var commentTopDecoratorView = Ti.UI.createView({
		backgroundColor: '#BFBFBF',
		width: '100%',
		top: 0,
		height: 1
		});
		
	commentContainerView.add(commentTopDecoratorView);
	
	var commentProfileView = Ti.UI.createView({
		width: '100%',
		top: 0,
		height: 60
		});
		
	var commentProfileImageViewContainer = Ti.UI.createView({
		backgroundColor: 'white',
		top: 10,
		width: 40,
		height: 40,
		left: 10
		});
		
	var commentProfileImageNameLabel = Ti.UI.createLabel({
		color: '#999999',
		font:
			{
			fontSize: 18,
			fontFamily: config.opensans_light
			},
		text: 'ES'
		});
		
	commentProfileImageViewContainer.add(commentProfileImageNameLabel);
	commentProfileView.add(commentProfileImageViewContainer);
	
	var commentatorView = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		layout: 'horizontal'
		});
		
	var commentatorNameLabel = Ti.UI.createLabel({
		color: '#333333',
		font:
			{
			fontSize: 14,
			fontFamily: config.opensans_semibold
			},
		left: 60,
		right: 10,
		text: 'Eric Schmidt'
		});
		
	// No wrap with ellipsize if name is too long
	if(config.platform === config.platform_android)
		{
		commentatorNameLabel.wordWrap = false;
		commentatorNameLabel.ellipsize = true;
		}
	else
		{
		commentatorNameLabel.minimumFontSize = 14;
		}
		
	commentatorView.add(commentatorNameLabel);
	
	var commentTimeLabel = Ti.UI.createLabel({
		color: '#666666',
		font:
			{
			fontSize: 11,
			fontFamily: config.opensans_light
			},
		left: 60,
		right: 10,
		text: 'Yesterday at 12:37 pm'
		});
		
	commentatorView.add(commentTimeLabel);
	commentProfileView.add(commentatorView);
	commentContainerView.add(commentProfileView);
	
	var commentLabel = Ti.UI.createLabel({
		color: '#333333',
		font:
			{
			fontSize: 12,
			fontFamily: config.opensans_regular
			},
		left: 10,
		right: 10,
		text: 'Well I believe that this is my comment and that is what I think. So I am writing this comment to make a comment.'
		});
		
	commentContainerView.add(commentLabel);
	
	var commentShim = Ti.UI.createView({
		width: '100%',
		height: 10
		});
		
	commentContainerView.add(commentShim);
	
	return commentContainerView;
	};