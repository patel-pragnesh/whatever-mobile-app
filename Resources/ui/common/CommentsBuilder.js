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
	var theComment = commentObject;
	
		
	var commentorImageSize = containerWidth * .101;
	var commentorImageRadius = commentorImageSize / 2;
	var nameFontSize = containerWidth * .035;
	var timeFontSize = containerWidth * .03;
	var bodyFontSize = containerWidth * .04;

	var commentHolderView = Ti.UI.createView({
		layout: 'vertical',
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		top: 3
	});
		var commentView = Ti.UI.createView({
			width: '100%',
			height: Ti.UI.SIZE,
			top: 0,
			layout: 'horizontal'
		});
		
		commentView.addEventListener('longpress', function(e){
			
			var hideDialog = Ti.UI.createOptionDialog({
					cancel: 1,
					options: ['Hide', 'Cancel'],
					destructive: 0,
					title: 'Hide Comment?'
				});
			
				hideDialog.addEventListener('click', function(e){
					if(e.index == 0){
						commentView.hide();
					}
				});
				
			hideDialog.show();
		});
		
			var commentImage = Ti.UI.createImageView({
				backgroundColor: '#D3D3D3',
				height: commentorImageSize,
				top: 7,
				left: '2%'
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
					}else if (commentObject.userId != account.id  && !commentImage.getImage()){
						httpClient.doMediaGet('/v1/media/' + commentObject.userId + '/PROFILE/profilepic.jpeg', function(success, response){
							if(success){
								commentImage.setImage(Ti.Utils.base64decode(response));
							}else{
								/*
								Ti.App.addEventListener('app:refresh', function(){
									this.removeEventListener('app:refresh', arguments.callee);
									getProfile();
								});*/
								
							}
						});
					}
				}
		commentView.add(commentImage);
				
			var commentContent = Ti.UI.createView({
				top: 8,
				width: '70%',
				height: Ti.UI.SIZE,
				left: '3%',
				layout: 'vertical',
			});
			
				
				var nameLabel = Ti.UI.createLabel({
					left: 0,
					top: -2,
					color: '#666666',
					font: {fontSize: nameFontSize,
							   fontFamily: config.avenir_next_medium},
					zIndex: 2,
					text: commentObject.userFirstName + ' ' + commentObject.userLastName
					});
					commentContent.add(nameLabel);
				
				var commentText = Ti.UI.createTextArea({
					left: -5,
					top: -10,
					right: 2,
					font: {fontSize: bodyFontSize,
							   fontFamily: config.avenir_next_regular},		
					value: encoder.decode_utf8(commentObject.comment),
					editable: false,
					color: 'black',
					//backgroundColor: '#F7F5FA',
					touchEnabled: false
					});
					commentContent.add(commentText);
				
				var timeLabel = Ti.UI.createLabel({
					
					left: 0,
					top: -4,
					text: '24 minutes ago',
					font: {fontSize: timeFontSize,
							   fontFamily: config.avenir_next_light},
					color: 'gray'
					});
					//commentContent.add(timeLabel);
					
			commentView.add(commentContent);
	
	if(commentObject.userId == account.id)
	{
		commentView.setBackgroundColor('#e4d9ee');
		commentText.setBackgroundColor('#e4d9ee');
	}
	
	commentHolderView.add(commentView);
	
	// Make sure this commentObject exists on the back-end before enabling likes functionality
	if(commentObject.commentId)
	{
		enableLikes();
	}
	
	//Called by ConvoCard after local user comment has been successfully created on the back-end to enable likes functionality
	commentHolderView.backendCallback = function(commentId)
	{
		commentObject.commentId = commentId;
		commentObject.likes = [];
		enableLikes();
	};
	
	function enableLikes()
	{
			var likeButtonView = Ti.UI.createImageView({
				width: '5.5%',
				top: 15,
				left: '4.25%',
				image: 'images/thumbsUpOutline',
				zIndex: 20,
				bubbleParent: false
			});
		
			likeButtonView.addEventListener('click', addLike);
			
			function addLike(e){
				var req = {};
					req.commentId = commentObject.commentId;
					req.userId = account.id;
				
				httpClient.doPost('/v1/addCommentLike', req, function(success, response){
					if(success)
					{
						likeButtonView.removeEventListener('click', addLike);
						Ti.App.fireEvent('app:refresh');
						
					}
				});
				
				likeButtonView.setImage('images/thumbsUpPurple');	
			}
		
		var likesLabel = Ti.UI.createLabel({
			left: 3,
			top: 25,
			font: {fontSize: nameFontSize,
					fontFamily: config.avenir_next_light},
			color: "#666666"
		});
		
		commentView.add(likeButtonView);
		commentView.add(likesLabel);
		
		
		
		//Listen for app event fire to update this comments likes
		
		Ti.App.addEventListener('app:commentLikes:' + commentObject.commentId, function(e)
		{
			theComment = e.commentObject;
			
			setLikeContext();
		});
		
		
		var likesList = Ti.UI.createView({
					layout: 'horizontal',
					right: 15,
					height: 0,
					width: Ti.UI.SIZE,
					top: 0
		});
		
		//Only add listeners for click to display likes and app listener to update likes once
		var listenersAdded = false;
		
		function setLikeContext()
		{
			if(theComment.likes.length > 0)	
			{
				likesLabel.setText(theComment.likes.length);
				
				likeButtonView.setImage('images/thumbsUpLight');
				
				for(var i = 0; i < theComment.likes.length; i++)
				{
					if(theComment.likes[i].userId == account.id)
					{
						likeButtonView.setImage('images/thumbsUpPurple');
					}
				}
		
				if(!listenersAdded)
				{
					commentView.addEventListener('click', function(){
						if (likesList.getHeight() == 30)
						{
							likesList.setHeight(0);
							likesList.removeAllChildren();
						}else{
							likesList.setHeight(30);
							displayLikeNames();
						}
					});
					
					//listener to hide likesList when commentsScrollView is scrolled
					Ti.App.addEventListener('app:hidelikelists', function(){
						if(likesList.getHeight() > 0)
						{
							likesList.setHeight(0);
						}
					});
					
					commentHolderView.add(likesList);
					
					listenersAdded = true;
				}
				
			}
		}
		
		
		
		setLikeContext();
		
		
		
		function displayLikeNames()
		{
		
			
			for(i=0; i < theComment.likes.length; i++)
			{
				var likeNameLabel = Ti.UI.createLabel({
				right: 0,
				height: '100%',
				width: Ti.UI.SIZE,
				font: {fontSize: bodyFontSize,
						fontFamily: config.avenir_next_regular}
				});
			
				var nameString = "";
				
				if(i > 0 )
				{
					nameString = nameString + ", ";
				}
				
				nameString = nameString + theComment.likes[i].firstName + " " + theComment.likes[i].lastName.charAt(0);
				
				likeNameLabel.setText(nameString);
				
				likesList.add(likeNameLabel);
			}
		}
		
		
		
		
	}	
	
	
	return commentHolderView;
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
			height: 12,
			left: 0
		});
		
		if(commentObject.status == "INTONEUTRAL"){
			inlineImage.setHeight(20);
			inlineImage.setImage('/images/bailFace');
		}else if(commentObject.status == "NEUTRALTOIN"){
			inlineImage.setImage('/images/greenCheckMarkForImInButtonNotClicked');
		}
		userStatusView.add(inlineImage);
		
		var inlineLabel = Ti.UI.createLabel({
			text: commentObject.userFirstName + " " + commentObject.userLastName + " " + commentObject.comment + ".",
			font: {font: config.avenir_next_regular,
					fontSize: nameFontSize},
			left: 4,
			color: 'black'
		});
		userStatusView.add(inlineLabel);
		
		
	return userStatusView;
};

exports.buildConvoStatus = function(containerWidth, containerHeight, commentObject)
{
	var headerFontSize = containerWidth * .045;
	var bodyFontSize = containerWidth * .04;
	
	var convoStatusView = Ti.UI.createView({
		top: 10,
		bottom: 10,
		width: '80%',
		height: Ti.UI.SIZE,
		layout: 'vertical'
	});
	
		var header = Ti.UI.createLabel({
			top: 0,
			text: "IT'S HAPPENING!",
			font: {font: config.avenir_next_regular,
					fontSize: headerFontSize},
			color: 'black',
			zIndex: 1
		});
		convoStatusView.add(header);
		
		Ti.API.info(commentObject);
		var commentText = Ti.UI.createTextArea({
			top: -6,
			width: Ti.UI.FILL,
			height:Ti.UI.SIZE,  
			font: {fontSize: bodyFontSize,
					   fontFamily: config.avenir_next_regular},		
			value: encoder.decode_utf8(commentObject.comment),
			editable: false,
			color: 'black',
			touchEnabled: false,
			zIndex: 0,
			textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER
		});
		convoStatusView.add(commentText);
	
	return convoStatusView;
};


	
	
	
	
