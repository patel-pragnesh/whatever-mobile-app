
function AccessGallery(callback)
{
	
	Titanium.Media.openPhotoGallery({
				success: function(e){callback(e.media);},
				cancel: function(){},
				error: function (error){Ti.API.info('error' + JSON.stringify(error));},
				mediaTypes: [Titanium.Media.MEDIA_TYPE_PHOTO],
			});
	
}

module.exports = AccessGallery;