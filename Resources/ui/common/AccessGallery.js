
function AccessGallery()
{
	Ti.API.info('accessgallery');
	
	
	Titanium.Media.openPhotoGallery({
				success: function(e){Ti.API.info('success');},
				cancel: function(){},
				error: function (error){Ti.API.info('error');},
				mediaTypes: [Titanium.Media.MEDIA_TYPE_PHOTO]
			});
	
}

module.exports = AccessGallery;