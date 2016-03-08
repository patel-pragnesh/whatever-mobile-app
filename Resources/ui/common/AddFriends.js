
function AddFriends(parentView, friends) 
{
	var config = require('config');
	var context = require('context');
	var httpClient = require('lib/HttpClient');
	var moment = require('lib/Moment');
	var _ = require('lib/Underscore');
	
	var account = Ti.App.properties.getObject('account');
	
	addViewHolder = Ti.UI.createView({
		height: '100%',
		width: Ti.UI.FILL,
		top: '101%',
		zIndex: 2
	});
		
		addViewHolder.addEventListener('postlayout', function(){
			this.removeEventListener('postlayout', arguments.callee);
			//getFriends();
			handleContacts();
		});
		
	var addView = Ti.UI.createView({
		width: '100%',
		height: Titanium.UI.FILL,
		backgroundColor: 'white',
		layout: 'vertical'
	});
	
	
	
	// Create the List View Templates
		var friendTemplate = 
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
					fontSize: 18,
					fontFamily: 'AvenirNext-Regular'
					},
				color: '#3e3e3e'
				}
			},{
			type: 'Ti.UI.ImageView',
			bindId: 'check',
			properties:
				{
				right: 30,
				height: 25,
				image: 'images/emptyCheckbox'	
				}
			}]
		};
		
		var friendSelectedTemplate = 
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
					fontSize: 18,
					fontFamily: 'AvenirNext-Regular'
					},
				color: 'black'
				}
			},{
			type: 'Ti.UI.ImageView',
			bindId: 'check',
			properties:
				{
					right: 30,
					height: 25,
					image: 'images/selectedCheckbox'
				}
			}]
		};
		
		var contactTemplate = 
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
					fontSize: 14,
					fontFamily: 'AvenirNext-Regular'
					},
				color: '#3e3e3e'
				}
			}]
		};
		
		var contactSelectedTemplate = 
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
					fontSize: 14,
					fontFamily: 'AvenirNext-Regular'
					},
				color: 'black'
				}
			}]
		};
		
		
	var listView = Ti.UI.createListView({
		templates: {'contact': contactTemplate, 'contactSelected': contactSelectedTemplate, 'friend': friendTemplate, 'friendSelected': friendSelectedTemplate},
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
var search;
// Handle the list view platform differences
	if(config.platform === config.platform_iphone || Ti.Platform.Android.API_LEVEL < 11)
		{
		search = Ti.UI.createSearchBar({
			showCancel: false,
			top: 0,
			barColor: 'white',
			borderColor: '#f1f1f1',
			hintText: 'Search'
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
	
	
	var selectedView = Ti.UI.createView({
		width: '100%',
		height: '10%',
		backgroundColor: config.purple,
		bottom: 0,
		opacity: 0.8
	});
	
	var selectedLabelsViewHolder = Ti.UI.createView({
		width: '100%',
		left: '1%',
		height: '10%',
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
	if (search.getValue() == "")
	{
		search.blur();
	}
});

addView.add(search);
addView.add(listView);
addViewHolder.add(addView);
addViewHolder.add(selectedView);
addViewHolder.add(selectedLabelsViewHolder);


function handleContacts(){
		Ti.Contacts.requestAuthorization(function(e)
		{
			if(e.success == 1)
			{
				isAuthorized();
			}else{
				contactsAuth = false;
			}
		});
}

var people = [];
function isAuthorized()
{
//Get all people from phone contacts and load into people array
	var peopleArray = Ti.Contacts.getAllPeople(); //Initial contact array
	
    	var mobile;
        var person;
        
        for(var i = 0; i < peopleArray.length; i++) 
        {
 
        	var fullName = peopleArray[i].fullName;
        	var firstName = peopleArray[i].firstName;
        	
        		if (peopleArray[i].phone.iPhone > "")
        		{
        			mobile = peopleArray[i].phone.iPhone;
        			person = {fullName: fullName, firstName:firstName, mobile: mobile};
        			people.push(person); 
        		}else if (peopleArray[i].phone.mobile > ""){
        				mobile = peopleArray[i].phone.mobile;
        				if (fullName.toString() [0] == "#")
        				{
        					Ti.API.info('removed carrier contact');
        				}else{
        					person = {fullName: fullName,firstName: firstName, mobile: mobile};
        					people.push(person); 
        				}		
        		}else if(peopleArray[i].phone.main >""){
        				mobile = peopleArray[i].phone.main;
        				person = {fullName: fullName,firstName: firstName, mobile: mobile};
        				people.push(person); 
        		}else if(peopleArray[i].phone.home >""){
        				mobile = peopleArray[i].phone.home;
        				person = {fullName: fullName,firstName: firstName, mobile: mobile};
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
addContactsToListView();
}//end of isAuthorized


//Prepare to create listView sections
	var sectionTitle = null;
	var sections = [];
	var contactsSections = [];
	var data = [];	
	
//add friends section
if (friends.length > 0)
{
	var friendsData = [];
	
	for (f = 0; f < friends.length; f++)
	{
		friendsData.push({
					contact:
						{
						text: friends[f].firstName + " " + friends[f].lastName,
						firstName: friends[f].firstName,
						lastName: friends[f].lastName,
						userId: friends[f].userId
						},
				 properties:
				 		{
						searchableText: friends[f].firstName + " " + friends[f].lastName,
						backgroundColor: 'white'
				    	 },
			      template: 'friend',
			      selected: false	
		});
	}
	
	// Add a section
	listView.insertSectionAt(0, createSection('FRIENDS', friendsData));
}
	

function createSectionHeader(title)
{			
	var view = Ti.UI.createView({
		height: 30,
		backgroundColor: 'white'
	});
						
	var text = Ti.UI.createLabel({
			text: title,
			left: 10,
			font:
				{
				fontSize: 12,
				fontFamily: 'AvenirNext-DemiBold'
				},
			color: config.purple
	});
						
	view.add(text);
	return view;
};//end of createSectionHeader


function createSection(sectionTitle, data)
{	
	var section = Ti.UI.createListSection({
		items: data,
		headerView: createSectionHeader(sectionTitle),
		sectionTitle: sectionTitle
	});
				
	return section;
}//end of createSection


//called by isAuthorized() to fill contacts into listView
function addContactsToListView()
{
	//Create "FROM CONTACTS" section header
    contactsSections.push(createSection('FROM CONTACTS', data));

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
				contactsSections.push(createSection(sectionTitle.toUpperCase(), data));
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
							firstName: people[i].firstName
							},
						template: 'contact',
						selected: false
				});
					
				// Add the last section
					if(i == people.length - 1)
						{
						contactsSections.push(createSection(sectionTitle.toUpperCase(), data));
						}
	}//end of loop through people array for loop
listView.insertSectionAt(1,contactsSections);
}

listView.addEventListener('itemclick', itemClickEvent);	


//THIS ALL FIRED BY ITEM CLICK/////////////

var selectedPeople = [];  //keeps track of user listItem choices for the duration of the picking session
								//used mainly to allow 'checks' and 'unchecks'						
var finalOutput;		//A 'checked' contacts mobile phone number after removing non-digits and standardizing to 11 characters
var item;	
var itemFullName;	
var itemFirstName;
			
function itemClickEvent(itemEvent)	
{
	Ti.API.info(JSON.stringify(itemEvent));
	item = itemEvent.section.getItemAt(itemEvent.itemIndex);
	
	if(itemEvent.section.sectionTitle == 'FRIENDS')
	{
		listView.removeEventListener('click', itemClickEvent);
		
		
		Ti.API.info(JSON.stringify(item));
		if(!item.selected){
			finalOutput = item.contact.userId;
			item.template = 'friendSelected';
			item.properties.backgroundColor = '#f1f1f1';
			
			item.selected = true;
			itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
		
			itemFullName = item.contact.text;
			itemFirstName = item.properties.firstName;
		
			addSelected(itemFullName, itemFirstName, finalOutput);	
		}else{
			
			item.template = 'friend';
			item.properties.backgroundColor = 'white';
			item.selected = false;
			itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
			removeSelected(item.contact.userId);
		}
		
		listView.addEventListener('click', itemClickEvent);
	}else{
		
		listView.removeEventListener('itemclick', itemClickEvent);
			
		var itemPhone = item.properties.phone.toString();
		var itemFullName = item.contact.text;
		var itemFirstName = item.properties.firstName;
			
		if(itemPhone.length == 0)
		{
			alert(String.format(L('contact_missing_mobile_phone_number'), itemFullName));					
		}
		else if(itemPhone.length > 1)
		{
				//strip all non-digits from phone number
				finalOutput = itemPhone.replace(/\D/g,'');
				
				if(finalOutput.length < 7)
				{
						alert(String.format(L('invalid_phone_number_selected'), phoneNumber, name));				
				}else{
						if(finalOutput.length == 7)
						{
							// Assume same area code as user
							var account = Ti.App.Properties.getObject('account');
							var areaCode = account.id.substring(1,4);				
							finalOutput = '1' + areaCode + finalOutput;									
						}
						else if(finalOutput.length == 10)
						{
							finalOutput = '1' + finalOutput;				
						}
					
						if(!item.selected){
							item.properties.accessoryType = Titanium.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
							item.template = 'contactSelected';
							item.properties.backgroundColor = '#f1f1f1';
							item.selected = true;
							addSelected(itemFullName, itemFirstName, finalOutput);			
						}else{
							item.template = 'contact';
							item.properties.backgroundColor = 'white';
							item.properties.accessoryType = Titanium.UI.LIST_ACCESSORY_TYPE_NONE;
							item.selected = false;
							removeSelected(finalOutput);
						}
					itemEvent.section.updateItemAt(itemEvent.itemIndex, item);
				}	
		}//end of itemPhone.length else if		
					
		listView.addEventListener('itemclick', itemClickEvent);	
	}			
}//end of itemClickEvent						

						
function removeSelected(removeId)
{
	var index = 0;
	
	for (o = 0; o < selectedPeople.length;o++){
		if(selectedPeople[o].id == removeId)
		{
			Ti.API.info(selectedPeople[o].fullName);
			index = o;
			break;
		}
	}
	Ti.API.info(index);
	selectedPeople.splice(index, 1);
	
	displaySelectedPeople();
}			


function addSelected(fullName, firstName, id)
{
	var thisPerson = {
		fullName: fullName,
		firstName: firstName,
		id: id
	};
	Ti.API.info(JSON.stringify(thisPerson));
	selectedPeople.push(thisPerson);
	displaySelectedPeople();
}
						
function displaySelectedPeople()
{
	if (selectedPeople.length > 0)
	{
		selectedLabelsView.removeAllChildren();
		
		for (j = 0; j < selectedPeople.length; j++)
		{
			Ti.API.info(selectedPeople[j].fullName);
			var nameLabel = Ti.UI.createLabel({
				text: selectedPeople[j].fullName + ", ",
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
		selectedLabelsView.removeAllChildren();
	}
}


//done button click handler
doneButton.addEventListener('click', function(e)
{
	var args = {selectedPeople: selectedPeople};
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
	