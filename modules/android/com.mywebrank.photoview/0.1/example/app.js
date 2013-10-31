

var win = Ti.UI.createWindow({
  backgroundColor: '#000',
  fullscreen: true,
  navBarHidden: true
});
win.open();

if (Ti.Platform.name == "android") {

  var PhotoViewModule = require('com.mywebrank.photoview');

  var photoView = PhotoViewModule.createPhotoView({
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    //style: Ti.UI.ActivityIndicatorStyle.PLAIN,
    transitionStyle: PhotoViewModule.TRANSITION_CUBE_OUT,
    //pageMargin: 20,
    //currentPage: 2,
    //scrollDuration: 3000,
    images: [ "http://www.wallpapers.com/media/6b79cacd-53b8-4d91-9314-189b35fea4be/cottageawp_400x250.jpg",
              "http://www.wallpapers.com/media/87312d20-848e-442b-bd41-f0ce79835fbd/dolphinaw_400x250.jpg",
              "http://www.wallpapers.com/media/def4562a-50e0-4bda-8518-543f1a10c165/perennial_400x250.jpg",
              "http://www.wallpapers.com/media/fe1ab22d-7c8d-4d0d-a0dd-4e68e6db7a49/beach2aw_400x250.jpg",
              "http://www.wallpapers.com/media/b88b25a2-c415-4f01-932a-fce6846e03b1/wfallsaw_400x250.jpg",
              "http://www.wallpapers.com/media/b6215bf0-1aae-4e80-a936-037a1f40d104/marine2_400x250.jpg",
              "http://www.wallpapers.com/media/cab07878-266d-4949-a6a4-ab26459b8aa1/beach1aw_400x250.jpg",
            ]
  });
  win.add(photoView);
  
  // Event Scroll
  photoView.addEventListener('scroll', function (e) {
    Ti.API.info(JSON.stringify(e));
    
    // Update Page Counter
    pageLabel.text = (e.currentPage+1) + ' of ' + photoView.getCount();
  });
  
  // Event SingleTap
  photoView.addEventListener('singletap', function (e) {
    Ti.API.info(JSON.stringify(e));
  });
  
  // Event LongClick
  photoView.addEventListener('longclick', function (e) {
    Ti.API.info(JSON.stringify(e));
  });
  
  // Page Counter
  var pageLabel = Ti.UI.createLabel({
    color: '#ffffff',
    bottom: 20,
    width: Ti.UI.SIZE, 
    height: Ti.UI.SIZE, 
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
    font: {fontSize: '16dp'},
    text: ''
  });
  win.add(pageLabel);
  
  win.addEventListener('open', function(e) {
    pageLabel.text = photoView.getCurrentPage()+1 + ' of ' + photoView.getCount();
  });
  
  
  /*
  // Test removeImage
  setTimeout(function(e){
    photoView.removeImage(4);
  }, 5000);
 */

  /*
  // Test setCurrentPage
  setTimeout(function(e){
    photoView.setCurrentPage(4);
  }, 5000);
  */
  
  /*
  // Test addImage
  setInterval(function(e){
    photoView.addImage("http://dummyimage.com/600x400/000/fff&text="+new Date().getTime());
  }, 3000);
  */
 
  /*
  // Test setImage
  setTimeout(function(e){
    photoView.setImage(3, "http://dummyimage.com/600x400/000/fff&text="+new Date().getTime());
  }, 6000);
  */
 
  /*
  // Test moveNext (movePrevious)
  setInterval(function(e){
    if(photoView.getCurrentPage() <= photoView.getCount()) {
      photoView.moveNext();
    }
  }, 6000);
  */
 
  /*
  // Test addImage (Blob)
  setTimeout(function(e){
    Ti.Media.takeScreenshot(function(event) {
        // set blob on image
        photoView.addImage(event.media);
    });
  }, 5000);
  */
}

