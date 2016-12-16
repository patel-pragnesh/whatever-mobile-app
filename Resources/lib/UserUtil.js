/**
 * @author Cole Halverson
 */

var account = Ti.App.Properties.getObject("account");

exports.checkIfBlockedUser = function(userId){
	Ti.API.info(userId);
	Ti.API.info('blocklist ' + account.blockList);
	
	if (account.blockList.indexOf(userId) == -1){
		Ti.API.info('blocked ' + false);
		return false;
	}else{
		Ti.API.info('blocked ' + true);
		return true;
	}
};
