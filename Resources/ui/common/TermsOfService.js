/**
 * @author Cole Halverson
 */

function TermsOfService(parentView){
	
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'TermsOfService.txt');
	var contents = f.read();

	Ti.API.info('Output text of the file: '+contents.text);
	
	var view = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		zIndex: 100
	});
	
	var blur = Titanium.UI.iOS.createBlurView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		effect: Titanium.UI.iOS.BLUR_EFFECT_STYLE_REGULAR,
		opacity: 0.5
	});
	view.add(blur);
	
	var webViewHolder = Ti.UI.createView({
		layout: 'vertical',
		height: '93%',
		width: '95%',
		borderRadius: 10,
		backgroundColor: '#efefef'
	});
	view.add(webViewHolder);
	
	var webView = Ti.UI.createWebView({
		top: 0,
		height: '90%',
		width: Ti.UI.FILL,
		html: contents.text,
		backgroundColor: 'white'
	});
	webViewHolder.add(webView);
	
	var close = Ti.UI.createLabel({
		top: 0,
		height: '10%',
		width: '90%',
		text: 'Close'
	});
	
		close.addEventListener('click', function(e){
			parentView.remove(view);
		});
	webViewHolder.add(close);
	
	return view;
}

module.exports = TermsOfService;