/**
 * @author Cole Halverson
 */

exports.checkIfBlockedUser = function(userId){
	
	var account = Ti.App.Properties.getObject("account");
	
	Ti.API.info(userId);
	Ti.API.info('blocklist ' + account.blockList);
	
	if(account.blocklist)
	{
		if (account.blockList.indexOf(userId) == -1){
			Ti.API.info('blocked ' + false);
			return false;
		}else{
			Ti.API.info('blocked ' + true);
			return true;
		}
	}else{
		//if account.blockList doesn't exist, create it
		account.blockList = [];
		Ti.App.Properties.setObject('account', account);
		
		return false;
	}
	
};



