
function AddFriends(parentView, hasContactsAuthorization) 
{
	var config = require('config');
	var context = require('context');
	
	var moment = require('lib/Moment');
	var _ = require('lib/Underscore');
	var httpClient = require('lib/HttpClient');
	
	var addViewHolder = Ti.UI.createView({
		width: '100%',
		//bottom: '5%',
		height: '100%',
		top: '101%',
		layout: 'absolute',
		
	});
	
	
	var addView = Ti.UI.createView({
		width: '100%',
		height: Titanium.UI.FILL,
		backgroundColor: 'white',
		layout: 'vertical'
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

// Handle the list view platform differences
	if(config.platform === config.platform_iphone || Ti.Platform.Android.API_LEVEL < 11)
		{
		search = Ti.UI.createSearchBar({
			showCancel: false,
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
	
	var selectedView = Ti.UI.createView({
		width: '100%',
		height: '10%',
		backgroundColor: config.purple,
		bottom: 0,
		opacity: 0.8,
		visible: false
	});
	
	var selectedLabelsViewHolder = Ti.UI.createView({
		width: '100%',
		left: '1%',
		height: '10%',
		visible: false,
		layout: 'horizontal',
		bottom: 0
	});
		
		var doneButton = Ti.UI.createView({
			width: Titanium.UI.FILL,
			left: 0,
			height: Titanium.UI.FILL
		});
			var doneLabel = Ti.UI.createLabel({
				text: 'Done',
				color: 'black',
				font: {fontSize: 15,
						fontFamily: 'AvenirNext-Regular'}
			});
			doneButton.add(doneLabel);
			
		var selectedLabelsView = Ti.UI.createScrollView({
			width: '85%',
			height: Titanium.UI.FILL,
			bottom: 0,
			layout: 'horizontal'
		});
		selectedLabelsViewHolder.add(selectedLabelsView);
		selectedLabelsViewHolder.add(doneButton);
	

	
//event listeners to manage search bar focus

listView.addEventListener('scrollstart', function(e)
{
	Ti.API.info('scrollstart');
	if (search.getValue() === "")
	{
		search.blur();
		Ti.API.info('blur');
	}
});





if(hasContactsAuthorization)
{
	isAuthorized();	
		
	addView.add(listView);
	
}else{
	alert('no contacts authorization');
}

addViewHolder.add(addView);
addViewHolder.add(selectedView);
addViewHolder.add(selectedLabelsViewHolder);
	

function isAuthorized()
{
//Get all people from phone contacts and load into people array
	var peopleArray = Ti.Contacts.getAllPeople(); //Initial contact array
	
    	var mobile;
        var person;
        
        for(var i = 0; i < peopleArray.length; i++) 
        {
        	
        	var fullName = peopleArray[i].fullName;
        	Ti.API.info('current contact = ' + JSON.stringify(peopleArray[i].phone));
        		if (peopleArray[i].phone.iPhone > "")
        		{
        			mobile = peopleArray[i].phone.iPhone;
        			person = {fullName: fullName, mobile: mobile};
        			people.push(person); 
        		}else if (peopleArray[i].phone.mobile > ""){
        				mobile = peopleArray[i].phone.mobile;
        				if (fullName.toString() [0] == "#")
        				{
        					Ti.API.info('removed carrier contact');
        				}else{
        					person = {fullName: fullName, mobile: mobile};
        					people.push(person); 
        				}
        				
        		}
        		/**
        		else if(peopleArray[i].phone.main >""){
        				mobile = peopleArray[i].phone.main;
        				person = {fullName: fullName, mobile: mobile};
        				people.push(person); 
        		}
        		*/
        		else if(peopleArray[i].phone.home >""){
        				mobile = peopleArray[i].phone.home;
        				person = {fullName: fullName, mobile: mobile};
        				people.push(person);
        		}else{
        			Ti.API.info(peopleArray[i].fullName +  "no phone");	
        		}
            	
            	
        }
     
 	//sort people [] alphabetically by full name    	
      function compare(a,b) 
      {
  		if (a.fullName < b.fullName)
    		return -1;
  		if (a.fullName > b.fullName)
    		return 1;
  		return 0;
  		
  		
	  }

people.sort(compare);


//Prepare to create listView sections
	var sectionTitle = null;
	var sections = [];
	var data = [];		


function createSectionHeader(title)
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
				fontFamily: 'AvenirNext-Bold'
				},
			color: '#999999'
	});
						
	view.add(text);
	return view;
};//end of createSectionHeader


function createSection(sectionTitle, data)
{	
	var section = Ti.UI.createListSection({
		items: data,
		headerView: createSectionHeader(sectionTitle)
	});
				
	return section;
}//end of createSection


	//Loop through people array and create appropriate listView sections
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
							phone: people[i].mobile,
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
		}//end of loop through people array for loop
		
	listView.sections = sections;
		
	listView.addEventListener('itemclick', itemClickEvent);
	
	
}//end of isAuthorized


//THIS ALL FIRED BY ITEM CLICK/////////////

var selectedPeople = [];  //keeps track of user listItem choices for the duration of the picking session
								//used mainly to allow 'checks' and 'unchecks'
var selectedNames = [];							
var finalOutput;		//A 'checked' contacts mobile phone number after removing non-digits and standardizing to 11 characters
var item;	
var itemName;	
			
function itemClickEvent(itemEvent)	
{
	listView.removeEventListener('itemclick', itemClickEvent);
				
		item = itemEvent.section.getItemAt(itemEvent.itemIndex);
				
		item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
		itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
				
		var itemPhone = item.properties.phone.toString();
			itemName = item.contact.text;
		
		Ti.API.info(JSON.stringify(item));
				
	if(itemPhone.length == 0)
	{
		alert(String.format(L('contact_missing_mobile_phone_number'), item.contact.text));		
		item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
		itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
					
		listView.addEventListener('itemclick', itemClickEvent);
	}
	else if(itemPhone.length > 1)
	{
		
		//strip all non-digits from phone number
		finalOutput = itemPhone.replace(/\D/g,'');
		
		
		if(finalOutput.length < 7)
		{
				alert(String.format(L('invalid_phone_number_selected'), phoneNumber, name));
									
		}
		else if(finalOutput.length == 7)
		{
				// Assume same area code as user
				var account = Ti.App.Properties.getObject('account');
				var areaCode = account.id.substring(1,4);				
				finalOutput = '1' + areaCode + finalOutput;
				Ti.API.info(finalOutput);
				checkIfAlreadyAdded(itemEvent);												
				listView.addEventListener('itemclick', itemClickEvent);	
		}
		else if(finalOutput.length == 10)
		{
				finalOutput = '1' + finalOutput;
				checkIfAlreadyAdded(itemEvent);			
				listView.addEventListener('itemclick', itemClickEvent);
									
		}
		else if (finalOutput.length == 11)
		{
				checkIfAlreadyAdded(itemEvent);			
				listView.addEventListener('itemclick', itemClickEvent);				
		}
		
		
		
	}//end of itemPhone.length else if
						
}//end of itemClickEvent						

						
function checkIfAlreadyAdded(itemEvent)
{
	Ti.API.info(itemEvent);
	var alreadyAdded = false;
	var i = 0;
								
	while (i < selectedPeople.length)
	{
		if (selectedPeople[i] == finalOutput)
		{					
			alreadyAdded = true;
			break;
		}else{
			i++;
		}
									
	}	
							
	if(alreadyAdded)
	{
		Ti.API.info('already added');
		selectedPeople.splice(i, 1);
		selectedNames.splice(i, 1);
		item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
		itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
		displaySelectedNames();
	}else{
		selectedPeople.push(finalOutput);
		selectedNames.push(itemName);
		displaySelectedNames();
	}
		
	//tell parentView (card of CreateCard.js) to update friend label count
	parentView.fireEvent('updateFriendsLabel', {count: selectedPeople.length});

}//end of checkIfAlreadyAdded			
						
function displaySelectedNames()
{
	if (selectedNames.length > 0)
	{
		selectedLabelsView.removeAllChildren();
		selectedView.show();
		selectedLabelsViewHolder.show();
		
		for (j = 0; j < selectedNames.length; j++)
		{
			
			var nameLabel = Ti.UI.createLabel({
				text: selectedNames[j] + ", ",
				color: 'white',
				left: 0,
				font: {fontSize: 18,
						fontFamily: 'AvenirNext-Bold'},
				ellipsize: Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_START
			});
			
			selectedLabelsView.add(nameLabel);
			selectedLabelsView.scrollToBottom();
		}
		selectedLabelsView.scrollToBottom();
	}else{
		selectedView.hide();
		selectedLabelsViewHolder.hide();
	}
}

/**
addView.add(listView);
addViewHolder.add(addView);
addViewHolder.add(selectedView);
addViewHolder.add(selectedLabelsViewHolder);
*/
//done button click handler
doneButton.addEventListener('click', function(e)
{
	var args = {};
	args.selectedPeople = selectedPeople;
	args.selectedNames = selectedNames;
	parentView.fireEvent('returnFromAddFriends', args);
});


//Listen for the keyboard event
var keyboardHidden = true;
var animation = Ti.UI.createAnimation();

Ti.App.addEventListener('keyboardframechanged', function(e){
	Ti.API.info('duration = ' + (e.animationDuration * 1000));
	if(keyboardHidden)
	{
		keyboardHidden = false;
		
			animation.bottom = e.keyboardFrame.height;
			animation.duration = e.animationDuration * 1000;
	}
	else
	{
		keyboardHidden = true;
		
		animation.bottom = 0;
		animation.duration = e.animationDuration * 1000;	
	}
	
	selectedView.animate(animation);
	selectedLabelsViewHolder.animate(animation);
	
});



return addViewHolder;
};


module.exports = AddFriends;
	