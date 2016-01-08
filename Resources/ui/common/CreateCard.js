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
				backgroundColor: '#f3f3f3',
				layout: 'vertical'
				});
				
				
				commentsScrollView.addEventListener('touchstart', function(e){
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
				font: {fontFamily: 'OpenSans-Light',
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
			var keyboardHidden = true;
			var animation = Ti.UI.createAnimation();
			
			Ti.App.addEventListener('keyboardframechanged', function(e){
				Ti.API.info('duration = ' + (e.animationDuration * 1000));
				if(keyboardHidden)
				{
					keyboardHidden = false;
					
						animation.bottom = e.keyboardFrame.height;
						animation.duration = e.animationDuration * 1000;
				}
				else
				{
					keyboardHidden = true;
					
					animation.bottom = 0;
					animation.duration = e.animationDuration * 1000;	
				}
				
				createCommentHolder.animate(animation);
				
			});
				
			//this ensures the createCommentHolder doesn't get 'stuck' up at keyboard height
			Ti.App.addEventListener('pause', function(e)
			{
				textArea.blur();
				keyboardHidden = true;
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
							   fontFamily: 'OpenSans-SemiBold'},
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
							   fontFamily: 'OpenSans-Light'},
						color: 'black',	
					});
					extraLabelsView.add(andLabel);
		
					var numberFriendsLabel = Ti.UI.createLabel({
						text: "0 friends are in",
						font: {fontSize: 15,
							   fontFamily: 'OpenSans-Light'},
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
				fontFamily: 'OpenSans-Regular'},
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
			font: {fontFamily: 'OpenSans-Bold',
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
					fontFamily: 'OpenSans-Semibold'
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
		createConversationRequest.topic = textArea.getValue();
		
		
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
	
	
	
	//set up createCommentHolder
	var chatProfilePic = Ti.UI.createImageView({
		width: '80%',
		height: '80%',
		backgroundColor: 'black'
	});
	leftTextAreaButton.add(chatProfilePic);
	
	var sendLabel = Ti.UI.createLabel({
		text: 'Send',
		font: {fontFamily: 'OpenSans-Regular',
				fontSize: 12},
		color: 'black'
	});
	rightTextAreaButton.add(sendLabel);
	rightTextAreaButton.setVisible(true);
	rightTextAreaButton.addEventListener('click', function(e)
	{
		notificationView.showIndicator();
		
		var addCommentRequest = {};
			addCommentRequest.comment = textArea.getValue();
			addCommentRequest.conversationId = conversationId;
			addCommentRequest.userId = account.id;
			
			httpClient.doPost('/v1/addUserComment', addCommentRequest, function(success, response)
				{
					Ti.API.info(JSON.stringify(response));
					if(success)
					{
						textArea.setValue("");
						textArea.blur();
						Ti.App.fireEvent('app:refresh');
						notificationView.hideIndicator();
					}else{
						Ti.API.info('error adding first comment - ' + JSON.stringify(response));
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
		var animation = Titanium.UI.createAnimation();
				animation.top = '5%';
				animation.duration = 250;
					
				card.animate(animation);	
	});	
	
	//eventListener to update the comments
	var localComments = [];
		
		//this creates the comments when the card is created
		commentsScrollView.addEventListener('postlayout', function(e)
		{
			commentsScrollView.removeEventListener('postlayout', arguments.callee);
			
			Ti.API.info('commentsScrollView postlayout called');
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
			var animation = Titanium.UI.createAnimation();
				textArea.blur();
				animation.top = '101%';
				animation.duration = 250;
				
				card.animate(animation);
		});
		
		
	var dissapearingView = Ti.UI.createView({
		top: 0,
		width: '100%',
		height: Ti.UI.SIZE,
		backgroundColor: 'white',
		layout: 'vertical',
		zIndex: 3,
		backgroundColor: 'pink'
		});	
	
	
	//mainViewContainer.add(dissapearingView);
	
	dissapearingView.addEventListener('postlayout', function(e){
		dissapearingView.removeEventListener('postlayout', arguments.callee);
		dissapearingView.top = dissapearingView.size.height * -1;
	});
		
		dissapearingView.add(friendsViewRow);
				//call PopulateFriendsRow Function	
				//PopulateFriendsRow();
					
				//set up description text area
				var descriptionText = Ti.UI.createTextArea({
					height: Ti.UI.SIZE,
					left: '6%',
					right: '6%',
					top: containerHeight * .015,
					color: 'black'	,
					backgroundColor: 'white'
					});	
					dissapearingView.add(descriptionText);		
					
					
				//set up buttonsViewRow	
				var buttonRowView = Ti.UI.createView({
					top: containerHeight * .015,
					height: containerHeight * .08,
					width: '100%',
					layout: 'absolute'								
					});
					dissapearingView.add(buttonRowView);	
					
				//set up unCollapseView
				var unCollapseView = Ti.UI.createView({
					height: '8%',
					width: '100%',
					top: 0,
					backgroundColor: 'gray',
					zIndex: 10,
					opacity: 0.4
				});
				mainViewContainer.add(unCollapseView);
				
				unCollapseView.addEventListener('click', function(e){
					var animation = Ti.UI.createAnimation();
					animation.top = 0;
					animation.duration = 400;
					dissapearingView.animate(animation);
					unCollapseView.hide();
				});
				
				
				
				//set up collapse view
				var collapseView = Ti.UI.createView({
				top: 15,
				height: containerHeight * .07,
				width: '100%',
				backgroundColor: 'gray'
				
				});
			
				collapseView.addEventListener('click', function(e) {
					dissapearingView.hide();
					unCollapseView.show();
				});
			
				dissapearingView.add(collapseView);

	
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
		
	function PopulateButtonsRow(){
		btnWidth = containerWidth * .41;
		
		var btn1 = Ti.UI.createView({
			height: Ti.UI.FILL,
			width: btnWidth,
			left: '6%',
			borderWidth: 1,
			borderRadius: 7,
			borderColor: purple
			});
			buttonRowView.add(btn1);
												
		var btn2 = Ti.UI.createView({
			height: Ti.UI.FILL,
			width: btnWidth,
			right: '6%',
			borderWidth: 1,
			borderRadius: 7,
			borderColor: purple
			});
			buttonRowView.add(btn2);
		
	}							
	
	
	
		
};  //end of populate function

card.add(notificationView);

	
return card;
};

module.exports = CreateCard;
	
