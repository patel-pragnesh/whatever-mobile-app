/**
 * @author Cole Halverson
 */

function MemberView(user, parentWidth)
{
	var httpClient = require('lib/HttpClient');
	var account = Ti.App.properties.getObject('account');
	var userProfileWindow = require('ui/common/UserProfileWindow');
	
	
	var view = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: parentWidth * .22,
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
			layout: 'vertical'
		});
	
	view.add(pictureAndName);	
	
	var picture = Ti.UI.createImageView({
		width: '80%',
		top: '1%',
		backgroundColor: '#D3D3D3',
		borderColor: '#D3D3D3',
		borderWidth: 1,
		opacity: 0.0
	});
				
		picture.addEventListener('postlayout', function(){
			this.removeEventListener('postlayout', arguments.callee);
			this.setHeight(this.size.width);
			this.setBorderRadius(this.size.width / 2);
			getProfile();
			
		});			
	pictureAndName.add(picture);
	
		var statusIcon = Ti.UI.createImageView({
			width: '30%',
			top: '6.5%',
			right: 0,
			zIndex: 2,
			borderColor: '#D3D3D3',
			borderWidth: 1
		});
		
			statusIcon.addEventListener('postlayout', function(){
				this.setBorderRadius(this.size.height / 2);
			});
			
			setStatus(user.status);
	
			
			function setStatus(status){
				if(status == "IN"){
					statusIcon.setImage('images/imInIndicator');
					statusIcon.show();
				}else if (status == "OUT"){
					statusIcon.setImage('images/imOutIndicator');
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
						picture.animate({opacity: 1.0, duration: 50});
					}else{
						Ti.App.addEventListener('app:refresh', function(){
							this.removeEventListener('app:refresh', arguments.callee);
							getProfile();
						});
					}
				});
			}
		}
					
				
				
	var memberName = Ti.UI.createLabel({
		top: 3,
		width: '90%',
		height: Ti.UI.SIZE,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		ellipsize: Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END
	});
				
		memberName.addEventListener('postlayout', function(){
			this.removeEventListener('postlayout', arguments.callee);
			this.setFont({fontSize: view.size.width * .15,
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
			else if (!memberName.text)
			{
				var req = {userId: user.userId};
								
				httpClient.doPost('/v1/getUser', req, function(success, response){
					if(success){
						memberName.setText(response.firstName);
					}else{
						Ti.App.addEventListener('app:refresh', function(){
							this.removeEventListener('app:refresh', arguments.callee);
							getName();
						});
					}
				});
			}
		}
					
		
	return view;
}

module.exports = MemberView;