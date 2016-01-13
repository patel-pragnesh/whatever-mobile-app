function ContactsWindow(people, callback)
	{
	var config = require('config');
	var _ = require('lib/Underscore');
	var httpClient = require('lib/HttpClient');
	
	var account = Ti.App.Properties.getObject("account");
	
	var userId = null;
	
	// Create the main window
	var win = require('ui/common/Window').create();
	
	if(config.platform === config.platform_android)
		{
		win.addEventListener('androidback', function(e)
			{
			win.close();
			});
		}
	
	var windowPostLayoutCallback = function(e)
		{
		win.removeEventListener('postlayout', windowPostLayoutCallback);
		};
	
	win.addEventListener('postlayout', windowPostLayoutCallback);
	
	var mainContainerView = Ti.UI.createView({
		backgroundColor: 'white',
		height: '100%',
		width: '100%',
		layout: 'vertical'
		});
		
	var navViewArgs = {
		title: L('select_contact'),
		backgroundColor: '#eaebeb'
		};
		
	var navigationView = require('ui/common/NavigationView').create(navViewArgs, win);
	mainContainerView.add(navigationView);
	
	var search;
	
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
	
	mainContainerView.add(search);
	
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
		
	if(config.platform === config.platform_android)
		{
		listView.left = 10;
		listView.right = 10;
		}
	
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
	
	var createSectionHeader = function(title)
		{
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
		var section = Ti.UI.createListSection({
			items: data,
			headerView: createSectionHeader(sectionTitle)
			});
		
		return section;
		}
	
	var sectionTitle = null;
	var sections = [];
	var data = [];
	
	for (var i = 0; i < people.length; i++)
		{
		if(!sectionTitle)
			{
			sectionTitle = people[i].name.charAt(0).toLowerCase();
			}
		else if(sectionTitle !== people[i].name.charAt(0).toLowerCase())
			{
			// Add a section
			sections.push(createSection(sectionTitle.toUpperCase(), data));
			data = [];
			
			// New section title
			sectionTitle = people[i].name.charAt(0).toLowerCase();
			}
		
		data.push({
			contact:
				{
				text: people[i].name
				},
			properties: 
				{
				itemId: people[i].ids,
				searchableText: people[i].name,
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
	
	function itemClickEvent(itemEvent)
		{
		listView.removeEventListener('itemclick', itemClickEvent);
		
		var item = itemEvent.section.getItemAt(itemEvent.itemIndex);
		item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
		itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
		
		Ti.API.info(JSON.stringify(item));
		
		if(item.properties.itemId.length == 0)
			{
			alert(String.format(L('missing_contact_phone_number'), item.contact.text));
			
			item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
			itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
			
			listView.addEventListener('itemclick', itemClickEvent);
			}
		else if(item.properties.itemId.length > 1)
			{
			var opts = {};
			opts.title = L('select_mobile_number');
			
			var cancelIndex = item.properties.itemId.length;

			if(config.platform == config.platform_android)
				{
				opts.options = item.properties.itemId;
				opts.buttonNames = [L('cancel')];
				}
			else
				{
				opts.cancel = cancelIndex;
				opts.options = [];
				
				for(var i = 0; i < item.properties.itemId.length; i++)
					{
					opts.options.push(item.properties.itemId[i]);
					}
				
				opts.options.push(L('cancel'));
				}
	
			var dialog = Ti.UI.createOptionDialog(opts);
			
			dialog.addEventListener('click', function(dialogEvent)
				{
				if(dialogEvent.index == cancelIndex)
					{
					item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
					itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
					
					listView.addEventListener('itemclick', itemClickEvent);
					}
				else
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
				});
				
			dialog.show();
			}
		else
			{
			validateSelectedNumber(item.contact.text, item.properties.itemId[0], function(valid, phoneNumber)
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
		}
	
	listView.addEventListener('itemclick', itemClickEvent);
		
	mainContainerView.add(listView);
	
	win.add(mainContainerView);
	
	return win;
	};

module.exports = ContactsWindow;