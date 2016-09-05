/**
 * @author Cole Halverson
 */

			
function BubViewConstructor(winHeight, winWidth, parentView, conversation)  
{
			var config = require('config');
			var httpClient = require('/lib/HttpClient');
			var moment = require('lib/Moment');
			var cardViewUtil = require('/lib/CardViewUtility');
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
			var happeningTime = conversation.happeningTime;
			var lastActivity = conversation.lastActivity;
			
			
			var bubViewHolder = Ti.UI.createView({
				width: bubViewWidth,
				height: bubViewHeight,
				top: bubViewTop,
				bottom: 10,
				opacity: 0.0,
				clipMode: Titanium.UI.iOS.CLIP_MODE_DISABLED,
				zIndex: 104 - conversation.row
			});
			
			
			var bubView = Ti.UI.createView({
				width: Ti.UI.FILL,
				height: Ti.UI.FILL,
				bubConvoKey: convoKey,
				opacity: 1.0,
				clipMode: Titanium.UI.iOS.CLIP_MODE_DISABLED,
				zIndex: 104 - conversation.row
			});
			bubViewHolder.add(bubView);
			
	
	//postlayout listener to tell mainWindow to create a card view for this conversation
	bubViewHolder.addEventListener('postlayout', function(e){
		this.removeEventListener('postlayout', arguments.callee);
		Ti.App.fireEvent('app:createcard', conversation);
		mask.setWidth(mask.size.height);
		bubView.setBorderRadius(bubViewWidth / 2);
		bubView.setViewShadowColor('#2f2f2f');
		bubView.fireEvent('startRotate');
		
		var time = setTimeout(function(){
			bubViewHolder.animate({opacity: 1.0, duration: 400});
			bubShadeMask.animate({opacity: 0.45, duration: 1000});
		}, 300);
		
	});
	
	//listener to tell the parent view to delete this
	Ti.App.addEventListener('app:DeleteBubble:' + convoKey, function(e){
		Ti.App.removeEventListener('app:refresh', setTimeLabel);
		Ti.App.removeEventListener('app:DeleteBubble:' + convoKey, arguments.callee);
		parentView.remove(bubViewHolder);
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
		bubViewHolder.left = '2%';
	}
	else if (bubPosition == 'right')
	{
		bubViewHolder.right = '2%';
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
			
			var nameAndShadeView = Ti.UI.createView({
				width: '98%'
			});
			
			nameAndShadeView.addEventListener('postlayout', function(){
				this.setHeight(this.size.width);
				this.setBorderRadius(this.size.width / 2);
			});
				var bubShadeMask = Ti.UI.createImageView
				({
					backgroundColor: 'black',
					opacity: 0.45,
					width: Titanium.UI.FILL,
					height: '35%',
					bottom: 0
				});
			nameAndShadeView.add(bubShadeMask);
			
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
			nameAndShadeView.add(name);
					
					var namePopulated = false;
					if (createdBy == account.id)
					{
						name.setText('You');
						namePopulated = true;
					}else{
						getCreator();
					}
			
		bubView.add(nameAndShadeView);
		
				function getCreator()
				{
					var request = {userId: createdBy};
					httpClient.doPost('/v1/getUser', request, function(success, response){
					
						if (success)
						{
							name.setText(response.firstName);
							namePopulated = true;
						}
					});
				}
			
			var mask = Ti.UI.createImageView({
				image: 'images/Mask',
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
			
			var happeningIndicator = Ti.UI.createView({
				top: '20%',
				left: 0,
				height: '20%',
				width: Ti.UI.SIZE,
				layout: 'horizontal',
				backgroundColor: 'white',
				visible: false
			});
			
				happeningIndicator.addEventListener('postlayout', function(){
					this.removeEventListener('postlayout', arguments.callee);
					this.setBorderRadius(this.size.height / 2);
					timeLabel.setFont({fontFamily: 'AvenirNext-Regular',
										fontSize: this.size.height * .4});
				});
			
				var clock = Ti.UI.createImageView({
					top: '12%',
					bottom: '12%',
					left: 1,
					image: 'images/clock'
				});
				happeningIndicator.add(clock);
				
				var timeLabel = Ti.UI.createLabel({
					left: 1,
					bottom: '22%',
					color: 'black'
				});
				happeningIndicator.add(timeLabel);
			bubView.add(happeningIndicator);
			
				function setTimeLabel()
				{
					var blankString = "";
					var string = cardViewUtil.buildTimeString(blankString, happeningTime, true) + "  ";
					
					return string;
				}
			
			if(status == "OPEN")
			{
				itsOpen();
			}else if (status == "IT_IS_ON" ){
				itsHappening();
			}
			
			var spin;	
			
			function itsOpen()
			{
				bubView.setOpacity(getOpacityFromAge());
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
				bubView.setOpacity(1.0);
				spinMask.hide();
				spin = false;
				mask.show();
				timeLabel.setText(setTimeLabel());
				
				Ti.App.addEventListener('app:refresh', setTimeLabel);
				
				happeningIndicator.show();
			}
			
			var commentIndicator = Ti.UI.createImageView({
				top: '2.5%',
				right: '14%',
				height: '20%',
				image: '/images/commentIndicatorBlue',
				zIndex: bubbleAttribute
			});
			bubView.add(commentIndicator);
			
			var inStatusIndicator = Ti.UI.createImageView({
				top: '23%',
				right: -5,
				height: '20%',
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
		y = (e.y * 7) * -1;
		x = e.x * 7;
		bubView.setViewShadowOffset({x: x ,y: y});
	}
	
	function getOpacityFromAge()
	{
		var now = moment();
		var thisLastActivity = moment(lastActivity);
		
		if(now.diff(thisLastActivity, 'hours') >= 15)
		{
			return 0.7;
		}else{
			return 1.0;
		}
	}
	
	Ti.App.addEventListener('app:UpdateBubble:' + convoKey, function(e){
		//check if the happening status has changed
		if (e.status > "" && e.status != status)
		{
			if(e.status == "IT_IS_ON")
			{
				happeningTime = e.happeningTime;
				itsHappening();
			}
			else if (e.status == "OPEN")
			{
				itsOpen();
			}
		}
		
		lastActivity = e.lastActivity;
		
		if(e.status == "OPEN")
		{
			bubView.setOpacity(getOpacityFromAge());
		}
		
		//check if happeningTime has changed
		if(e.happeningTime != happeningTime)
		{
			happeningTime = e.happeningTime;
			setTimeLabel();
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
		
	return bubViewHolder;
};
	
module.exports = BubViewConstructor;