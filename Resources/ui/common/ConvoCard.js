/**
 * The card window for a conversation
 * 
 * @param {Object} cardArgs
 * 
 */

function CreateCard(parentView, cardArgs, mainContainerHeight)
{
	var httpClient = require('lib/HttpClient');
	var config = require('config');
	var cardViewUtility = require('lib/CardViewUtility');
	var moment = require('lib/Moment');
	
		
	var purple = config.purple;
	
	var UserProfileWindow = require('ui/common/UserProfileWindow');
	var AddFriends = require('ui/common/AddFriends');
	var MembersView = require('ui/common/MembersView');
	var TunedView = require('ui/common/TunedView');
	var encoder = require('lib/EncoderUtility');
	
	var account = Ti.App.properties.getObject('account');
	
	var inStatus = cardArgs.localUserStatus;
	var tunedStatus = cardArgs.tunedStatus;
	var userConversationId = cardArgs.localUserConversationId;
	var timeString = cardArgs.timeString;
	var happeningTime = cardArgs.happeningTime;
	var convoCreator = cardArgs.userId;
	
	//see if the local user created this conversation
	var userIsCreator = false;
		if (account.id == cardArgs.userId)
		{
			userIsCreator = true;
		}
		
	//see if it's happening
	var itsHappening = false;
		if (cardArgs.status == "IT_IS_ON")
		{
			itsHappening = true;
		}
		
	var cardIsRaised = false;
	var keyboardHeight;
	var textAreaFocused;

//set up the UI skeleton for the card
var card = Ti.UI.createView({
	width: '97%',
	height: '100%',
	top: '101%',
	backgroundColor: 'white',
	layout: 'absolute',
	borderRadius: 10,
	zIndex: 2
	});

 card.addEventListener('postlayout', cardPostLayoutCallback);
 
 
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
		backgroundColor: '#F7F5FA'
		});
		card.add(mainViewContainer);
		
		
			var commentsScrollView = Ti.UI.createScrollView({
				top: 0,
				bottom: '10%',
				width: '100%',
				backgroundColor: '#F7F5FA',        
				layout: 'vertical'
				});
				
				
				commentsScrollView.addEventListener('touchstart', function(e){
						textArea.blur();
				});
				commentsScrollView.addEventListener('scrollstart', function(e){
						textArea.blur();
				});
				
				
		
		var tunedDialog = Ti.UI.createImageView({
			width: '50%',
			left: '1%',
			visible: false,
			zIndex: 3
		});
		
		mainViewContainer.add(tunedDialog);
		
		var createCommentHolder = Ti.UI.createView({
			height: Titanium.UI.SIZE,
			width: '100%',
			backgroundColor: '#c2c2c2',
			bottom: 0 ,
			zIndex: 1
		});
		
			createCommentHolder.addEventListener('postlayout', function(){
					this.removeEventListener('postlayout', arguments.callee);
					tunedDialog.setBottom(this.size.height + 5);
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
				width: '12%',
			});
				
			var textArea = Ti.UI.createTextArea({
				left: 0,
				width: '67%',
				height: Titanium.UI.SIZE,
				font: {fontFamily: config.avenir_next_regular,
						fontSize: 16},
				color: 'black',
				scrollable: false
			});
				
				var chatHintLabel = Ti.UI.createLabel({
					width: Ti.UI.SIZE,
					left: 3,
					font: {fontFamily: config.avenir_next_regular,
						fontSize: 16},
					color: 'gray',
					text: 'Chat about it...'
				});
				textArea.add(chatHintLabel);
				
				chatHintLabel.addEventListener('click', function(){
					textArea.focus();
				});
				
			textArea.addEventListener('change', function(e){
				if(textArea.getValue() > "")
				{
					chatHintLabel.hide();
				}else{
					chatHintLabel.show();
				}
			});
			
			textArea.addEventListener('blur', function(e){
				if(textArea.getValue() > "")
				{
					chatHintLabel.hide();
				}else{
					chatHintLabel.show();
				}
			});
			
			var rightTextAreaButton = Ti.UI.createButton({
				left: 0,
				height: 53,
				width: Titanium.UI.FILL,
				top: 2,
				bottom: 2,
				touchEnabled: false
			});
					
		createCommentView.add(leftTextAreaButton);
		createCommentView.add(textArea);
		createCommentView.add(rightTextAreaButton);
		createCommentHolder.add(createCommentView);
	mainViewContainer.add(createCommentHolder);
		
		
	//Listen for the keyboard event
	var animation1 = Ti.UI.createAnimation();
	var animation2 = Ti.UI.createAnimation();
	var animation3 = Ti.UI.createAnimation();
			
	Ti.App.addEventListener('keyboardframechanged', reactToKeyboard);
		
		function reactToKeyboard(e)
		{
			if(e.keyboardFrame.y >= config.winHeight)
			{
				animation1.bottom = 0;
				animation2.bottom = createCommentHolder.size.height;
				animation3.bottom = createCommentHolder.size.height + 5;
				keyboardHeight = 0;
				textAreaFocused = false;
			}
			else
			{
				animation1.bottom = e.keyboardFrame.height;
				animation2.bottom = e.keyboardFrame.height + createCommentHolder.size.height;
				animation2.addEventListener('complete', function(e)
				{
					commentsScrollView.scrollToBottom();
				});
				animation3.bottom = e.keyboardFrame.height + createCommentHolder.size.height + 5;
				keyboardHeight = e.keyboardFrame.height;
			}
					
				animation1.duration = e.animationDuration * 1000;
				animation2.duration = e.animationDuration * 1000;	
				animation3.duration = e.animationDuration * 1000;

			createCommentHolder.animate(animation1);
			commentsScrollView.animate(animation2);
			tunedDialog.animate(animation3);
		}
		
			
	//this ensures the createCommentHolder doesn't get stuck up at keyboard height
	Ti.App.addEventListener('pause', function(e)
	{
		textArea.blur();
	});		
	
	
//Populate the UI skeleton	
function cardPostLayoutCallback(e){
	card.removeEventListener('postlayout', cardPostLayoutCallback);
	card.setViewShadowColor('black');
	card.setViewShadowOffset({x: 0, y: 3});
	card.setViewShadowRadius(6);
	card.addEventListener('postlayout', function(e)
	{
		card.removeEventListener('postlayout', arguments.callee);
		setUpHappeningContext();
		setUpInOutContext();
	});
		
	var containerHeight = card.size.height;
	var containerWidth =  card.size.width;
	var profileCircleDia = profileViewRow.size.height;      //was conotainerWidth *  .145
	var profileCircleRadius = profileCircleDia / 2;
	var friendCircleDia = containerWidth * .10;
	var friendCircleRadius = friendCircleDia / 2;
	
	var conversationId = cardArgs.conversationId;
	
		
	//// Set up profileViewRow
	var creatorProfilePic = Ti.UI.createImageView ({
		left: '4%',
		backgroundColor: '#D3D3D3',
		height: profileCircleDia,
	});
		creatorProfilePic.addEventListener('postlayout', function(){
			creatorProfilePic.setWidth(creatorProfilePic.size.height);
			creatorProfilePic.setBorderRadius(creatorProfilePic.size.height / 2);
			getProfile();
		});
		
		if(!userIsCreator)
		{
			creatorProfilePic.addEventListener('click', function(){
				var userProfileWindow = new UserProfileWindow(cardArgs.userId);
				userProfileWindow.open();
			});
		}
		
		Ti.App.addEventListener('updateProfilePicture', getProfile);
		
		function getProfile()
		{
			if(userIsCreator && config.profileFile.exists()){
				creatorProfilePic.setImage(config.profileFile.read());
			}else if(!userIsCreator && !creatorProfilePic.getImage()){
				httpClient.doMediaGet('/v1/media/' + cardArgs.userId + '/PROFILE/profilepic.jpeg', function(success, response){
							if(success){
								creatorProfilePic.setImage(Ti.Utils.base64decode(response));
							}else{
								Ti.App.addEventListener('app:refresh', function(){
									this.removeEventListener('app:refresh', arguments.callee);
									getProfile();
								});
							}
							
				});
			}
		}
	profileViewRow.add(creatorProfilePic);
	
	var creatorLabel = Ti.UI.createLabel({
		left: '2%',
		top: '3%',
		font: {fontSize: 21,
				fontFamily: config.avenir_next_medium},
		color: 'black'
	});
		
	var namePopulated = false;
		if(userIsCreator)
		{
			//TODO: get local user profile pic from filesystem
				//creatorProfilePic.setImage();
			creatorLabel.setText("You");
			namePopulated = true;
		}else{
			getCreator();
			//creatorProfilePic.setImage();
		}
	profileLabelsView.add(creatorLabel);
		
		
		function getCreator()
		{
			var request = {userId: cardArgs.userId};
					httpClient.doPost('/v1/getUser', request, function(success, response){
						if (success)
						{
							var name; 
							if ((response.firstName.length + response.lastName.length) > 17){
								name = response.firstName + " " + response.lastName.charAt(0) + ".";
							}else{
								name = response.firstName + " " + response.lastName;
							}
							creatorLabel.setText(name);
							namePopulated = true;
						}
					});
		}
	
	var numberFriendsLabel = Ti.UI.createLabel({
		text: "and 0 friends are in so far",
		font: {fontSize: 15,
				fontFamily: config.avenir_next_regular},
		color: 'black',
		left: '4%',
		bottom: '3%'
	});
	
		numberFriendsLabel.update = function(userConversations)
		{
			//update numbers of friends in
			var number = 0;
	
			for(var f = 0; f < userConversations.length; f++)
			{
				var curr = userConversations[f];
				if(curr.inStatus == "IN"  && curr.userId != convoCreator)
				{
					number++;
				}
			}
			
			this.setText("and " + number + " friends are in so far.");
		};
		
	numberFriendsLabel.update(cardArgs.userConversations);
	
	profileLabelsView.add(numberFriendsLabel);
	profileViewRow.add(profileLabelsView);
					
	var closeButton = Ti.UI.createLabel({
		width: Titanium.UI.SIZE,
		top: '1.5%',
		right: '2.5%',
		height: '5%',
	});
	
	//Set up close button.  
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
			/*
			closeAnimation.addEventListener('complete', function(e){
								unCollapseView.fireEvent('click');
								commentsScrollView.setTop(disappearingView.size.height);
								commentsScrollView.setBottom('10%');
								spacer.setHeight(10);
							});*/
				
		textArea.blur();
		card.animate(closeAnimation);		
		cardIsRaised = false;
		Ti.App.fireEvent('app:cardRaised', {raised: false});
	});
	
		profileViewRow.addEventListener('swipe', function(e){
		 	if(e.direction == 'down')
		 	{
		 		closeButton.fireEvent('click');
		 	}
		 });
	
	card.add(closeButton);
	
	//set up comments view
	var CommentView = require('ui/common/CommentsBuilder');
	
	commentsScrollView.addEventListener('swipe', hideDisappearingView);
	commentsScrollView.addEventListener('touchmove', hideDisappearingView);
	commentsScrollView.addEventListener('dragstart', hideDisappearingView);
	
	commentsScrollView.addEventListener('dragstart', function(){
		Ti.App.fireEvent('app:hidelikelists');
	});
	
			//TODO remove this
			//this is checked when new views are added to the commentsScrollView.  It is set to true when the user creates a comments so it scrolls down when it is added.
			var scrollToBottom = false;
		
		//add spacer to top of commentsScrollView
		var spacer = Ti.UI.createView({
			height: 10,
			width: '100%',
			top: 0
		});
		commentsScrollView.add(spacer);
		
		var localComments = [];
		
		
			//Override function for adding views to CommentsScrollView to add time stamps if necessary
			var lastTimeStamp = 0;
			
			commentsScrollView.checkIfTimestampNeeded = function(itemCreated)
			{
					                                 //15 mins
				if((itemCreated - lastTimeStamp) > 900000)
				{
					var timeStamp = Ti.UI.createLabel({
						top: 5,
						width: Ti.UI.SIZE,
						height: Ti.UI.SIZE,
						text: moment(itemCreated).fromNow(),
						color: 'gray',
						font: {fontSize: containerWidth * .03}
					});
					
					commentsScrollView.add(timeStamp);
					
					lastTimeStamp = itemCreated;
					
					//listener to adjust the timestamp relative to the current time
					Ti.App.addEventListener("app:refresh", function(){
						timeStamp.text = moment(itemCreated).fromNow();
					});
					
				}
			};
				
			commentsScrollView.addItem = function(theItem)
			{
				commentsScrollView.checkIfTimestampNeeded(theItem.created);
				
				var commentView;
				
				if(theItem.type == "USERCREATED")
				{
					commentView = new CommentView.buildComment(containerWidth, containerHeight, theItem);
				}
				else if(theItem.type == "CONVOSTATUS")
				{
					 	
				}
				else if(theItem.type == "USERSTATUS")
				{
					commentView = new CommentView.buildUserStatus(containerWidth, containerHeight, theItem); 	
				}
					
				commentsScrollView.add(commentView);
			};
				
		
		//this creates the comments views when the card is created
		if(cardArgs.comments)
		{
			for (i = 0; i < cardArgs.comments.length; i++)
			{
				commentsScrollView.addItem(cardArgs.comments[i]);
				
				localComments.push(1);
			}	
		}	
	
	mainViewContainer.add(commentsScrollView);	
	
	//set up createCommentHolder
	
	var whateverIcon = Ti.UI.createImageView({
		width: '80%',
		image: 'images/whateverIcon.png'
	});

		leftTextAreaButton.add(whateverIcon);
		
		var sendLabel = Ti.UI.createLabel({
			text: 'Send',
			font: {fontFamily: config.avenir_next_regular,
					fontSize: 12},
			color: 'black'
		});
		sendLabel.hide();
		rightTextAreaButton.add(sendLabel);
		
		textArea.addEventListener('change', function(e)
		{
			commentsScrollView.setBottom(keyboardHeight + createCommentHolder.size.height);
			commentsScrollView.scrollToBottom();
			if (textArea.getValue() > "")
			{
				sendLabel.show();
				rightTextAreaButton.setTouchEnabled(true);
			}else{
				sendLabel.hide();
				rightTextAreaButton.setTouchEnabled(false);
			}
		});
		
		textArea.addEventListener('focus', hideDisappearingView);
		
		//click event listener for the send button
		rightTextAreaButton.addEventListener('click', function(e)
		{
			//create the commentView to append
			var localCommentObject = {};
				localCommentObject.comment = encoder.encode_utf8(textArea.getValue());
				localCommentObject.conversationId = conversationId;
				localCommentObject.userId = account.id;
				localCommentObject.userFirstName = account.first_name;
				localCommentObject.userLastName = account.last_name;
				localCommentObject.type = "USERCREATED";
				
				
			var localCommentView = new CommentView.buildComment(containerWidth, containerHeight, localCommentObject);
			
			var addCommentRequest = {};
				addCommentRequest.type = "USERCREATED";
				addCommentRequest.comment = encoder.encode_utf8(textArea.getValue());
				addCommentRequest.conversationId = conversationId;
				addCommentRequest.userId = account.id;
				
			textArea.setValue("");
			rightTextAreaButton.setTouchEnabled(false);
			sendLabel.hide();
			
			commentsScrollView.checkIfTimestampNeeded(moment());
			
			commentsScrollView.add(localCommentView);
			
			setTimeout(commentsScrollView.scrollToBottom, 500);
			
				httpClient.doPost('/v1/addUserComment', localCommentObject, function(success, response)
					{
						if(success)
						{
							// Tell commentView it was created.  Pass it it's commentId and set up likes functionality
							localCommentView.backendCallback(response.commentId);
						}else{
							alert('error adding comment');
						}
					});
		});
	
//eventListener to tell parent to remove this card
	Ti.App.addEventListener('app:DeleteCard:' + cardArgs.conversationId, function(e)
	{
		parentView.remove(card);
		if(cardIsRaised){
			Ti.App.fireEvent('app:cardRaised', {raised: false});
		}
	});
	
//event listener to lower, raise, or leave alone this card when the app is resumed from a notification
	Ti.App.addEventListener('app:reactToPush', function(e){
		Ti.API.info(e.conversationId);
		if(e.conversationId != cardArgs.conversationId && cardIsRaised)
		{
			closeButton.fireEvent('click');
		}else if(e.conversationId == cardArgs.conversationId && !cardIsRaised){
			setTimeout(function(){
				Ti.App.fireEvent('app:raisecard:' + cardArgs.conversationId);
				Ti.App.fireEvent('app:hideCommentIndicator' + cardArgs.conversationId);
			}, 500);
		}
	});


	
//eventListner to animate this up into view
	Ti.App.addEventListener('app:raisecard:' + cardArgs.conversationId, function(e)
	{	
		commentsScrollView.setBottom('10%');
		
		if(itsHappening)
		{
			setTimeString();
		}
		
		var animation = Titanium.UI.createAnimation();
				animation.top = '5%';
				animation.duration = 250;	
		card.animate(animation);	
		Ti.App.fireEvent('app:cardRaised', {raised: true});
		cardIsRaised = true;
	});	

//eventLestner to update the card UI
Ti.App.addEventListener('app:UpdateCard' + cardArgs.conversationId, function(e)
{
	timeString = e.timeString;
	happeningTime = e.happeningTime;
	setTimeString();
	
	if (e.status == "IT_IS_ON" && itsHappening == false)
	{
		itsHappening = true;
		cardArgs.whatsHappening = e.whatsHappening;
		setUpHappeningContext();
	}else if(e.status == "OPEN" && itsHappening == true)
	{
		itsHappening = false;
		setUpHappeningContext();
	}
	
	if (!namePopulated)
	{
		getCreator();
	}
	
	numberFriendsLabel.update(e.userConversations);
	
	//update list of members and thier status
	membersView.fireEvent('updateMembers', {users: e.userConversations});
});


	
//this listens for calls from the RefreshUtility to add additional comments 
		Ti.App.addEventListener('app:UpdateComments:' + cardArgs.conversationId, function(e)
		{
			//are there new comments to add?
			if(localComments.length < e.comments.length)
			{
				//calculate number of new comments
				var dif = e.comments.length - localComments.length;
					
				for(i = (e.comments.length - dif); i < e.comments.length; i++)
				{
					//only build non-local user comments...they are already there from when the local user created it.
					if(e.comments[i].userId != account.id || e.comments[i].type != "USERCREATED")
					{
						
						commentsScrollView.addItem(e.comments[i]);	
						localComments.push(1);
					
						if(!cardIsRaised)
						{
							Ti.App.fireEvent('app:UpdateBubble:' + conversationId, {newComments: true});
						}
					}
						
				}		
				
			}
			
			//fire events to update comment likes here
			//listener is on the commentView in comments builder
			for(i = 0; i < e.comments.length; i++)
			{
				Ti.App.fireEvent('app:commentLikes:' + e.comments[i].commentId, {commentObject: e.comments[i]});
			}
			
			
		});
	
//Set up the disappearingView which is holds the conversation info and slides in and out of view over the comments	
var disappearingView = Ti.UI.createView({
	top: 0,
	width: '100%',
	height: Ti.UI.SIZE,
	layout: 'vertical',
	zIndex: 3,
	backgroundColor: 'white'
});	
	
	disappearingView.addEventListener('swipe', function(e){
		 	if(e.direction == 'down')
		 	{
		 		closeButton.fireEvent('click');
		 	}
		 	if(e.direction == 'up')
		 	{
		 		commentsScrollView.fireEvent('swipe');
		 	}
	});
		
		//set up membersView
		
		var friends = [];
		
		getFriends();
		Ti.App.addEventListener('app:refresh', getFriends);
		
			function getFriends(){
				var req = {userId: account.id};
				
				httpClient.doPost('/v1/getFriendships', req, function(success, response){
					if(success)
					{
						friends = response;
					}
				});
			}
			
		var membersViewArgs = {};
		membersViewArgs.height = containerHeight * .11;
		membersViewArgs.users = cardArgs.userConversations;
		membersViewArgs.mainViewContainer = mainViewContainer;
		
		var membersView = new MembersView(membersViewArgs, addMoreCallback);
		
			function addMoreCallback(){
				addView = new AddFriends(card, friends, addedMoreCallback);
				addView.setZIndex(4);
				mainViewContainer.add(addView);
				addView.animate({top: 0, duration: 250, delay: 200});
			}
			
				function addedMoreCallback(addedPeople){
					addView.setTouchEnabled(false);
					var req = {};
						req.adder = account.id;
						req.conversationId = cardArgs.conversationId;
						req.userIds = [];
						for(i=0; i<addedPeople.length; i++)
						{
							req.userIds.push(addedPeople[i].userId);
						}
					httpClient.doPost('/v1/addUsersToConversation', req, function(success, response){
						if(success)
						{
							Ti.App.fireEvent('app:refresh');
						}
					});
					addView.animate({top: '101%', duration: 250, delay: 200}, function(){
						mainViewContainer.remove(addView);
					});
				}
	
		disappearingView.add(membersView);
					
		//add happeningBar
		var happeningView = Ti.UI.createImageView({
				top: 5,
				width: '92%'
			});
		disappearingView.add(happeningView);
		
		//set up description text area
		var descriptionText = Ti.UI.createTextArea({
			height: Ti.UI.SIZE,
			left: '4%',
			right: '4%',
			color: 'black'	,
			backgroundColor: 'white',
			font: {fontFamily: config.avenir_next_regular,
						fontSize: card.size.width * 0.0494},
			touchEnabled: false,
			scrollable: false,
			returnKeyType: Titanium.UI.RETURNKEY_DONE
		});	
			
			descriptionText.addEventListener('change', function(e){
				if(this.value > ""){
					descriptionHintLabel.hide();
				}else{
					descriptionHintLabel.show();
				}
			});
			
			var descriptionHintLabel = Ti.UI.createLabel({
				left: 6,
				width: Ti.UI.SIZE,
				text: 'What did you decide on?...',
				color: 'gray',
				font: {fontFamily: config.avenir_next_regular,
						fontSize: card.size.width * 0.0494},
				visible: true
			});
				
				descriptionHintLabel.addEventListener('click', function(){
					descriptionText.focus();
				});
			descriptionText.add(descriptionHintLabel);
	disappearingView.add(descriptionText);
	
		var timeText = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: 0,
			top: 0,
			layout: 'horizontal'
		});	
		
			var clock = Ti.UI.createImageView({
				image: 'images/clock',
				height: 27
			});
			timeText.add(clock);
			
			var timeTextLabel = Ti.UI.createLabel({
				left: 5,
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				font: {fontFamily: config.avenir_next_demibold,
						fontSize: card.size.width * 0.040},
				color: 'black'
			});
			timeText.add(timeTextLabel);
			
			var timeDescriptionLabel = Ti.UI.createLabel({
				left: 5,
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				font: {fontFamily: config.avenir_next_regular,
						fontSize: card.size.width * 0.040},
				color: 'black'
			});
			timeText.add(timeDescriptionLabel);
	disappearingView.add(timeText);	
	
	
	//set up setTimeView
	var setTimeView = require('ui/common/SetTimeView').createScroll();
	
	disappearingView.add(setTimeView);
	
					
	//set up buttonsViewRow	
	
	var btnWidth = containerWidth * .41;
	
	var buttonRowView = Ti.UI.createView({
		top: 0,
		bottom: 5,
		height: Ti.UI.SIZE,
		width: '100%',
		layout: 'horizontal',
		backgroundColor: 'white'								
	});
	disappearingView.add(buttonRowView);
					
		var btn1 = Ti.UI.createImageView({
			width: '44%',
			left: '4%'
		});
		buttonRowView.add(btn1);					
																
		var btn2 = Ti.UI.createImageView({
			width: '44%',
			left: '4%',
		});
		
			if(userIsCreator)
			{
				btn2.setImage('images/btnNevermind');
				btn2.addEventListener('click', setConversationStatusNevermind);
			}
		buttonRowView.add(btn2);	
		
				
	var convoLabel = Ti.UI.createImageView({
		//width: '29%',
		height: 10,
		top: 20,  
		left: '4%',
		bottom: 10
	});
	disappearingView.add(convoLabel);
	
		
	var line = Ti.UI.createView({
		height: 1,
		top: 2,
		width:  '100%',
		backgroundColor: 'gray'
	});
	disappearingView.add(line);
	
mainViewContainer.add(disappearingView);

				
//set up unCollapseView
var unCollapseView = Ti.UI.createView({
	height: 45,
	width: '100%',
	top: 0,
	backgroundColor: 'gray',
	opacity: 0.6,
	visible: false
});
unCollapseView.addEventListener('click', showDisappearingView);				
	
mainViewContainer.add(unCollapseView);	
		

function setUpHappeningContext()
{
	//adjust disappearingView
	
	if(itsHappening)
	{
		//set up descriptionText
		descriptionHintLabel.hide();
		descriptionText.setValue(cardArgs.whatsHappening);
		descriptionText.setHeight(Ti.UI.SIZE);
		setTimeString();
		happeningView.setImage('images/happeningBar');
		buttonRowView.setTop(-10);
		convoLabel.setImage('images/conversationLabel');
		convoLabel.setHeight(10);
		//set buttons
		if(userIsCreator)
		{
			btn1.setImage('images/btnEdit');
			btn1.addEventListener('click', editButtonHandler);
		}
		commentsScrollView.setTop(disappearingView.size.height);
	}else{
		descriptionText.setHeight(0);
		happeningView.setImage('images/notHappeningBar');
		//set buttons
		buttonRowView.setTop(0);
		convoLabel.setImage('images/whatsHappeningLabel');
		convoLabel.setHeight(9);
		if(userIsCreator)
		{
			btn1.setImage('images/btnHappening');
			btn1.addEventListener('click', itsHappeningButtonHandler);
		}
		commentsScrollView.setTop(disappearingView.size.height);
	}
}

function setTimeString()
{
	if(happeningTime)
	{
		timeTextLabel.setText(cardViewUtility.buildTimeString(timeString, happeningTime, false));
		timeDescriptionLabel.setText(timeString);
		timeText.setHeight(Ti.UI.SIZE);
	}
}

function setUpInOutContext()
{
	if(!userIsCreator)
	{
		if(inStatus == "NEUTRAL")
		{
			btn2.setImage('images/btnIn');
			btn2.addEventListener('click', setUserStatusIn);
		}
		else if(inStatus == "IN")
		{
			btn2.setImage('images/btnInSelected');
			btn2.addEventListener('click', setUserStatusNeutral);
		}
		
		if(tunedStatus == "UNTUNED")
		{
			btn1.setImage('images/btnUntuned');
			btn1.addEventListener('click', setUserTuned);
		}
		else if(tunedStatus == "TUNED")
		{
			btn1.setImage('images/btnTuned');
			btn1.addEventListener('click', setUserUnTuned);
		}
		
		buttonRowView.setTouchEnabled(true);
		Ti.App.fireEvent('app:UpdateBubble:' + conversationId, {localUserStatus: inStatus});
		Ti.App.fireEvent('app:UpdateBubble:' + conversationId, {localUserTunedStatus: tunedStatus});
	}
}

var setUserTuned = function()
{
	buttonRowView.setTouchEnabled(false);
	btn1.setImage('images/btnTuned');
	btn1.removeEventListener('click', setUserTuned);
	
	var changeTunedStatusRequest = {userConversationId: userConversationId, status: "TUNED"};
	
	httpClient.doPost('/v1/changeUserTunedStatus', changeTunedStatusRequest, function(success, response)
	{
		if(success)
		{
			tunedStatus = "TUNED";
			setUpInOutContext();
			Ti.App.fireEvent('app:refresh');
		}else{
			alert('error setting user in status');
			setUpInOutContext();
		}
	});
};

var setUserUnTuned = function()
{
	buttonRowView.setTouchEnabled(false);
	btn1.setImage('images/btnUntuned');
	btn1.removeEventListener('click', setUserUnTuned);
	
	var changeTunedStatusRequest = {userConversationId: userConversationId, status: "UNTUNED"};
	
	httpClient.doPost('/v1/changeUserTunedStatus', changeTunedStatusRequest, function(success, response)
	{
		if(success)
		{
			tunedStatus = "UNTUNED";
			setUpInOutContext();
			Ti.App.fireEvent('app:refresh');
		}else{
			alert('error setting user in status');
			setUpInOutContext();
		}
	});
};

var setUserStatusIn = function()
{
	buttonRowView.setTouchEnabled(false);
	btn2.setImage('images/btnInSelected');
	btn2.removeEventListener('click', setUserStatusIn);
	
	var changeStatusRequest = {userConversationId: userConversationId, status: "IN"};
	
	httpClient.doPost('/v1/changeUserInStatus', changeStatusRequest, function(success, response)
	{
		if(success)
		{
			inStatus = "IN";
			setUpInOutContext();
			Ti.App.fireEvent('app:refresh');
		}else{
			alert('error setting user in status');
			setUpInOutContext();
		}
	});
};

var setUserStatusNeutral = function()
{
	buttonRowView.setTouchEnabled(false);
	btn2.setImage('images/btnIn');
	btn2.removeEventListener('click', setUserStatusNeutral);
	
	var changeStatusRequest = {userConversationId: userConversationId, status: "NEUTRAL"};
	
	httpClient.doPost('/v1/changeUserInStatus', changeStatusRequest, function(success, response)
	{
		if(success)
		{
			inStatus = "NEUTRAL";
			setUpInOutContext();
			Ti.App.fireEvent('app:refresh');
		}else{
			alert('error setting user in status');
			setUpInOutContext();
		}
	});
};


function editButtonHandler()
{
	btn1.removeEventListener('click', editButtonHandler);
	btn1.setImage('images/btnEditSelected');
	happeningActionHandler(true);
}

function itsHappeningButtonHandler()
{
	//change buttons
	btn1.removeEventListener('click', itsHappeningButtonHandler);
	btn1.setImage('images/btnHappeningSelected');
	
	happeningActionHandler(false);
}

function happeningActionHandler(editing)
{
	btn2.removeEventListener('click', setConversationStatusNevermind);
	
	//remove reactToKeyboard
	Ti.App.removeEventListener('keyboardframechanged', reactToKeyboard);
	
	//update cancel close button listener
	closeButton.addEventListener('click', closeHandler);
		
		function closeHandler()
		{
			descriptionText.blur();
			setTimeView.blur();
		}
	
	var changeStatusRequest = {status: "IT_IS_ON", conversationId: conversationId};
	var friendsViewHeight;
	
	card.animate({top: 20, duration: 200});
	membersView.setTouchEnabled(false);
	membersViewHeight = membersView.size.height;
		membersView.animate({opacity: 0.0, duration: 200}, function(){
			membersView.setHeight(0);
			descriptionText.setHeight(Ti.UI.SIZE);
			happeningView.setImage('images/happeningBar');
			descriptionText.setTouchEnabled(true);
			descriptionText.setMaxLength(150);
			timeText.setHeight(0);
			
			var expandArgs = {};
			if(editing)
			{
				expandArgs.editing = true;
				expandArgs.happeningTime = happeningTime;
				expandArgs.timeString = timeString;
			}
			setTimeView.expand(expandArgs);
			setTimeView.setTouchEnabled(true);
			
			
			buttonRowView.animate({opacity: 0.0, duration: 100}, function(){
				btn1.setImage('images/btnConfirm');
				btn1.setOpacity(0.4);
				btn2.setImage('images/btnCancel');
				btn2.addEventListener('click', cancelButtonHandler);
				btn1.setWidth('58.6%');
				btn2.setWidth('29.3%');
				buttonRowView.setTop(5);
				buttonRowView.animate({opacity: 1.0, duration: 100});
			});
		});
		
		descriptionText.addEventListener('focus', checkConfirm);
		descriptionText.addEventListener('change', checkConfirm);
	
	descriptionText.focus();
	
	setTimeView.addEventListener('touchstart', function()
	{
		descriptionText.blur();
	});
	
	setTimeView.addEventListener('scrollend', checkConfirm);
		
		var animationSwitch = false;
		
		function checkConfirm()
		{
			if (descriptionText.getValue() > "" && setTimeView.getCurrentPage() > 0)
			{
				btn1.setOpacity(1.0);
				btn1.setTouchEnabled(true);
			}else{
				btn1.setOpacity(0.4);
				btn1.setTouchEnabled(false);
			}
		};
		
		btn1.addEventListener('click', confirmButtonHandler);
		
		function confirmButtonHandler()
		{
			buttonRowView.setTouchEnabled(false);
			btn1.setImage('images/btnConfirmSelected');
			changeStatusRequest.whatsHappening = descriptionText.getValue();
			changeStatusRequest.happeningTime = setTimeView.getTime();
			changeStatusRequest.timeString = setTimeView.getTimeString();
			changeStatusRequest.userId = account.id;
			descriptionText.blur();
			setTimeView.blur();
			
			httpClient.doPost('/v1/changeConversationStatus', changeStatusRequest, function(success, response)
			{
				if(success)
				{
					Ti.App.fireEvent('app:refresh');
					setTimeView.removeEventListener('scrollend', checkConfirm);
					setTimeView.collapse();
					descriptionText.setTouchEnabled(false);
					membersView.setHeight(membersViewHeight);
					membersView.setOpacity(1.0);
					buttonRowView.animate({opacity: 0.0, duration: 200}, function(){
						btn1.setWidth('44%');
						btn1.setOpacity(1.0);
						btn1.setImage('images/btnEdit');
						btn1.removeEventListener('click', confirmButtonHandler);
						btn1.addEventListener('click', editButtonHandler);
						btn2.setWidth('44%');
						btn2.setImage('images/btnNevermind');
						btn2.removeEventListener('click', cancelButtonHandler);
						btn2.addEventListener('click', setConversationStatusNevermind);
						buttonRowView.setTouchEnabled(true);
						buttonRowView.animate({opacity: 1.0, duration: 250});
						card.animate({top: '5%', duration: 200});
						Ti.App.addEventListener('keyboardframechanged', reactToKeyboard);
					});
				}else{
					alert('error setting conversation status');
				}
			});
		};
		
		var cancelButtonHandler = function()
		{
			buttonRowView.setTouchEnabled(false);
			btn2.setImage('images/btnCancelSelected');
			btn2.removeEventListener('click', cancelButtonHandler);
			btn1.removeEventListener('click', confirmButtonHandler);
			descriptionText.setTouchEnabled(false);
			setTimeView.setTouchEnabled(false);
			setTimeView.blur();
			descriptionText.blur();
			setTimeView.removeEventListener('scrollend', checkConfirm);
			setTimeView.collapse();
			Ti.App.addEventListener('keyboardframechanged', reactToKeyboard);
			if(!editing){
				descriptionText.animate({height: 0, duration: 200});
				happeningView.setImage('images/notHappeningBar');
			}
				membersView.setHeight(membersViewHeight);
				membersView.animate({opacity: 1.0, duration: 200}, function(){
					membersView.setTouchEnabled(true);
					
					timer = setTimeout(function(){
						buttonRowView.animate({opacity: 0.0, duration: 250}, function(){
							btn1.setWidth('44%');
							if(!editing){
								btn1.setImage('images/btnHappening');
								btn1.addEventListener('click', itsHappeningButtonHandler);
							}else{
								btn1.setImage('images/btnEdit');
								btn1.addEventListener('click', editButtonHandler);
							}
							
							setTimeString();
							
							btn1.setOpacity(1.0);
							btn1.setTouchEnabled(true);
							btn2.setWidth('44%');
							btn2.setImage('images/btnNevermind');
							btn2.addEventListener('click', setConversationStatusNevermind);
							buttonRowView.setTouchEnabled(true);
							buttonRowView.setTop(0);
							buttonRowView.animate({opacity: 1.0, duration: 250});
							card.animate({top: '5%', duration: 200});
						});
						
					}, 100);
				});
			
		};
}



function setConversationStatusNevermind(e)
{
	btn2.removeEventListener('click', setConversationStatusNevermind);
	btn2.setImage('images/btnNevermindSelected');
	var changeStatusRequest = {status: "CLOSED", conversationId: conversationId};
	
	httpClient.doPost('/v1/changeConversationStatus', changeStatusRequest, function(success, response)
	{
		if(success)
		{
			Ti.App.fireEvent('app:refresh');
		}else{
			alert('error setting conversation status');
			btn2.setImage('images/btnNevermind');
			btn2.addEventListener('click', setConversationStatusNevermind);
		}
	});
}
	
			
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
				
function hideDisappearingView(e)
{
	var collapseAnimation = Ti.UI.createAnimation({
		top: disappearingView.size.height * -1,
		duration: 251
	});
					
	collapseAnimation.addEventListener('complete', function(e)
	{
		commentsScrollView.setTop(0);
		spacer.setHeight(50);
		unCollapseView.visible = true;	
		if(textAreaFocused){commentsScrollView.scrollToBottom();}
	});
					
	disappearingView.animate(collapseAnimation);		
}
	
	
function PopulateFriendsRow(invitedUsers)
{
	var friendCircles = Ti.UI.createView({
		left: '6%',
		height: '100%',
		width: '45%',
		layout: 'horizontal'
	});
	membersView.add(friendCircles);
		
	if (invitedUsers.length >= 4)
	{
		for (i = 0; i< 4; i++)
		{
			createImageCircle(invitedUsers[i]);
		}
	}else{
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



return card;
};

module.exports = CreateCard;
	
