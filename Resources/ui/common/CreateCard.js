/**
 * The card window
 * 
 * @param {Object} args
 * @param {Object} callback
 */

function CreateCard(parentView, cardArgs, mainContainerHeight)
	{
	
	var httpClient = require('lib/HttpClient');
	var config = require('config');
		
	var purple = config.purple;
	
	var AddFriends = require('ui/common/AddFriends');
	var MembersView = require('ui/common/MembersView');
	var encoder = require('lib/EncoderUtility');
	
	// The notification view has a zIndex that blocks the UI and provides an indicator
	var notificationView = require('ui/common/NotificationView').create();
	
	var account = Ti.App.properties.getObject('account');
		
var card = Ti.UI.createView({
	width: '97%',
	height: '100%',
	top: '101%',
	backgroundColor: 'white',
	layout: 'absolute',
	borderRadius: 10,
	});

 card.addEventListener('postlayout', Populate);

	var profileViewRow = Ti.UI.createView({
		top: '1.5%',
		height: '9%',
		width: '100%',
		layout: 'horizontal'
		});
		
		var profileLabelsView = Ti.UI.createView({
			left: '2%',
			height: '100%',
			layout: 'vertical',
			width: Titanium.UI.SIZE
		});
		card.add(profileViewRow);	
	
	var mainViewContainer = Ti.UI.createView({
		top: '11.5%',
		width: '100%',
		bottom: '5%',
		layout: 'absolute',
		backgroundColor: 'white'
		});
		card.add(mainViewContainer);
		
		
			var commentsScrollView = Ti.UI.createScrollView({
				top: 0,
				bottom: '10%',
				width: '100%',
				backgroundColor: '#F7F5FA',         // '#f3f3f3',
				layout: 'vertical'
				});
				
				
				commentsScrollView.addEventListener('touchstart', function(e){
						textArea.blur();
				});
				commentsScrollView.addEventListener('scrollstart', function(e){
					textArea.blur();
				});
		
		var createCommentHolder = Ti.UI.createView({
			height: Titanium.UI.SIZE,
			width: '100%',
			backgroundColor: '#c2c2c2',
			bottom: 0 ,
			zIndex: 1
		});
		
		var createCommentView = Ti.UI.createView({
			top: 1,
			height: Titanium.UI.SIZE,
			width: '100%',
			backgroundColor: 'white',
			layout: 'horizontal'
		});
			
			var leftTextAreaButton = Ti.UI.createView({
				left: '1%',
				bottom: 0,
				height: 53,
				top: 2,
				bottom: 2,
				width: '15%',
			});
				
			var textArea = Ti.UI.createTextArea({
				left: '2%',
				width: '66%',
				height: Titanium.UI.SIZE,
				font: {fontFamily: 'AvenirNext-Regular',
						fontSize: 16},
				color: 'gray'
			});
				
				textArea.addEventListener('focus', function(e){
					if (textArea.getColor() == 'gray')
					{
						textArea.setValue('');
						textArea.setFont({fontFamily: 'OpenSans-Regular',
											fontSize: 16});
						textArea.setColor('black');
					}
				});
				
				var rightTextAreaButton = Ti.UI.createButton({
					left: 0,
					height: 53,
					width: Titanium.UI.FILL,
					top: 2,
				    bottom: 2,
				    visible: false
				});
					
			createCommentView.add(leftTextAreaButton);
			createCommentView.add(textArea);
			createCommentView.add(rightTextAreaButton);
			createCommentHolder.add(createCommentView);
			mainViewContainer.add(createCommentHolder);
		
		//Listen for the keyboard event
			
			var animation1 = Ti.UI.createAnimation();
			var animation2 = Ti.UI.createAnimation();
			
			Ti.App.addEventListener('keyboardframechanged', function(e){
				
				if(e.keyboardFrame.y >= config.winHeight)
				{
						animation1.bottom = 0;
						animation2.bottom = createCommentHolder.size.height;
				}
				else
				{
					animation1.bottom = e.keyboardFrame.height;
					animation2.bottom = e.keyboardFrame.height + createCommentHolder.size.height;
				}
				
				animation1.duration = e.animationDuration * 1000;
				animation2.duration = e.animationDuration * 1000;	
				
				createCommentHolder.animate(animation1);
				commentsScrollView.animate(animation2);
				commentsScrollView.scrollToBottom();
				
			});
			
			//this ensures the createCommentHolder doesn't get 'stuck' up at keyboard height
			Ti.App.addEventListener('pause', function(e)
			{
				textArea.blur();
			});
			
	
	var membersView = Ti.UI.createView({
		width: '100%',
		height: Ti.UI.SIZE,
		backgroundColor: 'orange',
		layout: 'vertical'
		
	});
	
	
	function Populate (e){
		card.removeEventListener('postlayout', Populate);
		
		var containerHeight = card.size.height;
		var containerWidth =  card.size.width;
		
		var profileCircleDia = profileViewRow.size.height;      //was conotainerWidth *  .145
		var profileCircleRadius = profileCircleDia / 2;
		var friendCircleDia = containerWidth * .10;
		var friendCircleRadius = friendCircleDia / 2;
		
		
	//// Set up profileViewRow
	var creatorProfilePic = Ti.UI.createImageView ({
			//top: 0,
			left: '4%',
			width: profileCircleDia,
			height: profileCircleDia,
			borderRadius: profileCircleRadius
			});
			
			profileViewRow.add(creatorProfilePic);
	
					var creatorLabel = Ti.UI.createLabel({
						left: '2%',
						top: '3%',
						font: {fontSize: 21,
							   fontFamily: 'AvenirNext-Medium'},
						color: 'black'
					});
					profileLabelsView.add(creatorLabel);
		
					var extraLabelsView = Ti.UI.createView({
						left: '4%',
						bottom: '3%',
						height: Ti.UI.SIZE,
						width: Ti.UI.SIZE,
						layout: 'horizontal'
					});
					
					var andLabel = Ti.UI.createLabel({
						left: 0,
						bottom: '3%',
						text: 'and',
						font: {fontSize: 15,
							   fontFamily: 'AvenirNext-Regular'},
						color: 'black',	
					});
					extraLabelsView.add(andLabel);
		
					var numberFriendsLabel = Ti.UI.createLabel({
						text: "0 friends are in",
						font: {fontSize: 15,
							   fontFamily: 'AvenirNext-Regular'},
						color: purple,
						left: 2
					});
					extraLabelsView.add(numberFriendsLabel);
					profileLabelsView.add(extraLabelsView);
				profileViewRow.add(profileLabelsView);
	
	
	//set up friendsViewRow
	var friendsViewRow = Ti.UI.createView({
			top: 0,
			height: containerHeight * .064,
			width: '100%',
			backgroundColor: 'blue',
			layout: 'horizontal'	
			});
					
	
	var closeButton = Ti.UI.createLabel({
		width: Titanium.UI.SIZE,
		top: '1.5%',
		right: '2.5%',
		height: '5%',
	});
	card.add(closeButton);
	

//If context is creating a new conversation
if (cardArgs.context == 'new' )
{
	
	var createConversationRequest = {status: 'OPEN',
										invitedUsers: []};
	
		
	
	createConversationRequest.userId = account.id;
	
	
	var selectedNames;
	
	//set up closeButton
	
	var nevermindLabel = Ti.UI.createLabel({
		text: "Nevermind",
		font: {fontSize: 13,
				fontFamily: 'AvenirNext-Regular'},
		color: purple,
		top: 0,
		right: 0,
		verticalAlign: Titanium.UI.TEXT_ALIGNMENT_TOP
	});
	
	closeButton.addEventListener('click', function(e){
		var animation = Titanium.UI.createAnimation();
			textArea.blur();
			animation.top = '101%';
			animation.duration = 250;
			
			animation.addEventListener('complete', function(e)
			{
				parentView.remove(card);
			});
			card.animate(animation);
				
			
		});	
	closeButton.add(nevermindLabel);
	
	
	creatorProfilePic.image = '/images/profilePic';
	creatorLabel.text = 'You';
	
	mainViewContainer.add(commentsScrollView);
	
	//Set up createCommentView
	
	textArea.setValue("What are you trying to do?...");
	
	textArea.addEventListener('blur', function(e)
	{
		if (textArea.getValue() == "")
		{
			textArea.setColor('gray');
			textArea.setValue("What are you trying to do?...");
		}
	});			
	
	var whateverIcon = Ti.UI.createImageView({
		width: '80%',
		image: 'images/whateverIcon.png'
	});
	
	leftTextAreaButton.add(whateverIcon);
	
		leftTextAreaButton.addEventListener('click', function(e){
			textArea.setValue('');
			textArea.setColor('black');
			textArea.setValue('Up for Whatever');
			checkIfGo();
		});
	
	var goLabel = Ti.UI.createLabel({
			text: "Go!",
			color: 'gray',
			font: {fontFamily: 'AvenirNext-Bold',
						fontSize: 20}
			});
			
			rightTextAreaButton.add(goLabel);
	
	textArea.addEventListener('change', function(e){
		checkIfGo();
	});
	
	//goButton listener to send the createConversationRequest
		rightTextAreaButton.addEventListener('click', sendRequest);
	
	//adjust friendsViewRow to accomadate a button and be added to mainViewContainer
	friendsViewRow.height = '10%';
	
	var addFriendsButton = Ti.UI.createView({
		left: '13%',
		right: '13%',
		height: '96%',
		top: 0,
		borderWidth: 1.5,
		borderColor: purple,
		borderRadius: 7
		
	});
	
		var buttonLabel = Ti.UI.createLabel({
			text: 'Add Friends',
			color: purple,
			font: {fontSize: 15,
					fontFamily: 'AvenirNext-Medium'
					}	
		});
	
	addFriendsButton.add(buttonLabel);
	friendsViewRow.add(addFriendsButton);
	mainViewContainer.add(friendsViewRow);
		
	//Click Add Friends button, choose, then call PopulateFriendsRow function
	addFriendsButton.addEventListener('click', function(e)
	{
		addFriendsButton.removeEventListener('click', arguments.callee);
		addFriendsButton.setBackgroundColor(purple);
		buttonLabel.setColor('white');
		textArea.blur();
		createCommentHolder.setZIndex(0);
		var emptyArray = [];
		var addView = new AddFriends(card, emptyArray);
		var animation1 = Ti.UI.createAnimation({
			top: 0,
			//bottom: '5%',
			duration: 250
		});
		mainViewContainer.add(addView);
		addView.animate(animation1);
		
		//Listen to update # of friends label as user picks in AddFriends
		card.addEventListener('updateFriendsLabel', function(e)
		{
			numberFriendsLabel.text = e.count + ' friends';
		});
		
		//listen for event fired by AddFriends 'done' button click
		card.addEventListener('returnFromAddFriends', function(e)
		{
			Ti.API.info('e.selectedPeople = ' + e.selectedPeople);
			for (i = 0; i < e.selectedPeople.length; i++)
			{
				createConversationRequest.invitedUsers.push(e.selectedPeople[i]);
			}
			createCommentHolder.setZIndex(1);
			selectedNames = e.selectedNames;	
			checkIfGo();
			
			friendsViewRow.remove(addFriendsButton);
			friendsViewRow.height = containerHeight * .064;
			
			friendsViewRow.addEventListener('click', function(e){
				openMembersView('new');
			});	
			PopulateFriendsRow(e.selectedPeople);
			
			
			var animation2 = Ti.UI.createAnimation({
				top: '101%',
				duration: 250
			});
			addView.animate(animation2);
			
			animation2.addEventListener('complete', function(e)
			{
				mainViewContainer.remove(addView);
			});
			
			
		});
		
	});
		
	
	var animationSwitch = false;
	
	function checkIfGo()
	{
		
		if (createConversationRequest.invitedUsers.length > 0  && textArea.getColor() == 'black' && textArea.getValue() > "")
		{
			
			if (!animationSwitch)
			{
				rightTextAreaButton.show();
				animationSwitch = true;
				
				goLabel.setColor('#21BF55');
				
				var goAnimation = Ti.UI.createAnimation({
					opacity: 0.2,
					duration: 800
				});
				goAnimation.addEventListener('complete', function(e)
				{
					if (animationSwitch)
					{
						goLabel.animate(goAnimationReverse);
					}
					
				});
				
				var goAnimationReverse = Ti.UI.createAnimation({
					opacity: 1.0,
					duration: 800
				});
				goAnimationReverse.addEventListener('complete', function(e){
					if (animationSwitch)
					{
						goLabel.animate(goAnimation);
					}
				});
				
				goLabel.animate(goAnimation);
			}
				
			
		}else{
				rightTextAreaButton.hide();
				animationSwitch = false;
				goLabel.setColor('gray');
				goLabel.setOpacity(1.0);
		}
		
	}			
	
	function sendRequest(e)
	{
		notificationView.showIndicator();
		
		createConversationRequest.status = "OPEN";
		createConversationRequest.topic = encoder.encode_utf8(textArea.getValue());
		
		Ti.API.info(JSON.stringify(createConversationRequest));
		
		
		httpClient.doPost('/v1/conversation', createConversationRequest, function(success, response)
		{
			Ti.API.info(JSON.stringify(response));
			
			if (success)
			{   
				var addCommentRequest = {conversationId: response.conversationId, userId: response.userId, comment: createConversationRequest.topic };
				httpClient.doPost('/v1/addUserComment', addCommentRequest, function(success, response)
				{
					Ti.API.info(JSON.stringify(response));
					if(success)
					{
						closeButton.fireEvent('click');
						Ti.App.fireEvent('app:refresh');
					}else{
						Ti.API.info('error adding first comment - ' + JSON.stringify(response));
					}
				});
			}else{
				Ti.API.info('error creating conversation');
			}
		});
	}
	
	
	
} else {      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var CommentView = require('ui/common/CommentsBuilder');
	
	var conversationId = cardArgs.conversationId;
	
	//this is checked when new views are added to the commentsScrollView.  It is set to true when the user creates a comments so it scrolls down when it is added.
	var scrollToBottom = false;
	
	var imIn = false;
	var imOut = false;
	
	//add spacer to top of commentsScrollView
	var spacer = Ti.UI.createView({
		height: 10,
		width: '100%',
		top: 0
	});
	commentsScrollView.add(spacer);
	
	//set up createCommentHolder
	var chatProfilePic = Ti.UI.createImageView({
		width: '80%',
		height: '80%',
		backgroundColor: 'black'
	});
	leftTextAreaButton.add(chatProfilePic);
	
	var sendLabel = Ti.UI.createLabel({
		text: 'Send',
		font: {fontFamily: 'AvenirNext-Regular',
				fontSize: 12},
		color: 'black',
		visible: false
	});
	rightTextAreaButton.add(sendLabel);
	rightTextAreaButton.setVisible(true);
	
	textArea.addEventListener('change', function(e)
	{
		if (textArea.getValue() > "")
		{
			sendLabel.setVisible(true);
		}else{
			sendLabel.setVisible(false);
		}
	});
	
	rightTextAreaButton.addEventListener('click', function(e)
	{
		notificationView.showIndicator();
		
		var addCommentRequest = {};
			addCommentRequest.comment = encoder.encode_utf8(textArea.getValue());;
			addCommentRequest.conversationId = conversationId;
			addCommentRequest.userId = account.id;
			
			httpClient.doPost('/v1/addUserComment', addCommentRequest, function(success, response)
				{
					Ti.API.info(JSON.stringify(response));
					if(success)
					{
						textArea.setValue("");
						scrollToBottom = true;
						Ti.App.fireEvent('app:refresh');
						notificationView.hideIndicator();
						
					}else{
						Ti.API.info('error adding comment - ' + JSON.stringify(response));
						notificationView.hideIndicator();
					}
				});
			
	});
	
	//eventListener to tell parent to remove this
	Ti.App.addEventListener('app:DeleteCard:' + cardArgs.conversationId, function(e)
	{
		Ti.API.info('delete card recieved for ' + cardArgs.conversationId);
		parentView.remove(card);
	});
	
	//eventListner to animate this up into view
	Ti.App.addEventListener('app:raisecard:' + cardArgs.conversationId, function(e)
	{	
		Ti.API.info('card raise recieved by convo: ' + cardArgs.conversationId);
		commentsScrollView.setBottom('10%');
		var animation = Titanium.UI.createAnimation();
				animation.top = '5%';
				animation.duration = 250;	
			card.animate(animation);	
	});	
	
	//eventListeners to update the comments
	var localComments = [];
		
		//this creates the comments when the card is created
		commentsScrollView.addEventListener('postlayout', function(e)
		{
			commentsScrollView.removeEventListener('postlayout', arguments.callee);
			
			for (i = 0; i < cardArgs.comments.length; i++)
			{
				var commentView = new CommentView(containerWidth, containerHeight, cardArgs.comments[i]);
				localComments.push(1);
				commentsScrollView.add(commentView);
			}
			
		});
		
		//this listens for calls from the RefreshUtility to add additional comments 
		Ti.App.addEventListener('app:UpdateComments:' + cardArgs.conversationId, function(e)
		{
			Ti.API.info('updatecomments e.comments[0].comment' + e.comments[0].comment);
			Ti.API.info('e.comments.length = ' + e.comments.length);
			if(localComments.length < e.comments.length)
			{
				//calculate number of new comments
				var dif = e.comments.length - localComments.length;
					
				for(i = (e.comments.length - dif); i < e.comments.length; i++)
				{
						Ti.API.info('i = ' + i);
						var commentView = new CommentView(containerWidth, containerHeight, e.comments[i]);
						localComments.push(1);
						commentsScrollView.add(commentView);
						
						if (scrollToBottom)
						{
							commentsScrollView.scrollToBottom();
							scrollToBottom = false;
						}	
				}
			}
			});
	
	mainViewContainer.add(commentsScrollView);		
	
	//Set up close button.  The difference here from 'new' context is it moves the card down without actually removing if from the parent (mainwindow)
	var closeImage = Ti.UI.createImageView({
		image: 'images/closeIcon',
		right: 2,
		top: 2
	});
	
	closeButton.setWidth('15%');
	closeButton.add(closeImage);
	
	closeButton.addEventListener('click', function(e)
	{
		var closeAnimation = Titanium.UI.createAnimation({
			top: '101%',
			duration: 250
		});
			closeAnimation.addEventListener('complete', function(e){
					unCollapseView.fireEvent('click');
					commentsScrollView.setTop(disappearingView.size.height);
					commentsScrollView.setBottom('10%');
					spacer.setHeight(10);
				});
				
		textArea.blur();
		card.animate(closeAnimation);		
	});
		
		
	var disappearingView = Ti.UI.createView({
		top: 0,
		width: '100%',
		height: Ti.UI.SIZE,
		layout: 'vertical',
		zIndex: 3,
		backgroundColor: 'white'
		});	
	
	mainViewContainer.add(unCollapseView);
	
		
		disappearingView.add(friendsViewRow);
				//call PopulateFriendsRow Function	
				//PopulateFriendsRow();
					
				//set up description text area
				
				var descriptionView = Ti.UI.createView({
					top: 5,
					left: '4%',
					right: '4%',
					backgroundColor: '#F3F0F7',
					height: Titanium.UI.SIZE,
					layout: 'vertical',
					borderRadius: 4
					
				});
					var happeningLabel = Ti.UI.createImageView({
						width: '41%', 
						height: Titanium.UI.SIZE,
						top: 5,
						bottom: 5,
						image: 'images/itsHappening'
					});
					descriptionView.add(happeningLabel);
					
					var descriptionText = Ti.UI.createTextArea({
						height: Ti.UI.SIZE,
						left: '4%',
						right: '4%',
						top: 0,
						color: 'black'	,
						backgroundColor: 'white',
						font: {fontFamily: 'AvenirNext-Regular',
								fontSize: 19},
						touchEnabled: false,
						value: "Hitting the Blue Mountain trail, then meeting up with Mike and Andie afterward."
						
						});	
					//descriptionView.add(descriptionText);
					
					disappearingView.add(descriptionView);		
					disappearingView.add(descriptionText);
					
					
				//set up buttonsViewRow	
				var buttonRowView = Ti.UI.createView({
					top: containerHeight * .015,
					height: Ti.UI.SIZE,
					width: '100%',
					layout: 'horizontal'								
					});
					disappearingView.add(buttonRowView);
					
						btnWidth = containerWidth * .41;
		
						var btn1 = Ti.UI.createImageView({
							width: '44%',
							left: '4%',
							
							image: 'images/btnIn'
							
							});
							buttonRowView.add(btn1);
							
								btn1.addEventListener('click', function(e)
								{
									if (imIn)
									{
										btn1.setImage('images/btnIn');
										imIn = false;
										//TODO http request to backend to change user's in status
									}else if (imOut){
										btn2.setImage('images/btnOut');
										imOut = false;
									}else{
										btn1.setImage('images/btnInSelected');
										btn2.setImage('images/btnOut');
										imIn = true;
										imOut = false;
										
										//TODO http request to backend to change user's in status
									}
									
								});
																
						var btn2 = Ti.UI.createImageView({
							width: '44%',
							left: '4%',
							image: 'images/btnOut'
							});
							buttonRowView.add(btn2);	
							
							btn2.addEventListener('click', function(e)
								{
									if (imOut)
									{
										btn2.setImage('images/btnOut');
										imOut = false;
										
										//TODO http request to backend to change user's in status
									}else if (imIn){
										btn1.setImage('images/btnIn');
										imIn = false;
									}else{
										btn2.setImage('images/btnOutSelected');
										btn1.setImage('images/btnIn');
										imOut = true;
										imIn = false;
										
										//TODO http request to backend to change user's in status
									}
									
								});
				
				var convoLabel = Ti.UI.createImageView({
					width: '29%',
					height: Titanium.UI.SIZE,
					top: 30,  
					left: '4%',
					bottom: 15,
					image: 'images/conversationLabel'
				});
				disappearingView.add(convoLabel);
				
				var line = Ti.UI.createView({
					height: 1,
					width:  '100%',
					backgroundColor: 'gray'
				});
				disappearingView.add(line);
				
				//set up unCollapseView
				var unCollapseView = Ti.UI.createView({
					height: 45,
					width: '100%',
					top: 0,
					backgroundColor: 'gray',
					opacity: 0.6,
					visible: false
				});
				
	mainViewContainer.add(disappearingView);	
	mainViewContainer.add(unCollapseView);	
		
		//sets the commentsScrollView top to bottom of disappearingView
		disappearingView.addEventListener('postlayout', function(e)
		{
			disappearingView.removeEventListener('postlayout', arguments.callee);
			Ti.API.info('disappearing postlayout called ' + disappearingView.size.height);
			commentsScrollView.setTop(disappearingView.size.height);
		});
				
				
				
				unCollapseView.addEventListener('click', showDisappearingView);
				
				
				
				commentsScrollView.addEventListener('touchstart', hideDisappearingView);
				
				commentsScrollView.addEventListener('touchmove', hideDisappearingView);
				commentsScrollView.addEventListener('dragstart', hideDisappearingView);
				
				Ti.App.addEventListener('keyboardframechanged', hideDisappearingView);
				
				
			function showDisappearingView(e)
			{
				var unCollapseAnimation = Ti.UI.createAnimation({
						top: 0,
						duration: 250
					});
					unCollapseView.visible = false;
					textArea.blur();
					
					unCollapseAnimation.addEventListener('complete', function(e)
					{
						//commentsScrollView.setTop(disappearingView.size.height);
						//spacer.setHeight(10);
					});
					disappearingView.animate(unCollapseAnimation);
			}	
				
			function hideDisappearingView(e){
				var collapseAnimation = Ti.UI.createAnimation({
						top: disappearingView.size.height * -1,
						duration: 250
					});
					
					commentsScrollView.setTop(0);
					spacer.setHeight(50);
					unCollapseView.visible = true;	
					disappearingView.animate(collapseAnimation);		
			}
			

	
	}
	

				
	function PopulateFriendsRow(invitedUsers){
		
		var friendCircles = Ti.UI.createView({
			left: '6%',
			height: '100%',
			width: '45%',
			layout: 'horizontal'
			});
			friendsViewRow.add(friendCircles);
		if (invitedUsers.length >= 4)
		{
			for (i = 0; i< 4; i++)
			{
				createImageCircle(invitedUsers[i]);
			}
		}
		else
		{
			for (i = 0; i < invitedUsers.length; i++)
			{
				createImageCircle(invitedUsers[i]);
			}
		}
		
		function createImageCircle(userId)
		{
			var friendsPic = Ti.UI.createImageView ({
			image: '/images/profilePic',   //TODO need a default image for here
			left: '1.7%',
			hieght: friendCircleDia,
			width: friendCircleDia,
			borderRadius: friendCircleRadius,
			});
			friendCircles.add(friendsPic);
			
			//TODO do http request for users' profile image here
		}
		
	}
	
	
	function openMembersView(context)
	{
		var memberViewArgs = {};
		memberViewArgs.parentView = mainViewContainer;
		memberViewArgs.context = context;
		memberViewArgs.selectedNames = selectedNames;
		var membersView = new MembersView(memberViewArgs) ;
		mainViewContainer.add(membersView);
	}				
		
	
	
	
	
		
};  //end of populate function

card.add(notificationView);

	
return card;
};

module.exports = CreateCard;
	
