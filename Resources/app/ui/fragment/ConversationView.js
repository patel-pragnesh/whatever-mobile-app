/**
 * Create a conversation view
 * 
 * @param {Object} args
 */
exports.create = function(conversation)
	{
	var config = require('app/config');
	var moment = require('lib/moment');
		
	var conversation = Ti.UI.createView({
		top: 0,
		bottom: 0,
		left: 10,
		right: 10,
		layout: 'vertical'
		});
	
	var timeIndicatorImageView = Ti.UI.createImageView({
		image: '/images/time-indicator-up-arrow.png',
		top: 5,
		width: 30,
		height: 15
		});
		
	conversation.add(timeIndicatorImageView);
	
	var conversationHeaderView = Ti.UI.createView({
		backgroundColor: 'white',
		top: 0,
		height: 40
		});
		
	var eventTimeContainerView = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE
		});
		
	var eventTimeLabel = Ti.UI.createLabel({
		color: '#333333',
		font:
			{
			fontSize: 16,
			fontFamily: config.opensans_bold
			},
		text: '12:30 pm'
		});
	
	eventTimeContainerView.add(eventTimeLabel);
	conversationHeaderView.add(eventTimeContainerView);
	
	var eventDayLabel = Ti.UI.createLabel({
		color: '#333333',
		font:
			{
			fontSize: 14,
			fontFamily: config.opensans_regular
			},
		left: 10,
		text: 'Wednesday'
		});
	
	conversationHeaderView.add(eventDayLabel);
	
	var extrasButton = Ti.UI.createButton({
	    backgroundImage: '/images/conversation-extras.png',
	    backgroundSelectedImage: '/images/conversation-extras-selected.png',
	    top: 0,
		height: 40,
		width: 40,
		right: 0
	    });
	    
	conversationHeaderView.add(extrasButton);
		
	conversation.add(conversationHeaderView);
	
	var conversationHeaderSeparatorView = Ti.UI.createView({
		backgroundColor: '#CBCACC',
		top: 0,
		height: 1
		});
		
	conversation.add(conversationHeaderSeparatorView);
	
	var conversationScrollableView = Ti.UI.createScrollView({
		backgroundColor: 'transparent',
		showVerticalScrollIndicator: false,
		showHorizontalScrollIndicator: false,
		width: '100%',
		top: 0,
		bottom: 50
		});
		
	if(config.platform === 'iphone')
		{
		conversationScrollableView.disableBounce = true;
		}
		
	var conversationContainerView = Ti.UI.createView({
		backgroundColor: 'white',
		width: '100%',
		top: 0,
		height: Ti.UI.SIZE,
		layout: 'vertical'
		});
	
	var conversationProfileView = Ti.UI.createView({
		width: '100%',
		top: 0,
		height: 60
		});
		
	var profileImageViewContainer = Ti.UI.createView({
		backgroundColor: '#EDEDED',
		top: 10,
		width: 40,
		height: 40,
		left: 10
		});
		
	var profileImageNameLabel = Ti.UI.createLabel({
		color: '#999999',
		font:
			{
			fontSize: 18,
			fontFamily: config.opensans_light
			},
		text: 'TH'
		});
		
	profileImageViewContainer.add(profileImageNameLabel);
	conversationProfileView.add(profileImageViewContainer);
	
	var profileNameLabel = Ti.UI.createLabel({
		color: '#333333',
		font:
			{
			fontSize: 16,
			fontFamily: config.opensans_semibold
			},
		left: 60,
		right: 10,
		text: 'Theophrastus Von Hohenheim'
		});
		
	// No wrap with ellipsize if name is too long
	if(config.platform === config.platform_android)
		{
		profileNameLabel.wordWrap = false;
		profileNameLabel.ellipsize = true;
		}
	else
		{
		profileNameLabel.minimumFontSize = 14;
		}
		
	conversationProfileView.add(profileNameLabel);
	
	conversationContainerView.add(conversationProfileView);
	
	var conversationMessageView = Ti.UI.createView({
		width: '100%',
		top: 0,
		height: Ti.UI.SIZE
		});
		
	var messageLabel = Ti.UI.createLabel({
		color: '#333333',
		font:
			{
			fontSize: 14,
			fontFamily: config.ptserif_regular
			},
		left: 10,
		right: 10,
		text: 'Getting the conversation started about doing whatever, with whatever in whatever. So we should make some conversation and figure out what we should do. I want to do whatever.'
		});
		
	conversationMessageView.add(messageLabel);
	conversationContainerView.add(conversationMessageView);
	
	var conversationActionView = Ti.UI.createView({
		top: 15,
		left: 10,
		right: 10,
		height: Ti.UI.SIZE
		});
		
	function joinConversation()
		{
		Ti.API.info('Joining Conversation');
		}
		
	var joinButton = require('/app/ui/common/ImageButtonView').create({
		button: {
			backgroundColor: '#E4E3E6',
			backgroundSelectedColor: '#CAC8CE',
			borderRadius: 5,
			width: '48%',
			left: 0,
			height: 40
			},
		text: L('join'),
		color: '#666666',
		font:
			{
			fontSize: 14,
			fontFamily: config.opensans_bold
			},
		image: {
			image: '/images/join-button-icon.png',
			width: 15,
			height: 14
			}
		}, joinConversation);
		
	conversationActionView.add(joinButton);
	
	function stayTuned()
		{
		Ti.API.info('Stay Tuned');
		}
	
	var stayTunedButton = require('/app/ui/common/ImageButtonView').create({
		button: {
			backgroundColor: '#E4E3E6',
			backgroundSelectedColor: '#CAC8CE',
			borderRadius: 5,
			width: '48%',
			right: 0,
			height: 40
			},
		font:
			{
			fontSize: 14,
			fontFamily: config.opensans_bold
			},
		text: L('stay-tuned'),
		color: '#666666',
		image: {
			image: '/images/stay-tuned-button-icon.png',
			width: 23,
			height: 15
			}
		}, stayTuned);
		
	conversationActionView.add(stayTunedButton);
	
	conversationContainerView.add(conversationActionView);
	
	var conversationJoinedView = Ti.UI.createView({
		width: '100%',
		top: 15,
		left: 10,
		right: 10,
		height: Ti.UI.SIZE,
		layout: 'horizontal'
		});
		
	for(var h = 0; h < 5; h++)
		{
		var joinedHeadView = Ti.UI.createView({
			backgroundColor: '#EDEDED',
			height: 36,
			width: 36,
			left: (h == 0 ? 0 : 5),
			borderRadius: 18
			});
			
		var joinedHeadLabel = Ti.UI.createLabel({
			color: '#999999',
			font:
				{
				fontSize: 16,
				fontFamily: config.opensans_light
				},
			text: 'TC'
			});
			
		joinedHeadView.add(joinedHeadLabel);
			
		conversationJoinedView.add(joinedHeadView);
		}
		
	conversationContainerView.add(conversationJoinedView);
	
	var conversationCommentView = Ti.UI.createView({
		width: '100%',
		top: 10,
		height: Ti.UI.SIZE,
		layout: 'vertical'
		});
		
	for(var c = 0; c < 5; c++)
		{
		var commentContainerView = Ti.UI.createView({
			backgroundColor: '#F6F6F6',
			width: '100%',
			height: Ti.UI.SIZE,
			layout: 'vertical'
			});
			
		var commentTopDecoratorView = Ti.UI.createView({
			backgroundColor: '#BFBFBF',
			width: '100%',
			top: 0,
			height: 1
			});
			
		commentContainerView.add(commentTopDecoratorView);
		
		var commentProfileView = Ti.UI.createView({
			width: '100%',
			top: 0,
			height: 60
			});
			
		var commentProfileImageViewContainer = Ti.UI.createView({
			backgroundColor: 'white',
			top: 10,
			width: 40,
			height: 40,
			left: 10
			});
			
		var commentProfileImageNameLabel = Ti.UI.createLabel({
			color: '#999999',
			font:
				{
				fontSize: 18,
				fontFamily: config.opensans_light
				},
			text: 'ES'
			});
			
		commentProfileImageViewContainer.add(commentProfileImageNameLabel);
		commentProfileView.add(commentProfileImageViewContainer);
		
		var commentatorView = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			layout: 'horizontal'
			});
			
		var commentatorNameLabel = Ti.UI.createLabel({
			color: '#333333',
			font:
				{
				fontSize: 14,
				fontFamily: config.opensans_semibold
				},
			left: 60,
			right: 10,
			text: 'Eric Schmidt'
			});
			
		// No wrap with ellipsize if name is too long
		if(config.platform === config.platform_android)
			{
			commentatorNameLabel.wordWrap = false;
			commentatorNameLabel.ellipsize = true;
			}
		else
			{
			commentatorNameLabel.minimumFontSize = 14;
			}
			
		commentatorView.add(commentatorNameLabel);
		
		var commentTimeLabel = Ti.UI.createLabel({
			color: '#666666',
			font:
				{
				fontSize: 11,
				fontFamily: config.opensans_light
				},
			left: 60,
			right: 10,
			text: 'Yesterday at 12:37 pm'
			});
			
		commentatorView.add(commentTimeLabel);
		commentProfileView.add(commentatorView);
		commentContainerView.add(commentProfileView);
		
		var commentLabel = Ti.UI.createLabel({
			color: '#333333',
			font:
				{
				fontSize: 12,
				fontFamily: config.opensans_regular
				},
			left: 10,
			right: 10,
			text: 'Well I believe that this is my comment and that is what I think. So I am writing this comment to make a comment.'
			});
			
		commentContainerView.add(commentLabel);
		
		var commentShim = Ti.UI.createView({
			width: '100%',
			height: 10
			});
			
		commentContainerView.add(commentShim);
		
		conversationCommentView.add(commentContainerView);
		}
		
	conversationContainerView.add(conversationCommentView);
	
	var bottomShim = Ti.UI.createView({
		backgroundColor: '#CBCACC',
		top: 0,
		height: 10,
		width: '100%'
		});
	
	conversationContainerView.add(bottomShim);
	conversationScrollableView.add(conversationContainerView);
	conversation.add(conversationScrollableView);
	
	return conversation;
	};