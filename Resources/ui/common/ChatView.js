/**
 * @author Cole Halverson
 */

function ChatView()
{
	var chatView = Ti.UI.createView({
		top: 0,
		bottom: '10%',
		width: '100%',
		backgroundColor: '#F7F5FA',        
		layout: 'vertical'
	});
	
	
	return chatView;
}

module.exports = ChatView;