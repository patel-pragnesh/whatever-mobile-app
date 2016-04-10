/**
 * The card window
 * 
 * @param {Object} args
 * @param {Object} callback
 */

var config = require('config');
var encoder = require('lib/EncoderUtility');
var httpClient = require('lib/HttpClient');
var account = Ti.App.properties.getObject('account');


exports.buildComment = function(containerWidth, containerHeight, commentObject)
{
	var commentorImageSize = containerWidth * .101;
	var commentorImageRadius = commentorImageSize / 2;
	var nameFontSize = containerWidth * .035;
	var timeFontSize = containerWidth * .03;
	var bodyFontSize = containerWidth * .04;

		var commentView = Ti.UI.createView({
			width: '100%',
			height: Ti.UI.SIZE,
			top: 7,
			layout: 'horizontal',
			//horizontalWrap: false
			});
		
			var commentImage = Ti.UI.createImageView({
				backgroundColor: '#D3D3D3',
				height: commentorImageSize,
				top: 3,
				left: '2%'
				});
				
				commentImage.addEventListener('postlayout', function(){
					commentImage.setWidth(commentImage.size.height);
					commentImage.setBorderRadius(commentImage.size.height / 2);
					getProfile();
				});
				
				Ti.App.addEventListener('updateProfilePicture', getProfile);
				
				function getProfile(){
					Ti.API.info(commentObject.userId + "  " + account.id + "  " + config.profileFile.exists());
					if(commentObject.userId == account.id && config.profileFile.exists())
					{
						Ti.API.info('load local profile pic');
						commentImage.setImage(config.profileFile.read());
					}else if (commentObject.userId != account.id  && !commentImage.getImage()){
						httpClient.doMediaGet('/v1/media/' + commentObject.userId + '/PROFILE/profilepic.jpeg', function(success, response){
							if(success){
								commentImage.setImage(Ti.Utils.base64decode(response));
							}else{
								Ti.App.addEventListener('app:refresh', function(){
									this.removeEventListener('app:refresh', arguments.callee);
									getProfile();
								});
							}
						});
					}
				}
		commentView.add(commentImage);
				
			var commentContent = Ti.UI.createView({
				top: 4,
				width: '70%',
				height: Ti.UI.SIZE,
				left: '3%',
				layout: 'vertical',
			});
			commentView.add(commentContent);
				
				var nameLabel = Ti.UI.createLabel({
					left: 0,
					top: -2,
					color: '#666666',
					font: {fontSize: nameFontSize,
							   fontFamily: 'AvenirNext-Medium'},
					zIndex: 2,
					text: commentObject.userFirstName + ' ' + commentObject.userLastName
					});
					commentContent.add(nameLabel);
				
				var commentText = Ti.UI.createTextArea({
					left: -5,
					top: -10,
					right: 2,
					font: {fontSize: bodyFontSize,
							   fontFamily: 'AvenirNext-Regular'},		
					value: encoder.decode_utf8(commentObject.comment),
					editable: false,
					color: 'black',
					backgroundColor: '#F7F5FA',
					touchEnabled: false
					});
					commentContent.add(commentText);
				
				var timeLabel = Ti.UI.createLabel({
					
					left: 0,
					top: -4,
					text: '24 minutes ago',
					font: {fontSize: timeFontSize,
							   fontFamily: 'AvenirNext-Light'},
					color: 'gray'
					});
					//commentContent.add(timeLabel);
			
	commentView.add(new LikeButton());
	
	return commentView;
};

exports.buildUserStatus = function(containerWidth, containerHeight, commentObject)
{
	var nameFontSize = containerWidth * .035;
	var timeFontSize = containerWidth * .03;
	var bodyFontSize = containerWidth * .04;
	
	var userStatusView = Ti.UI.createView({
		top: 10,
		bottom: 10,
		//right: '2%',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		layout: 'horizontal'
	});
	
		var inlineImage = Ti.UI.createImageView({
			image: '/images/greenCheckMarkForImInButtonNotClicked',
			height: 12,
			left: 0
		});
		userStatusView.add(inlineImage);
		
		var inlineLabel = Ti.UI.createLabel({
			text: commentObject.userFirstName + " " + commentObject.userLastName + " " + commentObject.comment + ".",
			font: {font: 'AvenirNext-Regular',
					fontSize: nameFontSize},
			left: 4,
			color: 'black'
		});
		userStatusView.add(inlineLabel);
		
		
	return userStatusView;
};

function LikeButton()
{
	var buttonView = Ti.UI.createImageView({
		width: '5.5%',
		top: 15,
		left: '4.25%',
		image: 'images/thumbsUpOutline',
		zIndex: 20
	});
	
		buttonView.addEventListener('click', function(){
			buttonView.setImage('images/thumbsUpPurple');
		});
	
	return buttonView;
}

	
	
	
	
