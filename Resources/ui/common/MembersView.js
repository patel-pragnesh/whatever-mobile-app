/**
 * @author Cole Halverson
 */

function MembersView(args, callback)
{
	var httpClient = require('lib/HttpClient');
	var MemberView = require('ui/common/MemberView');
	var MembersListView = require('ui/common/MembersListView');
	var AddFriends = require('ui/common/AddFriends');
	
	var holder = Ti.UI.createView({
		width: '92%',
		height: args.height,
		top: 5
	});
	
		var inviteView = Ti.UI.createView({
			left: 0,
			top: 0,
			height: Ti.UI.FILL,
			width: '20%',
			layout: 'vertical',
		});
		
			var inviteButton = Ti.UI.createImageView({
				top: 0,
				width: '75%',
				image: 'images/inviteButton'
			});
			inviteView.add(inviteButton);
			
			var inviteLabel = Ti.UI.createLabel({
				top: '3%',
				text: 'Add More'
			});
			inviteView.add(inviteLabel);
		
		inviteView.addEventListener('postlayout', function(){
			inviteLabel.setFont({fontSize: inviteView.size.width * .18,
									fontFamily: 'AvenirNext-Medium'});
		});
		
		inviteView.addEventListener('click', function(){
			callback();
		});
			
		holder.add(inviteView);
		
			var profiles = Ti.UI.createView({
				width: '80%',
				left: '20%',
				height: Ti.UI.FILL,
				layout: 'horizontal'
			});
		
		holder.add(profiles);
		
		//if more than 4 memberViews will be added to profiles, this covers the 4th one
		var extrasView = Ti.UI.createView({
			width: '20%',
			height: Ti.UI.FILL,
			right: 0,
			backgroundColor: 'white',
			zIndex: 2,
			visible: false
		});
		
			var extrasCircle = Ti.UI.createImageView({
				top: 0,
				width: '75%',
				image: 'images/blurry'
			});
			
				extrasCircle.addEventListener('postlayout', function(e){
					this.setHeight(this.size.width);
					this.setBorderRadius(this.size.height / 2);
				});
			
				var extrasLabel = Ti.UI.createLabel({
					color: 'white',
				});
		
		extrasView.addEventListener('click', function(){
				var membersListViewArgs = {};
					membersListViewArgs.mainViewContainer = args.mainViewContainer;
					membersListViewArgs.currentMembers = currentMembers;
				var membersListView = new MembersListView(membersListViewArgs);
				args.mainViewContainer.add(membersListView);
		});
				
		extrasView.addEventListener('postlayout', function(){
			extrasLabel.setFont({fontSize: this.size.width * .20,
							fontFamily: 'AvenirNext-Bold'});
		});
					
			extrasCircle.add(extrasLabel);
			extrasView.add(extrasCircle);
		holder.add(extrasView);
		
		var currentMembers = [];
		
		 function checkForUser(user){
				for(var u=0; u<currentMembers.length; u++){
					if(currentMembers[u].userId == user.userId){
						Ti.API.info("true");
						return true;
					}
				}
				Ti.API.info("false");
				return false;
			};
		
		createMembers(args.users);
		
		holder.addEventListener('updateMembers', function(e){
			//e is an array of userConversations.  this event is fired from ConvoCard when it recieves update event from RefreshUtility
			if(e.users != currentMembers)
			{
				createMembers(e.users);
				
				//Listener for this is in each MemberView to update the icon.  Cant find a better way to do this without making a separate httpRequest
				for (j = 0; j < currentMembers.length; j++)
				{
					Ti.API.info(currentMembers[j]);
					Ti.App.fireEvent('app:UpdateUserConversation' + currentMembers[j].userConversationId, {inStatus: currentMembers[j].inStatus, tunedStatus: currentMembers[j].tunedStatus});
				}
			}
		});
		
		
		function createMembers(members)
		{
				
				//Are there more than 4 members besides the creator?  If so, we will need the extrasView
				//check if the use context is creating a new conversation.  In which case there is no "CREATOR" in args.users
				var extras;
				if (args.creatingConvo && members.length > 4)
				{
					extras = true;
				}
				else if (members.length > 5)
				{
					extras = true;
				}
				else
				{
						extrasView.hide();
				}
				
				
				var count = (members.length > 5) ? 4 : members.length;
				
				for (i = 0; i < count; i++)
				{
					Ti.API.info("user = " + JSON.stringify(members[i]));
					if (members[i].type != "CREATOR" && !checkForUser(members[i])){
						var memberView = new MemberView(members[i]);
						if(i == 3 && extras)
						{
							if(args.creatingConvo)  //Because there is no "CREATOR" in the currentMembers when creating
							{
								extrasLabel.setText("+ " + (members.length - 3));
							}else{
								extrasLabel.setText("+ " + (members.length - 4));
							}
							extrasView.show();
						}
						profiles.add(memberView);
						currentMembers.push(members[i]);
					}
				}
		}
		
	
	return holder;
}

module.exports = MembersView;