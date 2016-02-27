/**
 * @author Cole Halverson
 */

function MembersView(args)
{
	var httpClient = require('lib/HttpClient');
	var MemberView = require('ui/common/MemberView');
	
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
			zIndex: 1,
			visible: false
		});
		
			var extrasCircle = Ti.UI.createView({
				top: 0,
				width: '75%',
				backgroundColor: '#d3d3d3'
			});
			
				extrasCircle.addEventListener('postlayout', function(e){
					this.setHeight(this.size.width);
					this.setBorderRadius(this.size.height / 2);
				});
			
				var extrasLabel = Ti.UI.createLabel({
					color: 'black'
				});
					
		extrasView.addEventListener('postlayout', function(){
			extrasLabel.setFont({fontSize: this.size.width * .18,
							fontFamily: 'AvenirNext-DemiBold'});
		});
					
			extrasCircle.add(extrasLabel);
			extrasView.add(extrasCircle);
		holder.add(extrasView);
		
		var currentMembers = args.users;
		
		createMembers(0);
		
		holder.addEventListener('updateMembers', function(e){
			//e is an array of userConversations.  this event is fired from ConvoCard when it recieves update event from RefreshUtility
			if(e.users != currentMembers)
			{
				var startIndex = e.users.length - currentMembers.length;
				currentMembers = e.users;
				
				//if there are new members add them
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
				//Are there more than 4 members besides the creator?  If so, we will need the extrasView
				if (currentMembers.length > 5)
				{
					var extras = true;
				}else{
						extrasView.hide();
				}
				
				var count = (currentMembers.length > 5) ? 4 : currentMembers.length;
				
				for (i = startIndex; i < count; i++)
				{
					if (currentMembers[i].type != "CREATOR"){
						var memberView = new MemberView(currentMembers[i]);
						if(i == 3 && extras)
						{
							extrasLabel.setText("+ " + (currentMembers.length - 4));
							extrasView.show();
						}
						profiles.add(memberView);
						Ti.API.info('addMember');
					}
					
					
				}
				
			
		}
		
	
	return holder;
}

module.exports = MembersView;