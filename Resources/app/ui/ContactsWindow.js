function ContactsWindow(callback)
	{
	var config = require('app/config');
	var _ = require('lib/underscore');
	var httpClient = require('lib/httpclient');
	
	var userId = null;
	
	// Create the main window
	var win = require('app/ui/common/Window').create();
	
	if(config.platform === config.platform_android)
		{
		win.exitOnClose = true;
		
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
		
	var navigationView = require('app/ui/common/NavigationView').create(navViewArgs, win);
	mainContainerView.add(navigationView);
	
	var search;
	
	// Handle the list view platform differences
	if(config.platform === config.platform_iphone)
		{
		var search = Ti.UI.createSearchBar({
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
		caseInsensitiveSearch: true,
		width: '100%',
		});
	
	// Match the Apple design guidelines for the inset on the separator
	// Align with template content since that does not happen automatically	
	if(config.platform === config.platform_iphone)
		{
		listView.separatorInsets = {left: 10};
		}
		
	var data = [];
	
	for (var i = 0; i < 10; i++)
		{
		data.push({
			contact:
				{
				text: 'Row ' + (i + 1)
				},
			properties: 
				{
				itemId: 'row' + (i + 1),
				searchableText: '' + (i + 1),
				accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
				}
			});
		}
		
	var createSectionHeader = function(title)
		{
		var view = Ti.UI.createView({
			backgroundColor: '#eaebeb',
			height: 30
			});
			
		var text = Ti.UI.createLabel({
			text: title,
			left: 10,
			font:
				{
				fontSize: 16,
				fontFamily: config.opensans_semibold
				},
			color: '#999999'
			});
			
		view.add(text);
		return view;
		};
		
	var section = Ti.UI.createListSection({
		items: data,
		headerView: createSectionHeader('Z')
		});
		
	listView.sections = [section];
	
	listView.addEventListener('itemclick', function(e)
		{
		var item = e.section.getItemAt(e.itemIndex);
		
		Ti.API.info(JSON.stringify(item));
		});
		
	mainContainerView.add(listView);
	
	win.add(mainContainerView);
	
	return win;
	};

module.exports = ContactsWindow;