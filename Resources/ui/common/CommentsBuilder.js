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
			layout: 'horizontal'
			});
		
			var commentImage = Ti.UI.createImageView({
				backgroundColor: '#D3D3D3',
				height: commentorImageSize,
				top: 3,
				left: '3%'
				});
				
				commentImage.addEventListener('postlayout', function(){
					commentImage.setWidth(commentImage.size.height);
					commentImage.setBorderRadius(commentImage.size.height / 2);
					getProfile();
				});
				
				Ti.App.addEventListener('updateProfilePicture', getProfile);
				
				function getProfile(){
					if(commentObject.userId == account.id && config.profileFile.exists())
					{
						commentImage.setImage(config.profileFile.read());
					}else if (commentObject.userId != account.id){
						httpClient.doMediaGet('/v1/media/' + commentObject.userId + '/PROFILE/profilepic.jpeg', function(success, response){
							commentImage.setImage(Ti.Utils.base64decode(response));
						});
					}
				}
		commentView.add(commentImage);
				
	
			var commentContent = Ti.UI.createView({
				top: 4,
				right: '14%',
				height: Ti.UI.SIZE,
				left: '5%',
				layout: 'vertical',
			});
			commentView.add(commentContent);
				
				var nameLabel = Ti.UI.createLabel({
					left: 0,
					top: -2,
					color: '#666666',
					font: {fontSize: nameFontSize,
							   fontFamily: 'AvenirNext-Medium'},
					zIndex: 2
					});
					commentContent.add(nameLabel);
					
						var namePopulated = false;
						
						function getCreator()
						{
							var request = {userId: commentObject.userId};
							httpClient.doPost('/v1/getUser', request, function(success, response){
								if (success)
								{
									nameLabel.setText(response.firstName + " " + response.lastName);
									namePopulated = true;
								}
							});
						}
					getCreator();
				
				var commentText = Ti.UI.createTextArea({
					left: -5,
					top: -11,
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
					
//inlineNotificationStuff
/**
	var inline = Ti.UI.createView({
		top: 0,
		right: '2%',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		layout: 'horizontal',
		
		
	});
	commentsView.add(inline);

		var inlineLabel = Ti.UI.createLabel({
			text: 'Cole Halverson is in.',
			font: {font: 'OpenSans-Light',
					fontSize: timeFontSize
		},
			left: 4,
			color: 'black'
		});
		
		
		var inlineImage =Ti.UI.createImageView({
			image: '/images/greenCheckMarkForImInButtonNotClicked',
			height: 12,
			left: 0
			
		});
		inline.add(inlineImage);
		inline.add(inlineLabel);
	
*/
	
	
	return commentView;
	
};

	
	
	
	
