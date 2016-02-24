/**
 * @author Cole Halverson
 */

function MembersView(args)
{
	var httpClient = require('lib/HttpClient');
	var MemberView = require('ui/common/MemberView');
	
	var holder = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: args.height,
		top: 0,
		//backgroundColor: 'orange',
	});
	
	var scrollView = Ti.UI.createScrollView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		//backgroundColor: 'blue'
	});
	holder.add(scrollView);
		
	scrollView.addEventListener('postlayout', populate);
		
		var scrollViewContainer = Ti.UI.createView({
			left: 0,
			height: Ti.UI.FILL,
			width: Ti.UI.SIZE,
			//backgroundColor: 'pink',
			layout: 'horizontal',
			horizontalWrap: false
		});
		scrollView.add(scrollViewContainer);
		
	
	function populate()
	{
		scrollView.removeEventListener('postlayout', populate);
		
		//make sure the scrollViewContainer is atleast big enough to force scrollView to scroll.
		scrollViewContainer.addEventListener('postlayout', function(){
			if (scrollViewContainer.size.width <= scrollView.size.width)
				{
					scrollViewContainer.setWidth(scrollView.size.width + 1);
				}
		});
		
		var inviteView = Ti.UI.createView({
			left: 0,
			height: Ti.UI.FILL,
			width: '22%',
			layout: 'vertical',
			//backgroundColor: 'orange'
		});
		
			var inviteButton = Ti.UI.createImageView({
				top: "5%",
				width: '70%',
				image: 'images/inviteButton'
			});
			inviteView.add(inviteButton);
			
			var inviteLabel = Ti.UI.createLabel({
				top: 6,
				text: 'Add More'
			});
			inviteView.add(inviteLabel);
		
		inviteView.addEventListener('postlayout', function(){
			inviteLabel.setFont({fontSize: inviteView.size.width * .15,
									fontFamily: 'AvenirNext-Medium'});
		});
			
		scrollViewContainer.add(inviteView);
		
		var currentMembers = args.users;
		
		createMembers(0);
		
		holder.addEventListener('updateMembers', function(e){
			//e is an array of userConversations.  this event is fired from ConvoCard when it recieves update event from RefreshUtility
			if(e.users != currentMembers)
			{
				var startIndex = e.users.length - currentMembers.length;
				currentMembers = e.users;
				
				if(startIndex != 0){
					createMembers(startIndex);
				}
				//Listener for this is in each MemberView to update the icon.  Cant find a better way to do this without making a separate httpRequest
				for (j = 0; j < currentMembers.length; j++)
				{
					Ti.App.fireEvent('app:UpdateUserConversation' + currentMembers[j].userConversationId, {status: currentMembers[j].status});
				}
			}
		});
		
		
		function createMembers(startIndex)
		{
				for (i = startIndex; i < currentMembers.length; i++)
				{
					var memberView = new MemberView(currentMembers[i], scrollView.size.width);
					scrollViewContainer.add(memberView);
				}
				holder.animate({opacity: 1.0, duration: 50});
		}
		
	}
		
	return holder;
}

module.exports = MembersView;