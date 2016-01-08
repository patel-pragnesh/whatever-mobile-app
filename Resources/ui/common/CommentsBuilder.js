/**
 * The card window
 * 
 * @param {Object} args
 * @param {Object} callback
 */



function BuildComment(containerWidth, containerHeight, commentObject)
	{
	
	
		
	//Comments stuff
	commentorImageSize = containerWidth * .101;
	commentorImageRadius = commentorImageSize / 2;
	nameFontSize = containerWidth * .035;
	timeFontSize = containerWidth * .03;
	bodyFontSize = containerWidth * .035;
	
	
	
		var commentView = Ti.UI.createView({
			width: '100%',
			height: Ti.UI.SIZE,
			top: 4,
			layout: 'horizontal'
			});
		
			var commentImage = Ti.UI.createImageView({
				image: '/images/joe',
				borderRadius: commentorImageRadius,
				width: commentorImageSize,
				top: 3,
				left: '2%'
				});
				commentView.add(commentImage);
				
	
			var commentContent = Ti.UI.createView({
				top: 1,
				right: '14%',
				height: Ti.UI.SIZE,
				left: '4%',
				layout: 'vertical',
			});
			commentView.add(commentContent);
				
				var nameLabel = Ti.UI.createLabel({
					text: 'Joe McMahon',
					left: 0,
					top: 0,
					color: 'black',
					font: {fontSize: nameFontSize,
							   fontFamily: 'OpenSans-SemiBold'},
					zIndex: 2
					});
					commentContent.add(nameLabel);
				
				
					
				var commentText = Ti.UI.createTextArea({
					left: -5,
					top: -6,
					right: 2,
					font: {fontSize: bodyFontSize,
							   fontFamily: 'OpenSans-Regular'},		
					value: commentObject.comment,
					editable: false,
					color: 'black',
					backgroundColor: '#f3f3f3',
					touchEnabled: false
					});
					commentContent.add(commentText);
				
				var timeLabel = Ti.UI.createLabel({
					
					left: 0,
					top: -4,
					text: '24 minutes ago',
					font: {fontSize: timeFontSize,
							   fontFamily: 'OpenSans-Light'},
					color: 'gray'
					});
					commentContent.add(timeLabel);
					
			
	

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
	
module.exports = BuildComment;
	

	
	
	
	
