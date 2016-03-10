/**
 * @author Cole Halverson
 */

function MemberView(user)
{
	var httpClient = require('lib/HttpClient');
	var account = Ti.App.properties.getObject('account');
	var userProfileWindow = require('ui/common/UserProfileWindow');
	
	
	var view = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: '25%',
		left: 0
	});
	
		if (user.userId != account.id)
		{
			view.addEventListener('click', function(){
				var profileWin = new userProfileWindow(user.userId);
				profileWin.open();
			});
		}

		var pictureAndName = Ti.UI.createView({
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			top: 0,
			layout: 'vertical'
		});
	
	view.add(pictureAndName);	
	
	var picture = Ti.UI.createImageView({
		width: '75%',
		top: 0,
		opacity: 0.0,
		backgroundColor: '#d3d3d3'
	});
				
		picture.addEventListener('postlayout', function(){
			this.removeEventListener('postlayout', arguments.callee);
			this.setHeight(this.size.width);
			this.setBorderRadius(this.size.width / 2);
			this.animate({opacity: 1.0, duration: 250});
			getProfile();
		});			
	pictureAndName.add(picture);
	
		var statusIcon = Ti.UI.createImageView({
			width: '30%',
			top: '5%',
			right: '5%',
			zIndex: 2
		});
			
			setStatus(user.status);
	
			function setStatus(status){
				if(status == "IN"){
					statusIcon.setImage('images/inDot');
					statusIcon.show();
				}else if (status == "OUT"){
					statusIcon.setImage('images/outDot');
					statusIcon.show();
				}else{
					statusIcon.hide();
				}
			}
		
	view.add(statusIcon);
			
			//App listener to update this members status.  Not ideal, but I cant find a better way at the moment
			Ti.App.addEventListener('app:UpdateUserConversation' + user.userConversationId, function(e){
				setStatus(e.status);
			});
			
		function getProfile()
		{
			if (!picture.getImage()){
				httpClient.doMediaGet('/v1/media/' + user.userId + '/PROFILE/profilepic.jpeg', function(success, response){
					if(success){
						picture.setImage(Ti.Utils.base64decode(response));
					}else{
						Ti.App.addEventListener('app:refresh', function(e){
							Ti.App.removeEventListener('app:refresh', arguments.callee);
							getProfile();
						});
					}
				});
			}
		}
					
					
	var memberName = Ti.UI.createLabel({
		top: '4%',
		width: '95%',
		height: Ti.UI.SIZE,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		ellipsize: Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END
	});
				
		memberName.addEventListener('postlayout', function(e){
			this.removeEventListener('postlayout', arguments.callee);
			this.setFont({fontSize: view.size.width * .18,
							fontFamily: 'AvenirNext-Medium'});
			getName();
		});				
	pictureAndName.add(memberName);				
		
		function getName()
		{
			if (user.userId == account.id)
			{
				memberName.setText('You');
			}
			else
			{
				memberName.setText(user.userFirstName);
			}
		}
					
	return view;
}

module.exports = MemberView;