/**
 * @author Cole Halverson
 */

			
function BubViewConstructor(winHeight, winWidth, parentView, conversation)  
{
			var config = require('config');
			var httpClient = require('/lib/HttpClient');
			var purple = config.purple;
			var account = Ti.App.properties.getObject('account');


			var bubbleAttribute = 2;
			var bubViewHeight = winWidth * .43;   //winHeight * .221;
			var bubViewWidth = winWidth * .43;     //.421;
			var bubDiameter = bubViewHeight * .932;
			var bubBorder = bubDiameter *.04;
			var buttonBottom = winHeight * .032;
	
			var bubViewTop = conversation.top_y * bubViewHeight;               //get from DB 
			var bubPosition = conversation.position;
			var convoKey = conversation.conversationId;
			var createdBy = conversation.userId;
			var newInfo = conversation.new_info;
			var inStatus = conversation.localUserStatus;
			var status = conversation.status;
			
			var bubView = Ti.UI.createView({
				width: bubViewWidth,
				height: bubViewHeight,
				top: bubViewTop,
				bottom: 10,
				bubConvoKey: convoKey,
				opacity: 0.0,
				//backgroundColor: 'orange',
				clipMode: Titanium.UI.iOS.CLIP_MODE_DISABLED,
				zIndex: 104 - conversation.row
			});
Ti.API.info('conversation:  ' + JSON.stringify(conversation));
	
	//postlayout listener to tell mainWindow to create a card view for this conversation
	bubView.addEventListener('postlayout', function(e){
		this.removeEventListener('postlayout', arguments.callee);
		//bubView.setHeight(bubView.size.width);
		Ti.App.fireEvent('app:createcard', conversation);
		mask.setWidth(mask.size.height);
		bubView.setBorderRadius(bubViewWidth / 2);
		bubView.setViewShadowColor('#2f2f2f');
		bubView.setViewShadowOffset({x:2, y:3});
		bubView.fireEvent('startRotate');
		
		Ti.API.info(bubView.size.width + "    "  + bubView.size.height);
		
		
		var time = setTimeout(function(){
			bubView.animate({opacity: 1.0, duration: 400});
			picture.add(bubShadeMask);
			bubShadeMask.animate({opacity: 0.45, duration: 1000});
		}, 500);
		
	});
	
	//listener to tell the parent view to delete this
	Ti.App.addEventListener('app:DeleteBubble:' + convoKey, function(e){
		Ti.API.info('delete event recieved');
		Ti.App.removeEventListener('app:DeleteBubble:' + convoKey, arguments.callee);
		parentView.remove(bubView);
	});
	
	
	
	//listener to tell appropriate cardView to rise when this is clicked	
	bubView.addEventListener('click', function(e)
	{
		Ti.App.fireEvent('app:raisecard:' + convoKey);
		commentIndicator.hide();
	});
			
	//position the bubView
	if (bubPosition == 'left')
	{
		bubView.left = '2%';
	}
	else if (bubPosition == 'right')
	{
		bubView.right = '2%';
	}
			
			
			var picture = Ti.UI.createImageView
				({				
				backgroundColor: '#D3D3D3',
				borderColor: 'white',
				borderWidth: 0,
				height: '95%',     
				width: Ti.UI.SIZE
				});
				
				picture.addEventListener('postlayout', function()
				{
					picture.removeEventListener('postlayout', arguments.callee);
					picture.setWidth(picture.size.height);
					picture.setBorderRadius(picture.size.height / 2);
					getProfile();
				});
				
				Ti.App.addEventListener('updateProfilePicture', getProfile);
			
				function getProfile()
				{
					if (account.id == createdBy && config.profileFile.exists()){
						picture.setImage(config.profileFile.read());
					}
					else if (account.id != createdBy && !picture.getImage()){
						httpClient.doMediaGet('/v1/media/' + createdBy + '/PROFILE/profilepic.jpeg', function(success, response){
							if(success){
								picture.setImage(Ti.Utils.base64decode(response));
							}else{
								Ti.App.addEventListener('app:refresh', function(){
									this.removeEventListener('app:refresh', arguments.callee);
									getProfile();
								});
							}
						});
					}
				}
			bubView.add(picture);
			
			var mask = Ti.UI.createImageView({
				image: 'images/mask',
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				visible: false
			});
			bubView.add(mask);
			
			var spinMask = Ti.UI.createImageView({
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				image: 'images/spinMask',
				visible: false
			});
			bubView.add(spinMask);
			
			if(status == "OPEN")
			{
				itsOpen();
			}else if (status == "IT_IS_ON" ){
				itsHappening();
			}
			
			var spin;	
			
			function itsOpen()
			{
				mask.hide();
				spinMask.show();
				spin = true;
				var t = Ti.UI.create2DMatrix();	
					
				function startRotate()											
				{		
						var a = Titanium.UI.createAnimation();
						t = t.rotate(2);
						a.transform = t;
						a.duration = 15;
						
						
					if(spin)
					{
						a.addEventListener('complete', startRotate);
					}
						spinMask.animate(a);
				}
			
			
				bubView.addEventListener('startRotate', function(e){
					startRotate();
				});			
			}
			
			function itsHappening()
			{
				spinMask.hide();
				spin = false;
				mask.show();
			}
			
			var bubShadeMask = Ti.UI.createImageView
			({
				backgroundColor: 'black',
				opacity: 0.45,
				width: Titanium.UI.FILL,
				height: '35%',
				bottom: 0
			});
			
			var name = Ti.UI.createLabel({
				color: 'white',
				font: {fontSize: bubDiameter *  0.1,     //.094,
					   fontFamily: 'AvenirNext-DemiBold'},
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				bottom: '18%',
				width: Ti.UI.SIZE, 
				height: Ti.UI.SIZE,
				zIndex: 3,
				opacity: 1.0,
			});
				
			picture.add(name);
				
				var namePopulated = false;
				if (createdBy == account.id)
				{
					name.setText('You');
					namePopulated = true;
				}else{
					getCreator();
				}
			
				
				function getCreator()
				{
					var request = {userId: createdBy};
					httpClient.doPost('/v1/getUser', request, function(success, response){
						Ti.API.info(JSON.stringify(response));
						if (success)
						{
							name.setText(response.firstName);
							namePopulated = true;
						}
					});
				}
			
			var commentIndicator = Ti.UI.createImageView({
				image: '/images/commentIndicatorBlue',
				top: '2.5%',
				right: '14%',
				height: '20.5%',
				width: Titanium.UI.SIZE,
				zIndex: bubbleAttribute,
			});
			bubView.add(commentIndicator);
			
			var inStatusIndicator = Ti.UI.createImageView({
				top: '24%',
				right: 0,
				height: '20.5%',
				width: Titanium.UI.SIZE,
				zIndex: bubbleAttribute
			});
				if(inStatus == "IN"){inStatusIndicator.setImage('images/imInIndicator');}
				else if(inStatus == "OUT"){inStatusIndicator.setImage('images/imOutIndicator');}
				else{inStatusIndicator.hide();}
			bubView.add(inStatusIndicator);
	
	//Accelerometer stuff
	Ti.Accelerometer.addEventListener('update', accelerometerCallback);
	
	Ti.App.addEventListener('pause', function(){
		Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
	});
	Ti.App.addEventListener('paused', function(){
		Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
	});
	
	Ti.App.addEventListener('resume', function(){
		Ti.Accelerometer.addEventListener('update', accelerometerCallback);
	});
	Ti.App.addEventListener('resumed', function(){
		Ti.Accelerometer.addEventListener('update', accelerometerCallback);
	});
	
	function accelerometerCallback(e)
	{
		y = (e.y * 6) * -1;
		x = e.x * 6;
		bubView.setViewShadowOffset({x: x ,y: y});
	}
	Ti.App.addEventListener('app:UpdateBubble:' + convoKey, function(e){
		//check if the happening status has changed
		if (e.status > "" && e.status != status)
		{
			if(e.status == "IT_IS_ON")
			{
				itsHappening();
			}
			else if (e.status == "OPEN")
			{
				itsOpen();
			}
		}
		
		if(e.localUserStatus > "" && e.localUserStatus != inStatus)
		{
			if(e.localUserStatus == "IN"){inStatusIndicator.setImage('images/imInIndicator'); inStatusIndicator.show();}
				else if(e.localUserStatus == "OUT"){inStatusIndicator.setImage('images/imOutIndicator'); inStatusIndicator.show();}
				else{inStatusIndicator.hide();}
			inStatus = e.localUserStatus;
		}
		
		if (e.newComments)
		{
			commentIndicator.show();
		}
		
		if (!namePopulated)
		{
			getCreator();
		}
		
	});	
		
	return bubView;
};
	
module.exports = BubViewConstructor;