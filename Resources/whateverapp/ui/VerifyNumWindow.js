/**
 * Opened after Signup Window
 * This window contains a button the user can press to verify his/her number
 */
function VerifyNumWindow(args, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');
	var MainWindow = require('whateverapp/ui/MainWindow');

	/*
	 * The main window
	 */
	var win = Ti.UI.createWindow({
		backgroundColor : '#222222',
		height : '100%',
		width : '100%',
		fullscreen : false,
		orientationModes : [Ti.UI.PORTRAIT]
		});

	if (config.platform === 'android')
		{
		win.navBarHidden = true;
		}
	else
		{
		win.borderRadius = 5;
		}

	var mainContainer = Ti.UI.createView({
		height: '100%',
		width: '100%',
		zIndex: 1
		});
		
	var notificationView = require('whateverapp/ui/common/NotificationView').create();
	
	var infoText = Ti.UI.createLabel({
		color: "#090",
		font: { fontSize: 15 },
		text: L("verify_text"),
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		top: '2%',
		width: Ti.UI.SIZE, height: Ti.UI.SIZE
		});
		
	mainContainer.add(infoText);
	
	/*
	 * Verify Button
	 * When Pressed, SMS Verification dialogue will be opened
	 * After the verification query returns successful, open Main window
	 * If failed, place red X on screen and ask to try again.
	 */
	var verifyBtn = Ti.UI.createButton({
		title: 'Verify My Number',
		top: '20%', left: '2%',
		width: '96%',
		height: '20%',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0,
		borderColor:'white'
		});
	
	verifyBtn.addEventListener('click', function(e)
		{
		verifyNumber();
		});
		
	mainContainer.add(verifyBtn);
	
	function verifyNumber()
		{
		Ti.API.info('Number Verified');
		
		var mainWindow = new MainWindow();
		
		function focusEvent(e)
			{
			mainWindow.removeEventListener('focus', focusEvent);
			win.close();
			};
			
		mainWindow.addEventListener('focus', focusEvent);
			
		mainWindow.open();
		}
	
	/*
	 * Add the containers to the window
	 * We define them above so they can be referenced prior to being added to the window
	 */
	win.add(mainContainer);
	win.add(notificationView);

	return win;
	};

module.exports = VerifyNumWindow;
