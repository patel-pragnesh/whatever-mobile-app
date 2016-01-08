/**
 * @author Cole Halverson
 */

function MembersView(args)
{
	var membersView = Ti.UI.createView({
		top: '7%',
		bottom: 0,
		width: '100%',
		backgroundColor: 'white'
	});
		
		var membersList = Ti.UI.createView({
			height: '80%',
			width: '100%',
			top: 0
		});
		membersView.add(membersList);
			var membersScrollView = Ti.UI.createView({
				width: '100%',
				height: Titanium.UI.SIZE,
				top: 0,
				layout: 'vertical'
			});
		
		var backButton = Ti.UI.createView({
			bottom: '5%',
			left: '5%',
			height: '10%',
			width: '20%'
		});
			var backLabel = Ti.UI.createLabel({
				text: 'Back',
				font: {fontSize: 20,
						fontFamily: 'OpenSans-Semibold'},
				color: 'black'
			});
		backButton.add(backLabel);
		backButton.addEventListener('click', function(e){
			args.parentView.remove(membersView);
		});
		var addMoreButton = Ti.UI.createView({
			bottom: '5%',
			right: '5%',
			height: '10%',
			width: Titanium.UI.SIZE
		});
		
			var addMoreLabel = Ti.UI.createLabel({
				text: 'Add More',
				font: {fontSize: 20,
						fontFamily: 'OpenSans-Semibold'},
				color: 'black'
			});
		addMoreButton.add(addMoreLabel);
		
		membersView.add(backButton);
		membersView.add(addMoreButton);
		
	if (args.context == 'new')
	{
		for (i = 0; i < args.selectedNames.length; i++ )
		{
			var personRow = Ti.UI.createView({
				width: '100%',
				height: 30,
				top: 0
			});
				var personLabel = Ti.UI.createLabel({
					text: args.selectedNames[i],
					color: 'black',
					height: Ti.UI.SIZE,
					width: Ti.UI.SIZE,
					left: 10
				});
				personRow.add(personLabel);
				membersScrollView.add(personRow);
		}
		
	}
	else
	{
		
	}
	
	membersList.add(membersScrollView);
	return membersView;
}

module.exports = MembersView;