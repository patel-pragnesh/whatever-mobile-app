/**
 * @author Cole Halverson
 */

function MembersListView(args)
{
	var httpClient = require('lib/HttpClient');
	var ProfileWindow = require('ui/common/UserProfileWindow');
	var account = Ti.App.properties.getObject('account');
	
	var view = Ti.UI.createView({
		backgroundColor: 'white',
		width: '100%',
		height:'100%',
		left: '101%',
		zIndex: 3
	});
		view.addEventListener('postlayout', function(){
			this.removeEventListener('postlayout', arguments.callee);
			if(tableView.size.height < view.size.height){
				tableView.setScrollable(false);
			}
			this.animate({left: 0, duration: 200});
		});
		
		view.addEventListener('swipe', function(e){
			if (e.direction == 'right'){
				this.animate({left: args.mainViewContainer.size.width + 1, duration: 200}, function(){
					args.mainViewContainer.remove(view);
				});
			}
		});
		
		var tableView = Ti.UI.createTableView({
			top: 0,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE
		});
		
		var rows = [];
		
		for (i = 0; i < args.currentMembers.length; i++)
		{	
			if (args.currentMembers[i].type != 'CREATOR')
			{
				var row = Ti.UI.createTableViewRow({
					width: Ti.UI.FILL,
					height: 50,
					selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
				});
				
				var userId = args.currentMembers[i].userId;
				
				if (userId != account.id)
				{
					row.addEventListener('click', function(){
						var profileWindow = new ProfileWindow(userId);
						profileWindow.open();
					});
				}
				
				
				var rowView = Ti.UI.createView({
					width: Ti.UI.FILL,
					height: Ti.UI.FILL,
					layout: 'horizontal'
				});
				
					var pictureView = Ti.UI.createView({
						left: '7%',
						top: '12.5%',
						bottom: '12.5%',
						width: Ti.UI.SIZE
					});
					
						var picture = Ti.UI.createImageView({
							top: 0,
							height: Ti.UI.FILL,
							backgroundColor: '#d3d3d3',
							visible: false
						});
						pictureView.add(picture);
						
						var statusIcon = Ti.UI.createImageView({
							width: '30%',
							top: '5%',
							right: '5%',
							zIndex: 2
						});
					
						var status = args.currentMembers[i].status;
							if(status == "IN"){
								statusIcon.setImage('images/inDot');
								statusIcon.show();
							}else if (status == "OUT"){
								statusIcon.setImage('images/outDot');
								statusIcon.show();
							}else{
								statusIcon.hide();
							}
					rowView.add(pictureView);
					
					var nameLabel = Ti.UI.createLabel({
						left: '7%',
						color: 'black',
						font: {fontFamily: 'AvenirNext-Medium',
									fontSize: 12},
						text: args.currentMembers[i].userFirstName + " " + args.currentMembers[i].userLastName
					});
					rowView.add(nameLabel);
					
					picture.addEventListener('postlayout', function(){
						this.removeEventListener('postlayout', arguments.callee);
						this.setWidth(this.size.height);
						this.setBorderRadius(this.size.height / 2);
						this.show();
						pictureView.add(statusIcon);
						getProfile();
					});
					
					function getProfile()
					{
						if (!picture.getImage()){
							httpClient.doMediaGet('/v1/media/' + userId + '/PROFILE/profilepic.jpeg', function(success, response){
								if(success){
									picture.setImage(Ti.Utils.base64decode(response));
								}else{
									Ti.App.addEventListener('app:refresh', function(e){
										Ti.App.removeEventListener('app:refresh', arguments.callee);
										getProfile();
									});
								}
							});
						}
					}
				row.add(rowView);
				rows.push(row);
			}
		}
		
		tableView.setData(rows);
		
	view.add(tableView);
		
	return view;
}

module.exports = MembersListView;
