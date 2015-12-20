/**
 * @author Cole Halverson
 */
function OldAddFriends(friendsContext){
	
	config = require('config');
	
	var friendsCard = Ti.UI.createView({
		hieght: '100%',
		width: '100%',
		backgroundColor: 'green'
		
	});
	
	var addView = Ti.UI.createView({
		backgroundColor: 'red',
		height: '100%',
		width: '70%',
		right: 0,
		layout: 'vertical'
	});
		
		var contactsList = Ti.UI.createListView({
			backgroundColor: 'white',
			width: '100%',
			
			
		});
	
	
	
	var cancelBtn = Ti.UI.createImageView ({
		image: '/images/cancelCreateCard',
		top: '1%',
		right: '2%',
		height : Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		zindex: 4
		});
		friendsCard.add(cancelBtn);
		
		cancelBtn.addEventListener('click', function(e){
			friendsCard.hide();
			
		});	
	


	var search;
	var people = [];
	
	
	// Create the List View Templates
	var mainTemplate = 
		{
		childTemplates: [
			{
			type: 'Ti.UI.Label',
			bindId: 'contact',
			properties:
				{
				left: 10,
				height: 50,
				width: Ti.UI.SIZE,
				font:
					{
					fontSize: 16,
					fontFamily: config.opensans_light
					},
				color: '#3e3e3e'
				}
			}]
		};
	
	
	var listView = Ti.UI.createListView({
		templates: {'main': mainTemplate},
		defaultItemTemplate: 'main',
		caseInsensitiveSearch: true
		});
	
	// Handle the list view platform differences
	if(config.platform === config.platform_iphone || Ti.Platform.Android.API_LEVEL < 11)
		{
		search = Ti.UI.createSearchBar({
			showCancel: true,
			top: 0
			});
			
		search.addEventListener('cancel', function()
			{
			search.blur();
			});
			
		search.addEventListener('change', function(e)
			{
			listView.searchText = e.value;
			});
		}
	else
		{
		search = Ti.UI.Android.createSearchView({
			hintText: L('search_contacts')
			});
			
		search.addEventListener('change', function(e)
			{
			listView.searchText = e.source.value;
			});
		}
		
		if(config.platform === config.platform_android)
		{
		listView.left = 10;
		listView.right = 10;
		}
		
	
	addView.add(search);


// Match the Apple design guidelines for the inset on the separator
	// Align with template content since that does not happen automatically	
	if(config.platform === config.platform_iphone)
		{
		listView.separatorInsets = {left: 10};
		}
	else
		{
		listView.separatorColor = '#eaebeb';
		}	








	
	
	//Get contacts authorization and populate people array
	Ti.Contacts.requestAuthorization(function(e){
		if (e.success){
			Ti.API.info('populate');
			people =	Titanium.Contacts.getAllPeople();
			Ti.API.info(people.length);
			
			populateContactsList();
			
		}else{
			
			
		}
		
	});
	

	
	var sectionTitle = null;
			var sections = [];
			var data = [];	
	
	
	var createSectionHeader = function(title)
		{
			Ti.API.info('createSectionHeader');
		var view = Ti.UI.createView({
			height: 30
			});
			
		if(config.platform === config.platform_iphone)
			{
			view.backgroundColor = '#eaebeb';
			}
			
		var text = Ti.UI.createLabel({
			text: title,
			left: 10,
			font:
				{
				fontSize: 16,
				fontFamily: config.opensans_bold
				},
			color: '#999999'
			});
			
		view.add(text);
		return view;
		};
		
		function createSection(sectionTitle, data)
		{
			Ti.API.info('createSection');
		var section = Ti.UI.createListSection({
			items: data,
			headerView: createSectionHeader(sectionTitle)
			});
	
		return section;
		}
		
		
			
			for (var i = 0; i < people.length; i++)
				{
				if(!sectionTitle)
					{
					sectionTitle = people[i].fullName.charAt(0).toLowerCase();
					}
				else if(sectionTitle !== people[i].fullName.charAt(0).toLowerCase())
					{
					// Add a section
					sections.push(createSection(sectionTitle.toUpperCase(), data));
					data = [];
					
					// New section title
					sectionTitle = people[i].fullName.charAt(0).toLowerCase();
					}
				
				data.push({
					contact:
						{
						text: people[i].fullName
						},
					properties: 
						{
						itemId: people[i].identifier,
						phone: people[i].phone.mobile,
						searchableText: people[i].fullName,
						selectedBackgroundColor: '#fafafa',
						accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
						}
					});
				
				// Add the last section
				if(i == people.length - 1)
					{
					sections.push(createSection(sectionTitle.toUpperCase(), data));
					}
				}
			
			listView.sections = sections;
		
			
			function validateSelectedNumber(name, phoneNumber, callback)
				{
				if(phoneNumber.length < 7)
					{
					alert(String.format(L('invalid_phone_number_selected'), phoneNumber, name));
					callback(false, null);
					}
				else if(phoneNumber.length == 7)
					{
					// Assume same area code as user
					var areaCode = account.phone_number.substring(1,4);
					
					var opts = {};
					opts.options = [L('No'), L('Yes')];
					
					var dialog = Ti.UI.createAlertDialog({
						buttonNames: [L('No'), L('Yes')],
						message: String.format(L('phone_number_missing_area_code'), name, areaCode + phoneNumber)
						});
					
					dialog.addEventListener('click', function(e)
						{
						if(e.index == 0)
							{
							callback(false, null);
							}
							
						if(e.index == 1)
							{
							callback(true, '1' + areaCode + phoneNumber);
							}
						});
						
					dialog.show();
					}
				else if(phoneNumber.length == 10)
					{
					callback(true, '1' + phoneNumber);
					}
				else
					{
					callback(true, phoneNumber);
					}
				}
		
	
		}	
	
	listView.addEventListener('itemclick', itemClickEvent);
		
	addView.add(listView);

	friendsCard.add(addView);

	
	
function itemClickEvent(itemEvent)	
	{
		listView.removeEventListener('itemclick', itemClickEvent);
		
		var item = itemEvent.section.getItemAt(itemEvent.itemIndex);
		item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
		itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
		
		Ti.API.info(JSON.stringify(item));
		
		if(item.properties.phone.length == 0)
			{
			alert(String.format(L('contact_missing_mobile_phone_number'), item.contact.text));
			
			item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
			itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
			
			listView.addEventListener('itemclick', itemClickEvent);
			}
		else if(item.properties.phone.length > 1)
			{
				
				
			
					validateSelectedNumber(item.contact.text, dialogEvent.source.options[dialogEvent.index], function(valid, phoneNumber)
						{
						if(valid)
							{
							callback(item.contact.text, phoneNumber);
							}
						else
							{
							item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
							itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
							
							listView.addEventListener('itemclick', itemClickEvent);
							}
						});
		
		
			}
	
		
			
				
			
				
	
	
	
	
	
	
	
	
	
	
return 	friendsCard;
}

module.exports = OldAddFriends;
