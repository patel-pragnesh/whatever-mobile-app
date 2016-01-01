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
			
		});
		card.add(profileViewRow);	
	
	var mainViewContainer = Ti.UI.createView({
		top: '12%',
		width: '100%',
		height: Titanium.UI.FILL,
		layout: 'absolute',
		backgroundColor: 'gray'
		});
		card.add(mainViewContainer);
		
		
		
			var commentsScrollView = Ti.UI.createScrollView({
				top: 0,
				width: '100%',
				height: Ti.UI.FILL,
				zIndex: 1,
				backgroundColor: 'white'
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
		
		containerHeight = card.size.height;
		containerWidth =  card.size.width;
		
		
		
		profileCircleDia = containerWidth * .145;
		profileCircleRadius = profileCircleDia / 2;
		friendCircleDia = containerWidth * .10;
		friendCircleRadius = friendCircleDia / 2;
		
		
	//// Set up profileViewRow
	var creatorProfilePic = Ti.UI.createImageView ({
			top: 0,
			left: '4%',
			width: profileCircleDia,
			height: profileCircleDia,
			borderRadius: profileCircleRadius
			});
			
			profileViewRow.add(creatorProfilePic);
	
					var creatorLabel = Ti.UI.createLabel({
						left: '21%',
						top: '3%',
						font: {fontSize: 21,
							   fontFamily: 'OpenSans-SemiBold'},
						color: 'black'
					});
					profileViewRow.add(creatorLabel);
		
					var extraLabelsView = Ti.UI.createView({
						left: '22%',
						bottom: '3%',
						height: Ti.UI.SIZE,
						width: Ti.UI.SIZE,
						layout: 'horizontal'
					});
					
					profileViewRow.add(extraLabelsView);
		
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
						text: "# friends",
						font: {fontSize: 15,
							   fontFamily: 'OpenSans-Light'},
						color: purple,
						left: 2
					});
					extraLabelsView.add(numberFriendsLabel);
	
	
	//set up friendsViewRow
	var friendsViewRow = Ti.UI.createView({
			top: 0,
			height: containerHeight * .064,
			width: '100%',
			backgroundColor: 'white',
			layout: 'horizontal',
			zindex: 10				
			});
					
			
	/**
	var cancelBtn = Ti.UI.createImageView ({
		image: '/images/cancelCreateCard',
		top: '1%',
		right: '2%',
		height : Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		});
		card.add(cancelBtn);
		
		cancelBtn.addEventListener('click', function(e){
			card.hide();
			Ti.API.info('happened');
		});	
	*/
	
	var cancelLabel = Ti.UI.createLabel({
		text: "Nevermind",
		font: {fontSize: 13,
				fontFamily: 'OpenSans-Regular'},
		color: purple,
		top: '1.5%',
		right: '2.5%'	
	});
	
	cancelLabel.addEventListener('click', function(e){
		var animation = Titanium.UI.createAnimation();
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
	creatorProfilePic.image = '/images/profilePic';
	creatorLabel.text = 'You';
	
	mainViewContainer.layout = 'vertical';

	friendsViewRow.height = '10%';
	
	var number1Label = Ti.UI.createLabel
	({
		text: '1.',
		color: 'black',
		font: {fontSize: 25,
				fontFamily: 'OpenSans-Semibold'},
		left: '3%'
	});
	
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
			text: '1.  Add Friends',
			color: purple,
			font: {fontSize: 15,
					fontFamily: 'OpenSans-Semibold'
					}	
		});
		
	//Click Add Friends button, choose, then call PopulateFriendsRow function
	
	addFriendsButton.addEventListener('click', function(e){
		var addView = new AddFriends();
		card.add(addView);
	});
		addFriendsButton.add(buttonLabel);
	
	friendsViewRow.add(addFriendsButton);
	
	commentsScrollView.height = '70%';
	
	mainViewContainer.add(friendsViewRow);
	
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
	commentsScrollView.add(startConversationButton);
	
	mainViewContainer.add(commentsScrollView);
	
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
	
	
	
	
	//card.addEventListener('what the add friends view fires when click done button, function(e){
			//if (e.people.length > 0){}
	//})
	
	
} else {
	
	Ti.API.info('convo key = ' + cardArgs.convoKey);
	
	
	card.addEventListener('postlayout', function(e)
	{
		card.removeEventListener('postlayout', arguments.callee);
			
			var animation = Titanium.UI.createAnimation();
				animation.top = 0;
				animation.duration = 200;
					
				card.animate(animation);	
	});
	
	
	mainViewContainer.add(commentsScrollView);
	mainViewContainer.add(dissapearingView);
	
dissapearingView.addEventListener('postlayout', function(e){
	dissapearingView.removeEventListener('postlayout', arguments.callee);
	dissapearingView.top = dissapearingView.size.height * -1;
});
	
	dissapearingView.add(friendsViewRow);
			//call PopulateFriendsRow Function	
			PopulateFriendsRow();
				
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
	
	
	
	
	
	
	
		}
	

	
		
					
					
		
				
	function PopulateFriendsRow(){
					
		var friendCircles = Ti.UI.createView({
			left: '6%',
			height: '100%',
			width: '45%',
			});
			friendsViewRow.add(friendCircles);
		
		var friendsPic = Ti.UI.createImageView ({
			image: '/images/profilePic',
			left: 0,
			hieght: friendCircleDia,
			width: friendCircleDia,
			borderRadius: friendCircleRadius,
			});
			friendCircles.add(friendsPic);
		
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
		
		var commentsView = require('ui/common/CommentsBuilder').buildComments(containerWidth);
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
	
