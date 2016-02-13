/**
 * The card view for starting a new conversation
 * 
 * @param {Object} args
 * @param {Object} callback
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
	
	// The notification view has a zIndex that blocks the UI and provides an indicator
	var notificationView = require('ui/common/NotificationView').create();
	
	var account = Ti.App.properties.getObject('account');

//set up the UI skeleton of the card	
var card = Ti.UI.createWindow({
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
	
	
	var friendsViewRow = Ti.UI.createView({
		top: 0,
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
			
	
	var membersView = Ti.UI.createView({
		width: '100%',
		height: Ti.UI.SIZE,
		backgroundColor: 'orange',
		layout: 'vertical'
		
	});
	
//Populate the UI skeleton
function Populate (e)
{
	card.removeEventListener('postlayout', Populate);
		
	var containerHeight = card.size.height;
	var containerWidth =  card.size.width;
		
	var profileCircleDia = profileViewRow.size.height;      //was conotainerWidth *  .145
	var profileCircleRadius = profileCircleDia / 2;
	var friendCircleDia = containerWidth * .10;
	var friendCircleRadius = friendCircleDia / 2;
		
		
	// Set up profileViewRow
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
				card.close();
			});
			card.animate(animation);
	});	

	closeButton.add(nevermindLabel);
	
	//Populate profileView
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
	var createConversationRequest = {invitedUsers: []};
	
	addFriendsButton.addEventListener('click', function(e)
	{
		addFriendsButton.removeEventListener('click', arguments.callee);
		addFriendsButton.setBackgroundColor(purple);
		buttonLabel.setColor('white');
		textArea.blur();
		createCommentHolder.setZIndex(0);
		
		var emptyArray = [];
		var contactsAuth;
		var addView;
		Ti.Contacts.requestAuthorization(function(e)
		{
			Ti.API.info(e);
			if(e.success == 1)
			{
				contactsAuth = true;
			}else{
				contactsAuth = false;
			}
			
			addView = new AddFriends(card, contactsAuth);
			var animation1 = Ti.UI.createAnimation({
				top: 0,
				//bottom: '5%',
				duration: 250
			});
			mainViewContainer.add(addView);
			addView.animate(animation1);
		});
		
		//Listen to update # of friends label as user picks in AddFriends
		card.addEventListener('updateFriendsLabel', function(e)
		{
			numberFriendsLabel.text = e.count + ' friends';
		});
		
		//listen for event fired by AddFriends 'done' button click
		card.addEventListener('returnFromAddFriends', function(e)
		{
			
			for (i = 0; i < e.selectedPeople.length; i++)
			{
				createConversationRequest.invitedUsers.push(e.selectedPeople[i]);
			}
			createCommentHolder.setZIndex(1);
			var selectedNames = e.selectedNames;	
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
		createConversationRequest.userId = account.id;
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
				/**
				if(response.data[0].field == 'invitedUsers')
				{
					notificationView.hideIndicator();
					alert("Error: Can only select numbers registered to a user");
				}
				*/
				Ti.API.info('error creating conversation');
				
			}
		});
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
	
