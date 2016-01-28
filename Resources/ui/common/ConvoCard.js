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
		
	var purple = config.purple;
	
	var AddFriends = require('ui/common/AddFriends');
	var MembersView = require('ui/common/MembersView');
	var encoder = require('lib/EncoderUtility');
	
	var account = Ti.App.properties.getObject('account');
	
	var inStatus = cardArgs.localUserStatus;
	var userConversationId = cardArgs.localUserConversationId;
	
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
						textAreaFocused = true;
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
			
	Ti.App.addEventListener('keyboardframechanged', function(e){
				
		if(e.keyboardFrame.y >= config.winHeight)
		{
			animation1.bottom = 0;
			animation2.bottom = createCommentHolder.size.height;
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
			keyboardHeight = e.keyboardFrame.height;
		}
				
			animation1.duration = e.animationDuration * 1000;
			animation2.duration = e.animationDuration * 1000;	
				
		createCommentHolder.animate(animation1);
		commentsScrollView.animate(animation2);
				
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
	
//Populate the UI skeleton	
function Populate (e){
	card.removeEventListener('postlayout', Populate);
	
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
		
		if(userIsCreator)
		{
			//TODO: get local user profile pic from filesystem
				//creatorProfilePic.setImage();
			creatorLabel.setText("You");
		}else{
			//TODO: httpRequest to get name and picture of cardArgs.userId
				//creatorLabel.setText();
				//creatorProfilePic.setImage();
		}
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
		backgroundColor: 'white',
		layout: 'horizontal'	
	});
					
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
			closeAnimation.addEventListener('complete', function(e){
					unCollapseView.fireEvent('click');
					commentsScrollView.setTop(disappearingView.size.height);
					commentsScrollView.setBottom('10%');
					spacer.setHeight(10);
				});
				
		textArea.blur();
		card.animate(closeAnimation);		
		cardIsRaised = false;
	});
	
	card.add(closeButton);
	
	//set up comments view
	var CommentView = require('ui/common/CommentsBuilder');
	
		//this is checked when new views are added to the commentsScrollView.  It is set to true when the user creates a comments so it scrolls down when it is added.
		var scrollToBottom = false;
		
		//add spacer to top of commentsScrollView
		var spacer = Ti.UI.createView({
			height: 10,
			width: '100%',
			top: 0
		});
		commentsScrollView.add(spacer);
		
		commentsScrollView.addEventListener('touchstart', hideDisappearingView);
		commentsScrollView.addEventListener('touchmove', hideDisappearingView);
		commentsScrollView.addEventListener('dragstart', hideDisappearingView);
		
	mainViewContainer.add(commentsScrollView);	
	
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
							rightTextAreaButton.setTouchEnabled(false);
							sendLabel.hide();
							scrollToBottom = true;
							Ti.App.fireEvent('app:refresh');
							commentsScrollView.scrollToBottom();
						}else{
							Ti.API.info('error adding comment - ' + JSON.stringify(response));
						}
					});
		});
	
//eventListener to tell parent to remove this card
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
		cardIsRaised = true;
	});	

//eventLestner to update the card UI
Ti.App.addEventListener('app:UpdateCard' + cardArgs.conversationId, function(e)
{
	if (e.status == "IT_IS_ON" && itsHappening == false)
	{
		itsHappening = true;
		setUpHappeningContext();
	}else if(e.status == "OPEN" && itsHappening == true)
	{
		itsHappening = false;
		setUpHappeningContext();
	}
});

//eventListeners to update the comments
	var localComments = [];
		
		//this creates the comments views when the card is created
		commentsScrollView.addEventListener('postlayout', function(e)
		{
			commentsScrollView.removeEventListener('postlayout', arguments.callee);
			
			for (i = 0; i < cardArgs.comments.length; i++)
			{
				var commentView = new CommentView.buildComment(containerWidth, containerHeight, cardArgs.comments[i]);
				localComments.push(1);
				commentsScrollView.add(commentView);
			}	
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
						var commentView = new CommentView.buildComment(containerWidth, containerHeight, e.comments[i]);
						localComments.push(1);
						
						if (scrollToBottom)
						{
							commentView.addEventListener('postlayout', function(e){
								Ti.API.info('scroll to bottom called');
								commentView.removeEventListener('postlayout', arguments.callee);
								commentsScrollView.scrollToBottom();
							});
							scrollToBottom = false;
							commentsScrollView.add(commentView);
						}else{
							commentsScrollView.add(commentView);
						}
						
				}
				if(!cardIsRaised)
				{
					Ti.App.fireEvent('app:UpdateBubble:' + conversationId, {newComments: true});
				}
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
	
	disappearingView.add(friendsViewRow);
				//call PopulateFriendsRow Function	
				//PopulateFriendsRow();
					
		//set up description text area
		var descriptionView = Ti.UI.createView({
			top: 5,
			left: '4%',
			right: '4%',
			height:  0,                   //Titanium.UI.SIZE,
			layout: 'vertical',
			
		});
			var itsHappeningView = Ti.UI.createView({
				top: 0,
				bottom: 0,
				width: '100%',
				height: Titanium.UI.SIZE,
				backgroundColor: '#F3F0F7',
				borderRadius: 4
			});
			
				var happeningLabel = Ti.UI.createImageView({
					width: '41%', 
					height: Titanium.UI.SIZE,
					top: 5,
					bottom: 5,
					image: 'images/itsHappening'
				});
			itsHappeningView.add(happeningLabel);
					
			var descriptionText = Ti.UI.createTextArea({
				height: Ti.UI.SIZE,
				width: '100%',
				top: 0,
				color: 'black'	,
				backgroundColor: 'white',
				font: {fontFamily: 'AvenirNext-Regular',
						fontSize: 19},
				touchEnabled: false,
				
			});	
			
				
	disappearingView.add(descriptionView);		
					
					
	//set up buttonsViewRow	
	
	var btnWidth = containerWidth * .41;
	
	var buttonRowView = Ti.UI.createView({
		//top: containerHeight * .015,
		top: 5,
		height: Ti.UI.SIZE,
		width: '100%',
		layout: 'horizontal',								
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
		//set up descriptionView
		descriptionView.add(itsHappeningView);
		descriptionText.setValue("Hitting the Blue Mountain trail, then meeting up with Mike and Andie afterward.");
		descriptionView.add(descriptionText);
		descriptionView.setHeight(Titanium.UI.SIZE);
		//set buttons
		if(userIsCreator)
		{
			btn1.setImage('images/btnHappeningSelected');
		}
		commentsScrollView.setTop(disappearingView.size.height);
		
	}else{
		descriptionView.setHeight(0);
		//set buttons
		if(userIsCreator)
		{
			btn1.setImage('images/btnHappening');
			btn1.addEventListener('click', setConversationStatusHappening);
		}
		commentsScrollView.setTop(disappearingView.size.height);
	}
}

function setUpInOutContext()
{
	if(!userIsCreator)
	{
		if(inStatus == "NEUTRAL")
		{
			btn1.setImage('images/btnIn');
			btn1.addEventListener('click', setUserStatusIn);
			btn2.setImage('images/btnOut');
			btn2.addEventListener('click', setUserStatusOut);
		}
		else if(inStatus == "OUT")
		{
			btn1.setImage('images/btnIn');
			btn1.addEventListener('click', setUserStatusNeutral);
			btn2.setImage('images/btnOutSelected');
			btn2.addEventListener('click', setUserStatusNeutral);
		}
		else if(inStatus == "IN")
		{
			btn1.setImage('images/btnInSelected');
			btn1.addEventListener('click', setUserStatusNeutral);
			btn2.setImage('images/btnOut');
			btn2.addEventListener('click', setUserStatusNeutral);
		}
		buttonRowView.setTouchEnabled(true);
		Ti.App.fireEvent('app:UpdateBubble:' + conversationId, {localUserStatus: inStatus});
	}
}

var setUserStatusOut = function()
{
	Ti.API.info('set user out');
	buttonRowView.setTouchEnabled(false);
	btn1.removeEventListener('click', setUserStatusIn);
	btn2.removeEventListener('click', setUserStatusOut);
	var changeStatusRequest = {userConversationId: userConversationId, status: "OUT"};
	
	httpClient.doPost('/v1/changeUserInStatus', changeStatusRequest, function(success, response)
	{
		if(success)
		{
			inStatus = "OUT";
			setUpInOutContext();
		}else{
			alert('error setting user in status');
			setUpInOutContext();
		}
	});
};

var setUserStatusIn = function()
{
	Ti.API.info('set user in');
	buttonRowView.setTouchEnabled(false);
	btn1.removeEventListener('click', setUserStatusIn);
	btn2.removeEventListener('click', setUserStatusOut);
	
	var changeStatusRequest = {userConversationId: userConversationId, status: "IN"};
	
	httpClient.doPost('/v1/changeUserInStatus', changeStatusRequest, function(success, response)
	{
		if(success)
		{
			inStatus = "IN";
			setUpInOutContext();
		}else{
			alert('error setting user in status');
			setUpInOutContext();
		}
	});
};

var setUserStatusNeutral = function()
{
	Ti.API.info('set user neutral');
	buttonRowView.setTouchEnabled(false);
	btn1.removeEventListener('click', setUserStatusNeutral);
	btn2.removeEventListener('click', setUserStatusNeutral);
	var changeStatusRequest = {userConversationId: userConversationId, status: "NEUTRAL"};
	
	httpClient.doPost('/v1/changeUserInStatus', changeStatusRequest, function(success, response)
	{
		if(success)
		{
			inStatus = "NEUTRAL";
			setUpInOutContext();
		}else{
			alert('error setting user in status');
			setUpInOutContext();
		}
	});
};

function setConversationStatusHappening(e)
{
	btn1.removeEventListener('click', setConversationStatusHappening);
	btn1.setImage('images/btnHappeningSelected');
	var changeStatusRequest = {status: "IT_IS_ON", conversationId: conversationId};
				
	httpClient.doPost('/v1/changeConversationStatus', changeStatusRequest, function(success, response)
	{
		Ti.API.info(JSON.stringify(response));
		if(success)
		{
			Ti.App.fireEvent('app:refresh');
		}else{
			alert('error setting conversation status');
			btn1.setImage('images/btnHappening');
			btn1.addEventListener('click', setConversationStatusHappening);
		}
	});
}

function setConversationStatusNevermind(e)
{
	Ti.API.info('setting to nevermind');
	btn2.removeEventListener('click', setConversationStatusNevermind);
	btn2.setImage('images/btnNevermindSelected');
	var changeStatusRequest = {status: "CLOSED", conversationId: conversationId};
	
	httpClient.doPost('/v1/changeConversationStatus', changeStatusRequest, function(success, response)
	{
		Ti.API.info(JSON.stringify(response));
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
	friendsViewRow.add(friendCircles);
		
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
	
