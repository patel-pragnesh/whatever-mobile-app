/**
 * The card view for starting a new conversation
 * 
 * @param {Object} args
 * @param {Object} callback
 */

function CreateCard(parentView, mainContainerHeight, friends)
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
	
	var addView;
	var account = Ti.App.properties.getObject('account');

//set up the UI skeleton of the card	
var card = Ti.UI.createView({
	width: '97%',
	height: '100%',
	top: '101%',
	backgroundColor: 'white',
	layout: 'absolute',
	borderRadius: 10,
	viewShadowColor: 'black',
	viewShadowOffset: {x: 0, y: 3},
	viewShadowRadius: 6,
	zIndex: 1
	});

 card.addEventListener('postlayout', function(){
 	this.removeEventListener('postlayout', arguments.callee);
 	
 	var containerHeight = card.size.height;
	var containerWidth =  card.size.width;
 });
 
 var cardLowered = false;
 
 card.addEventListener('swipe', lowerCard);
 
 function lowerCard(e){
 	if(e.direction == 'down')
 	{
 		cardLowered = true;
 		textArea.blur();
 		
 		card.animate({top: '80%',duration: 250});
 		Ti.App.fireEvent('app:cardRaised', {raised: false});
 	}
 	if(e.direction == 'up' && cardLowered)
 	{
 		card.animate({top: '5%',duration: 250});
 		Ti.App.fireEvent('app:cardRaised', {raised: true});
 	}
 }	
 	
 card.add(notificationView);

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
		
		// Set up profileViewRow
	var creatorProfilePic = Ti.UI.createImageView ({
		left: '4%',
		height: Ti.UI.FILL,
		backgroundColor: '#D3D3D3'
		});
			
			creatorProfilePic.addEventListener('postlayout', function(){
				creatorProfilePic.setWidth(creatorProfilePic.size.height);
				creatorProfilePic.setBorderRadius(creatorProfilePic.size.height / 2);
				getProfile();
			});
		
		Ti.App.addEventListener('updateProfilePicture', getProfile);
		
		function getProfile()
		{
			if(config.profileFile.exists()){
				creatorProfilePic.setImage(config.profileFile.read());
			}
		}
		profileViewRow.add(creatorProfilePic);
	
		var creatorLabel = Ti.UI.createLabel({
			left: '2%',
			top: '3%',
			font: {fontSize: 21,
					fontFamily: 'AvenirNext-Medium'},
			color: 'black',
			text: 'You'
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
	//profileLabelsView.add(extraLabelsView);
	profileViewRow.add(profileLabelsView);
	
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
		
		var startLabel = Ti.UI.createLabel({
			bottom: 63,
			font: ({fontFamily: 'AvenirNext-DemiBold',
						fontSize: 16}),
			color: 'black',
			text: 'What are you trying to do?',
			zIndex: 1
		});
		mainViewContainer.add(startLabel);
		
		var createCommentHolder = Ti.UI.createView({
			height: Titanium.UI.SIZE,
			width: '100%',
			backgroundColor: '#c2c2c2',
			bottom: 0 ,
			layout: 'vertical',
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
					
					var whateverIcon = Ti.UI.createImageView({
						width: '80%',
						image: 'images/whateverIcon.png'
					});
					leftTextAreaButton.add(whateverIcon);
				
					leftTextAreaButton.addEventListener('click', function(e){
						hintLabel.hide();
						textArea.setValue('Up for Whatever');
						checkIfGo();
					});
					
				var textArea = Ti.UI.createTextArea({
					left: '2%',
					width: '66%',
					height: Titanium.UI.SIZE,
					font: {fontFamily: 'AvenirNext-Regular',
							fontSize: 16},
					color: 'black'
				});
					
					textArea.addEventListener('change', function(e){
						checkIfGo();
						if(this.getValue() > ""){
							hintLabel.hide();
							
						}else{
							hintLabel.show();
						}
					});
					
					var hintLabel = Ti.UI.createLabel({
						left: 6,
						font: {fontFamily: 'AvenirNext-Regular',
								fontSize: 16},
						color: 'gray',
						text: "Start the conversation..."
					});
					textArea.add(hintLabel);
					
						hintLabel.addEventListener('click', function(){
							textArea.focus();
						});
					
					var rightTextAreaButton = Ti.UI.createButton({
						left: 0,
						height: 53,
						width: Titanium.UI.FILL,
						top: 2,
					    bottom: 2,
					    touchEnabled: false
					});
					
						var goLabel = Ti.UI.createLabel({
						text: "Go!",
						color: '#D3D3D3',
						font: {fontFamily: 'AvenirNext-Bold',
									fontSize: 20}
						});
						
						rightTextAreaButton.add(goLabel);
			
						//goButton listener to send the createConversationRequest
						rightTextAreaButton.addEventListener('click', sendRequest);
			
				var createConversationRequest = {invitedUsers: []};
				var emptyArray = [];	
				
		createCommentView.add(leftTextAreaButton);
		createCommentView.add(textArea);
		createCommentView.add(rightTextAreaButton);
	createCommentHolder.add(createCommentView);
mainViewContainer.add(createCommentHolder);
		
		//Listen for the keyboard event
			
			var animation1 = Ti.UI.createAnimation();
			var animation2 = Ti.UI.createAnimation();
			var animation3 = Ti.UI.createAnimation();
			
			Ti.App.addEventListener('keyboardframechanged', function(e){
				
				if(e.keyboardFrame.y >= config.winHeight)
				{
						animation1.bottom = 0;
						animation2.bottom = createCommentHolder.size.height;
						animation3.bottom = createCommentHolder.size.height + 10;
				}
				else
				{
					animation1.bottom = e.keyboardFrame.height;
					animation2.bottom = e.keyboardFrame.height + createCommentHolder.size.height;
					animation3.bottom = animation2.bottom + 10;
				}
				
				animation1.duration = e.animationDuration * 1000;
				animation2.duration = e.animationDuration * 1000;	
				
				createCommentHolder.animate(animation1);
				commentsScrollView.animate(animation2);
				startLabel.animate(animation3);
				commentsScrollView.scrollToBottom();
				
			});
			
			//this ensures the createCommentHolder doesn't get 'stuck' up at keyboard height
			Ti.App.addEventListener('pause', function(e)
			{
				textArea.blur();
			});
					
	
	var closeButton = Ti.UI.createLabel({
		width: Titanium.UI.SIZE,
		top: '1.5%',
		right: '2.5%',
		height: '5%',
	});
		
		//set up closeButton
		var nevermindLabel = Ti.UI.createLabel({
			text: "Nevermind",
			font: {fontSize: 13,
					fontFamily: 'AvenirNext-Regular'},
			color: 'gray',
			top: 0,
			right: 0,
			verticalAlign: Titanium.UI.TEXT_ALIGNMENT_TOP
		});
		
		closeButton.addEventListener('click', function(e){
			Ti.App.fireEvent('app:cardRaised', {raised: false});
			
			var animation = Titanium.UI.createAnimation();
				animation.top = '101%';
				animation.duration = 250;
				
				card.animate(animation, function(){
					parentView.remove(card);
				});
		});	
	
		closeButton.add(nevermindLabel);
	card.add(closeButton);
	
	mainViewContainer.add(commentsScrollView);
	
	var addFriendsButtonViewHolder = Ti.UI.createView({
		top: 0,
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		backgroundColor: '#c2c2c2'
	});
	
		var addFriendsButtonView = Ti.UI.createView({
			top: 0,
			bottom: 1,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			layout: 'vertical',
			backgroundColor: 'white'
		});
		
			var whoLabel = Ti.UI.createLabel({
				top: 5,
				font: ({fontFamily: 'AvenirNext-DemiBold',
						fontSize: 16}),
				color: 'black',
				text: 'Who do you want to hang out with?'	
			});
			addFriendsButtonView.add(whoLabel);
			
			var addFriendsButton = Ti.UI.createButton({
				top: 10,
				bottom: 10,
				width: '75%',
				height: 50,
				borderColor: config.purple,
				borderWidth: 1,
				borderRadius: 10,
				title: 'Add People',
				color: config.purple
			});
			
				addFriendsButton.addEventListener('click', function(){
					this.setColor('white');
					this.setBackgroundColor(config.purple);
					addFriendsButtonHandler();
				});
			
			addFriendsButtonView.add(addFriendsButton);
		addFriendsButtonViewHolder.add(addFriendsButtonView);
	mainViewContainer.add(addFriendsButtonViewHolder);
	
	//Add friends button click
	function addFriendsButtonHandler(){
		textArea.blur();
		card.removeEventListener('swipe', lowerCard);
		addView = new AddFriends(card, friends, addFriendsInitialCallback);
			var animation1 = Ti.UI.createAnimation({
				top: 0,
				duration: 250,
				delay: 250
			});
				
				animation1.addEventListener('complete', function(){
					addFriendsButton.setBackgroundColor('white');
					addFriendsButton.setColor(config.purple);
				});
			mainViewContainer.add(addView);
			addView.animate(animation1);
	}
		
		
		//Listen to update # of friends label as user picks in AddFriends
		card.addEventListener('updateFriendsLabel', function(e)
		{
			numberFriendsLabel.text = e.count + ' friends';
		});
		
		var membersViewContainer = Ti.UI.createView({
			width: Ti.UI.FILL,
			top: 0,
			height: Ti.UI.SIZE,
			backgroundColor: 'white'
		});
		
		var membersView;
		var membersViewArgs = {};
			membersViewArgs.creatingConvo = true;
			membersViewArgs.height; card.size.height * .11;
			membersViewArgs.mainViewContainer = mainViewContainer;
			membersViewArgs.users = [];
		
		//callback from AddFriends 'done' button click
		function addFriendsInitialCallback(selectedPeople)
		{
			if (selectedPeople.length > 0)
			{
				
				for (i = 0; i < selectedPeople.length; i++)
				{
						createConversationRequest.invitedUsers.push(selectedPeople[i].userId);
						Ti.API.info('addFriendsCallback: ' + JSON.stringify(selectedPeople[i]));
				}
				
				mainViewContainer.remove(addFriendsButtonViewHolder);
				
				mainViewContainer.add(membersViewContainer);
				
				membersViewArgs.height = card.size.height * .11;
				membersViewArgs.users = selectedPeople;
				
				membersView = new MembersView(membersViewArgs, addMoreCallback);
				membersView.setBottom(10);
				membersViewContainer.add(membersView);
					
				var line = Ti.UI.createView({
					bottom: 0,
					height: 1,
					width: Ti.UI.FILL,
					backgroundColor: 'gray'
				});
				membersViewContainer.add(line);
				
				checkIfGo();
			}
			addView.animate({top: '101%', duration: 250, delay: 250}, function(){
					mainViewContainer.remove(addView);
			});
			card.addEventListener('swipe', lowerCard);
		}
		
			function addMoreCallback()
			{
				addView = new AddFriends(card, friends, addedMoreCallback);
				mainViewContainer.add(addView);
				addView.animate({top: 0, duration: 250, delay: 250}, function(){
					mainViewContainer.remove(membersView);
				});
			}
		
				function addedMoreCallback(addedPeople)
				{
					//check if addedPeople are already there.
					for(a=0; a < addedPeople.length; a++)
					{
						var check = createConversationRequest.invitedUsers.indexOf(addedPeople[a].userId);
						
						if(check == -1)  //if userId doesn't already exist on request, add it.
						{
							createConversationRequest.invitedUsers.push(addedPeople[a].userId);
							membersViewArgs.users.push(addedPeople[a]);
						}
					}	
					Ti.API.info('args length = ' + membersViewArgs.users.length);
					membersView = new MembersView(membersViewArgs, addMoreCallback);
					membersView.setBottom(10);
					membersViewContainer.add(membersView);
						
					addView.animate({top: '101%', duration: 250, delay: 250}, function(){
							mainViewContainer.remove(addView);
					});
				}
		
	var animationSwitch = false;
	var whateverAnimationSwitch = false;
	
	function checkIfGo()
	{
		if (createConversationRequest.invitedUsers.length > 0 && textArea.getValue() > "")
		{
			whateverAnimationSwitch = false;
			
			if (!animationSwitch)
			{
				rightTextAreaButton.setTouchEnabled(true);
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
		}else if(createConversationRequest.invitedUsers.length > 0 && textArea.getValue() == ""){
			highlightWhateverButton();
			rightTextAreaButton.setTouchEnabled(false);
			animationSwitch = false;
			goLabel.setColor('#D3D3D3');
			goLabel.setOpacity(1.0);
		}else{
			rightTextAreaButton.setTouchEnabled(false);
			animationSwitch = false;
			goLabel.setColor('#D3D3D3');
			goLabel.setOpacity(1.0);
		}	
	}			
	
	function highlightWhateverButton(){
		
				whateverAnimationSwitch = true;
				
				var animation = Ti.UI.createAnimation({
					opacity: 0.2,
					duration: 800
				});
				
				var animationReverse = Ti.UI.createAnimation({
					opacity: 1.0,
					duration: 800
				});
					animationReverse.addEventListener('complete', function(e){
						if (whateverAnimationSwitch)
						{
							whateverIcon.animate(animation);
						}
					});
				
					animation.addEventListener('complete', function(e)
					{
						whateverIcon.animate(animationReverse);
					});
				
				whateverIcon.animate(animation);
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
				var addCommentRequest = {conversationId: response.conversationId, userId: response.userId, type: "USERCREATED",comment: createConversationRequest.topic };
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
	
				

return card;
};

module.exports = CreateCard;
	
