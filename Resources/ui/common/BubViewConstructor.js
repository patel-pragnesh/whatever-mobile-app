/**
 * @author Cole Halverson
 */

var config = require('config');
var httpClient = require('/lib/HttpClient');
var purple = config.purple;
var account = Ti.App.properties.getObject('account');

			
function BubViewConstructor(winHeight, winWidth, parentView, conversation)  
		{

			var bubbleAttribute = 2;
			var bubViewHeight = winHeight * .221;
			var bubViewWidth = winWidth * .421;
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
				bubConvoKey: convoKey,
				opacity: 0.0
			});
Ti.API.info('conversation:  ' + JSON.stringify(conversation));
	
	//postlayout listener to tell mainWindow to create a card view for this conversation
	bubView.addEventListener('postlayout', function(e){
		this.removeEventListener('postlayout', arguments.callee);
		Ti.App.fireEvent('app:createcard', conversation);
		mask.setWidth(mask.size.height);
		bubView.fireEvent('startRotate');
		
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
				image: '/images/profilePic',
				borderColor: 'white',
				borderWidth: 0,
				height: '95%',     //'93.2%',
				width: Ti.UI.SIZE
				});
				
				picture.addEventListener('postlayout', function()
			{
				picture.removeEventListener('postlayout', arguments.callee);
				picture.setWidth(picture.size.height);
				picture.setBorderRadius(picture.size.height / 2);
			});
			
			bubView.add(picture);
			
			var mask = Ti.UI.createImageView({
				image: 'images/mask',
				height: '98%',
				width: Ti.UI.SIZE,
				visible: false
			});
			bubView.add(mask);
			
			var spinMask = Ti.UI.createImageView({
				height: Ti.UI.FILL,
				width: Ti.UI.SIZE,
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
						t = t.rotate(3);
						a.transform = t;
						a.duration = 19;
						
						
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
				picture.setBorderWidth(1);
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
				font: {fontSize: bubDiameter * .094,
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
					//TODO: get picture from filesystem
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
				top: '2%',
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