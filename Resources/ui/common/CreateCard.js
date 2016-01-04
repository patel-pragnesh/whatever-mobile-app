/**
 * The card window
 * 
 * @param {Object} args
 * @param {Object} callback
 */

function CreateCard(parentView, cardArgs, mainContainerHeight)
	{
	
	var config = require('config');
		
	var purple = config.purple;
	
	var AddFriends = require('ui/common/AddFriends');
	
		
		
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
		layout: 'horizontal',
		//backgroundColor: 'blue'
			
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
				backgroundColor: '#f3f3f3'
				});
				mainViewContainer.add(commentsScrollView);
				
				commentsScrollView.addEventListener('touchstart', function(e){
						textArea.blur();
				});
		
		var createCommentHolder = Ti.UI.createView({
			height: Titanium.UI.SIZE,
			width: '100%',
			backgroundColor: '#c2c2c2',
			bottom: 0 
		});
		
		var createCommentView = Ti.UI.createView({
			//bottom: 0,
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
				//backgroundColor: 'blue'
			});
			
				var whateverIcon = Ti.UI.createImageView({
					width: '80%',
					image: 'images/whateverIcon.png'
				});
				leftTextAreaButton.add(whateverIcon);
				
			var textArea = Ti.UI.createTextArea({
				left: '2%',
				width: '66%',
				height: Titanium.UI.SIZE,
				//backgroundColor: 'red',
				value: "What are you trying to do?...",
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
				
				textArea.addEventListener('blur', function(e){
					
					if (textArea.getValue() == ""){
						textArea.setColor('gray');
						textArea.setValue("What are you trying to do?...");
					}
					
				});
				var goButton = Ti.UI.createView({
					left: 0,
					height: 53,
					width: Titanium.UI.FILL,
					top: 2,
				    bottom: 2,
					//backgroundColor: 'orange'
				});
					var goLabel = Ti.UI.createLabel({
						text: "Go!",
						color: 'gray',
						//color: '#21BF55',
						font: {fontFamily: 'OpenSans-Bold',
								fontSize: 20}
					});
				goButton.add(goLabel);
			createCommentView.add(leftTextAreaButton);
			createCommentView.add(textArea);
			createCommentView.add(goButton);
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
				
	
	var dissapearingView = Ti.UI.createView({
		top: 0,
		width: '100%',
		height: Ti.UI.SIZE,
		backgroundColor: 'white',
		layout: 'vertical',
		zIndex: 3,
		backgroundColor: 'pink'
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
						text: "0 friends",
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
					
	
	var cancelLabel = Ti.UI.createLabel({
		text: "Nevermind",
		font: {fontSize: 13,
				fontFamily: 'OpenSans-Regular'},
		color: purple,
		top: 0,
		right: '2.5%',
		height: 30,
		verticalAlign: Titanium.UI.TEXT_ALIGNMENT_TOP
	});
	
	cancelLabel.addEventListener('click', function(e){
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
	
	card.add(cancelLabel);
	

//If context is creating a new conversation
if (cardArgs.context == 'new' )
{
	
	var createConversationRequest = {status: 'OPEN',
										invitedUsers: []};
		
	var account = Ti.App.properties.getObject('account');
	createConversationRequest.userId = account.id;
	
	creatorProfilePic.image = '/images/profilePic';
	creatorLabel.text = 'You';
	
	textArea.addEventListener('change', function(e){
		checkIfGo();
	});
	
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
		var addView = new AddFriends(card);
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
		
		//listen for event fired by AddFriends 'next' button click
		card.addEventListener('returnFromAddFriends', function(e)
		{
			Ti.API.info('e.selectedPeople = ' + e.selectedPeople);
			createConversationRequest.invitedUsers = e.selectedPeople;
				
			checkIfGo();
			
			friendsViewRow.remove(addFriendsButton);
			friendsViewRow.height = containerHeight * .064;
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
		
	
	
	var startConversationView = Ti.UI.createView({
		height: Titanium.UI.FILL,
		width: Titanium.UI.FILL,
		backgroundColor: 'orange'
	});
	var startConversationButton = Ti.UI.createView({
		left: '13%',
		right: '13%',
		height: '16%',
		top: '10%',
		borderWidth: 1.5,
		borderColor: 'gray',
		borderRadius: 7
	});
		
		var startConversationLabel = Ti.UI.createLabel({
			text: '2.  Start the Conversation',
			color: 'gray',
			font: {fontSize: 15,
					fontFamily: 'OpenSans-Semibold'
					}	
		});
		startConversationButton.add(startConversationLabel);
		startConversationView.add(startConversationButton);
	
	//commentsScrollView.add(startConversationView);
	
	
	function checkIfGo()
	{
		if (createConversationRequest.invitedUsers.length > 0  && textArea.getColor() == 'black' && textArea.getValue() > "")
		{
			goLabel.setColor('#21BF55');
			var goAnimation = Ti.UI.createAnimation({
				opacity: 0.2,
				duration: 800
			});
			goAnimation.addEventListener('complete', function(e)
			{
				goLabel.animate(goAnimationReverse);
			});
			
			var goAnimationReverse = Ti.UI.createAnimation({
				opacity: 1.0,
				duration: 800
			});
			goAnimationReverse.addEventListener('complete', function(e){
				goLabel.animate(goAnimation);
			});
			goLabel.animate(goAnimation);
			
		}
		
	}			
	
	
	/**
	var letsDoSomethingView = Ti.UI.createView({
		height: Titanium.UI.FILL,
		width: Titanium.UI.FILL,
		backgroundColor: 'white'
	});

		var doSomethingButton = Ti.UI.createView({
			height: '50%',
			right: '13%',
			left: '13%',
			top: '10%',
			borderWidth: 1.5,
			borderColor: 'gray',
			borderRadius: 7
		});
		
			
			var doSomethingLabel = Ti.UI.createLabel({
				text: "3.  Get it Started!",
				color: 'gray',
				font: {fontSize: 15,
					fontFamily: 'OpenSans-Semibold'
					}	
			});
			doSomethingButton.add(doSomethingLabel);
			letsDoSomethingView.add(doSomethingButton);
	mainViewContainer.add(letsDoSomethingView);
	
	*/
	
	
	//card.addEventListener('what the add friends view fires when click done button, function(e){
			//if (e.people.length > 0){}
	//})
	
	
} else {
	
	Ti.API.info('convo key = ' + cardArgs.convoKey);
	
	
	mainViewContainer.add(commentsScrollView);
	mainViewContainer.add(dissapearingView);
	
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
		
				var arrow = Ti.UI.createImageView({
					image: '/images/CloseIconTopRightOfCard',
					bottom: 1,
						
				});
				collapseView.add(arrow);
				
			
			//call FillComments function	
			FillComments();
			
	
	
	
	/**
	
	
	if (cardContext == 'yours'){
			//IF cardContext = OPENING YOURS
				creatorProfilePic.image = '/images/profilePic';
				creatorLabel.text = 'You';
		
		
			}
	
	
	if (cardContext == 'thiers'){
			//IF cardContext = OPENING THIERS
				creatorProfilePic.image = '/images/joe';
				creatorLabel.text = 'Joe McMahon';
		
		
		
		
			}
	
	*/
	
	
	
	
	
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
		
		
		var inviteMoreLabel = Ti.UI.createLabel({
			text: "Invite more",
			color: purple,
			left: '5%',
			font: {fontSize: 13,
					fontFamily: 'OpenSans-Regular'}
			});						
			friendsViewRow.add(inviteMoreLabel);			
					
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
		
		
		
											
	
	function FillComments (){
		
		var commentsView = require('ui/common/CommentsBuilder').buildComments(containerWidth, containerHeight);
		commentsScrollView.add(commentsView);
	}
	
		
};  //end of populate function



function flipMembersView(){
	mainViewContainer.add(membersView);
	if (cardArgs.context == 'new'){
		ShowAddFriendsView();
	}
}

function populateMembersView(){
	var selectedPeople = AddFriends.selectedPeople;
	
		for (i = 0; i < selectedPeople.length; i++){
			var personView = Ti.UI.createView({
				width: '100%',
				height: '10%',	
			});
				
				var personLabel = Ti.UI.createLabel({
					text: selectedPeople[i]
				});
			
		}
	
}

function ShowAddFriendsView(){
		
	}	
	

	
return card;
};

module.exports = CreateCard;
	
