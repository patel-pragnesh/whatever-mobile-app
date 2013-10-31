function Device()
	{
	var platformType;
	var deviceId;
	
	this.setPlatformType = function(_platformType)
		{
		this.platformType = _platformType;
		}
	
	this.getPlatformType = function()
		{
		return this.platformType;
		}
		
	this.setDeviceId = function(_deviceId)
		{
		this.deviceId = _deviceId;
		}
	
	this.getDeviceId = function()
		{
		return this.deviceId;
		}
	};

module.exports = Device;