

function CardsView()
{
	var container = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		top: 0,
		opacity: 0.0
	});
	
	function containerPostlayout()
	{
		container.animate({opacity: 1.0, duration: 400});
	}
	
	container.addEventListener('postlayout', containerPostlayout);
	
	return container;
}

module.exports = CardsView;