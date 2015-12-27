// /////// testing send push notification   ###########


btnImageView.addEventListener('click', function(e){
	
	var request = {};
	request.deviceIds = ['da249cb2afc0ee03b1225f5cd68f1e08e209ce28443dd4d4f6c56844655c4f71'];
	request.message = 'HelloWorld';
	request.payload = {};
	request.payload.event = 'helloworld';
	Ti.API.info(JSON.stringify(request));
	httpClient.doPost('/v1/sendPushNotification', request, function(success, response) {
		Ti.API.info(JSON.stringify(response));
		
		if(!success)
			{
			
			}
		});
	
});