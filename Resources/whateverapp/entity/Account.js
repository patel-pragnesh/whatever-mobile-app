function Account()
	{
	// The account id
	var id;
	
	// The profile image url
	var profileImageUrl;
	
	// The device ids for push notification
	var deviceIds;
	
	// The language - such as en
	var language;
	
	// The country - such as US
	var country;
	
	// The first name of the account user
	var firstName;
	
	// The last name of the account user
	var lastName;
	
	// The email address
	var email;
	
	// The account password / lock code
	var password;
	
	this.setId = function(_id)
		{
		this.id = _id;
		};
	
	this.getId = function()
		{
		return this.id;
		};
		
	this.setProfileImageUrl = function(_profileImageUrl)
		{
		this.profileImageUrl = _profileImageUrl;
		};
	
	this.setProfileImageUrl = function()
		{
		return this.profileImageUrl;
		};
		
	this.setLanguage = function(_language)
		{
		this.language = _language;
		};
	
	this.getLanguage = function()
		{
		return this.language;
		};
		
	this.setCountry = function(_country)
		{
		this.country = _country;
		};
	
	this.getCountry = function()
		{
		return this.country;
		};
		
	this.setFirstName = function(_firstName)
		{
		this.firstName = _firstName;
		};
	
	this.getFirstName = function()
		{
		return this.firstName;
		};
		
	this.setLastName = function(_lastName)
		{
		this.lastName = _lastName;
		};
	
	this.getLastName = function()
		{
		return this.lastName;
		};
		
	this.setEmail = function(_email)
		{
		this.email = _email;
		};
	
	this.getEmail = function()
		{
		return this.email;
		};
		
	this.setDeviceIds = function(_deviceIds)
		{
		this.deviceIds = _deviceIds;
		};
		
	this.getDeviceIds = function()
		{
		return this.deviceIds;
		};
		
	this.setPassword = function(_password)
		{
		this.password = _password;
		};
		
	this.getPassword = function()
		{
		return this.password;
		};
	};
	
module.exports = Account;
