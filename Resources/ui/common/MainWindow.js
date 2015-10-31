function MainWindow(conversations) {
	var config = require('config');
	var context = require('context');

	var moment = require('lib/Moment');
	var _ = require('lib/Underscore');
	var httpClient = require('lib/HttpClient');

	// Create the main window
	var win = Ti.UI.createWindow({
		backgroundColor: '#f5f5f5',
		width: '100%',
		height: '100%',
		orientationModes: [Ti.UI.PORTRAIT],
		//opacity: 0
		});

	if(config.platform === config.platform_android) {
		win.exitOnClose = true;
		}

	// The notification view has a zIndex that blocks the UI and provides an indicator
	var notificationView = require('ui/common/NotificationView').create();

	var mainContainerView = Ti.UI.createView({
		width: '100%',
		top: 0,
		bottom: 0,
		layout: 'vertical'
		});

	var scrollView = Ti.UI.createScrollView({
		contentWidth: 'auto',
  		contentHeight: 'auto',
		showVerticalScrollIndicator: false,
  		showHorizontalScrollIndicator: false,
		backgroundColor: 'gray',
		top: 70,
		bottom: 120,
		opacity: 0
		});

	var scrollViewContainer = Ti.UI.createView({
		backgroundColor: 'red',
		layout: 'vertical'
		});

	function createRow(index) {
		var row = Ti.UI.createView({
			index: index,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			layout: 'horizontal'
			});

		return row;
		}

	var conversations = [];

	function createConversationView(index) {
		var containerView = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			index: index
			});

		var conversation = Ti.UI.createView({

			});

		var label = Ti.UI.createLabel({
			text: index
			});

		conversation.add(label);

		containerView.add(conversation);

		return containerView;
		}

	for(var i = 0; i < 25; i++) {
		var conversationView = createConversationView(i);
		conversations.push(conversationView);
		}

	// Initialize the conversation rows
	var matrixXY = Math.ceil(Math.sqrt(conversations.length));
	var spiralArrayIndex = createSpiralArrayIndex(matrixXY);

	var rowColCount = (matrixXY % 2 != 0) ? matrixXY - 1 : matrixXY;

	for (y = 0; y < matrixXY; y++) {
		Ti.API.info(spiralArrayIndex[y].join(" "));
		}

	// Track what view we are creating
	var viewIndex = 0;
	var TOP_POS = 0, BOTTOM_POS = 1;

	for(var r = 0; r < matrixXY; r++) {
		var row = createRow(r);
		var topBottomPos = -1;

		if(r < rowColCount / 2) {
			topBottomPos = BOTTOM_POS;
			}
		else if(r > rowColCount / 2) {
			topBottomPos = TOP_POS;
			}

		for(var c = 0; c < matrixXY; c++) {
			var conversation = conversations[spiralArrayIndex[r][c]];

			if(conversation) {
				// if(c < rowColCount / 2) {
					// conversation.children[0].right = 0;
					// }
				// else if(c > rowColCount / 2) {
					// conversation.children[0].left = 0;
					// }
//
				// if(topBottomPos == TOP_POS) {
					// conversation.children[0].top = 0;
					// }
				// else if(topBottomPos == BOTTOM_POS) {
					// conversation.children[0].bottom = 0;
					// }

				row.add(conversation);
				Ti.API.info(JSON.stringify(conversation));
				}
			}

		scrollViewContainer.add(row);
		}

	scrollView.add(scrollViewContainer);
	mainContainerView.add(scrollView);

	win.add(mainContainerView);
	win.add(notificationView);

	var windowPostLayoutCallback = function(e) {
		win.removeEventListener('postlayout', windowPostLayoutCallback);

		var rowIndex = 0;
		var conversationViewHeight = 80;
		var conversationViewWidth = 90;

		for(var row in scrollViewContainer.children) {
			if(scrollViewContainer.children.length > 1) {
				if(rowIndex % 2 == 0) {
					scrollViewContainer.children[row].left = conversationViewWidth;
					}

				rowIndex++;
				}

			for(var conversation in scrollViewContainer.children[row].children) {
				scrollViewContainer.children[row].children[conversation].width = conversationViewWidth;
				//scrollViewContainer.children[row].children[conversation].border = 1;
				//scrollViewContainer.children[row].children[conversation].borderColor = 'black';
				scrollViewContainer.children[row].children[conversation].children[0].height = conversationViewHeight;
				scrollViewContainer.children[row].children[conversation].children[0].width = conversationViewHeight;
				scrollViewContainer.children[row].children[conversation].children[0].borderRadius = conversationViewHeight / 2;
				scrollViewContainer.children[row].children[conversation].children[0].border = 1;
				scrollViewContainer.children[row].children[conversation].children[0].borderColor = 'black';
				}
			}

		//scrollViewContainer.width = (conversationViewWidth * (rowColCount + 1)) + conversationViewWidth;


		// if(scrollViewContainer.children.length > 1) {
			// scrollViewContainer.width = (conversationViewWidth * (rowColCount + 1)) + conversationViewWidth;
			// }
		// else {
			// scrollViewContainer.width = (conversationViewWidth * rowColCount) + conversationViewWidth;
			// }

		scrollViewContainer.height = matrixXY * conversationViewHeight;

		// Now calculate if we need to center the view
		var scrollViewHeight = scrollView.rect.height;
		var scrollViewWidth = scrollView.rect.width;

		var scrollToX = 0;
		var scrollToY = 0;

		if(scrollViewContainer.width > scrollViewWidth) {
			scrollToX = (scrollViewContainer.width - scrollViewWidth) / 2;
			}

		if(scrollViewContainer.height > scrollViewHeight) {
			scrollToY = (scrollViewContainer.height - scrollViewHeight) / 2;
			}

		scrollView.scrollTo(scrollToX, scrollToY);
		scrollView.animate({opacity: 1, duration: 400});
		};

	win.addEventListener('postlayout', windowPostLayoutCallback);

	scrollView.addEventListener('scroll', function(e) {
		//scrollViewContainer.animate(animation);
		});

	var windowFocusCallback = function(e) {
		win.removeEventListener('focus', windowFocusCallback);

		// Register the device for push
		context.register();
		};

	win.addEventListener('focus', windowFocusCallback);

	function createSpiralArrayIndex(edge) {
		var arr = Array(edge);
		var x = 0;
		var y = edge;

		var total = edge * edge--;
		var dx = 1;
		var dy = 0;
		var i = total;
		var j = 0;

		//Ti.API.info(total);

		while (y) {
			arr[--y] = [];
			Ti.API.info(y);
			}

		while (i) {
			arr[y][x] = --i;

			//Ti.API.info('Array x:' + x + ' y:' + y + ' = ' + arr[y][x]);

			x += dx;
			y += dy;
			if (++j == edge) {
				if (dy < 0) {
					x++;
					y++;
					edge -= 2;
					}
				j = dx;
				dx = -dy;
				dy = j;
				j = 0;
				}
			}

		return arr;
		}

	return win;
	};

module.exports = MainWindow;