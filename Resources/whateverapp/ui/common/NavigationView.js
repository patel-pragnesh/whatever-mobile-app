exports.create = function(view, args, callback)
	{
	var navigationView = Ti.UI.createView({
		backgroundColor: 'purple',
		top: 0,
		height: 44,
		width: '100%',
		layout: 'horizontal'
		});
		
	/*
	 * ToolBtn will open/close the Toolbox when pressed depending if it 
	 * is open or closed
	 */
	var toolButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: 'black',
		backgroundColor: 'gray',
		left: 10, top: 2,
		width: 40, height: 40,
		title: '',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius: 0,
		borderColor: 'white'
		});
	
	navigationView.toolButton = toolButton;
	
	navigationView.add(toolButton);
	
	return navigationView;
	};