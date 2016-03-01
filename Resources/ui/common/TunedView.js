/**
 * This pops-up above the createCommentHolder when the user toggles the stay tuned function
 */

function TunedView()
{
	var tunedView = Ti.UI.createView({
		width: '33%',
		height: Ti.UI.SIZE,
		layout: 'vertical',
		backgroundColor: 'orange'
	});
	
		tunedView.addEventListener('postlayout', function(){
			this.setBorderRadius(this.size.height / 2);
		});
	
		var titleLabel = Ti.UI.createLabel({
			top: 0,
			text: 'Staying Tuned',
			color: 'black'
		});
	
	return tunedView;
}

module.exports = TunedView;