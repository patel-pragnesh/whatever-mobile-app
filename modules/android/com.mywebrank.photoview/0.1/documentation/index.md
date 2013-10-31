# PhotoView Module

## Description

Implementation of ImageView for Titanium Android that supports pinch to zoom, double tap to zoom and page transition effects.

## Accessing the PhotoView Module

To access this module from JavaScript, you would do the following:

  var PhotoViewModule = require('com.mywebrank.photoview');

## Functions

### createPhotoView({ . . . })

Returns a view with an photo view.

### Properties

#### images : String[]/Titanium.Blob[]/Titanium.Filesystem.File[]

Array of images to display in the photo view,  defined using local filesystem paths, File objects, remote URLs, or Blob.

#### currentPage : Number

Index of the active page.

#### style : Number

The style for the activity indicator.

One of the activity indicator style constants: Titanium.UI.ActivityIndicatorStyle.DARK, Titanium.UI.ActivityIndicatorStyle.BIG, Titanium.UI.ActivityIndicatorStyle.BIG_DARK, or Titanium.UI.ActivityIndicatorStyle.PLAIN.

Default: Titanium.UI.ActivityIndicatorStyle.BIG

#### transitionStyle : Number

The transition effect style for the PhotoView.

One of the constants. PhotoViewModule.TRANSITION_DEFAULT, PhotoViewModule.TRANSITION_TABLET, PhotoViewModule.TRANSITION_CUBE_IN, PhotoViewModule.TRANSITION_CUBE_OUT, PhotoViewModule.TRANSITION_FLIP_VERTICAL, PhotoViewModule.TRANSITION_FLIP_HORIZONTAL, PhotoViewModule.TRANSITION_STACK, PhotoViewModule.TRANSITION_ZOOM_IN, PhotoViewModule.TRANSITION_ZOOM_OUT, PhotoViewModule.TRANSITION_ROTATE_UP, PhotoViewModule.TRANSITION_ROTATE_DOWN, PhotoViewModule.TRANSITION_ACCORDION.

Default: PhotoViewModule.TRANSITION_DEFAULT

#### pageMargin : Number

Margin between pages.

Default: 0

#### scrollDuration : Number

Duration of the scroll in milliseconds.

Default: 1000

## Methods

### addImage( String/Titanium.Blob/Titanium.Filesystem.File image )

Adds a new image to this PhotoView.

### getCount( ) : Number

Gets the value of the total images.

### getCurrentPage( ) : Number

Gets the value of the currentPage property.

### getImages( ) : String[]/Titanium.Blob[]/Titanium.Filesystem.File[]

Gets the value of the images property.

### getStyle( ) : Number

Gets the value of the style property.

### getTransitionStyle( ) : Number

Gets the value of the transitionStyle property.

### getPageMargin( ) : Number

Gets the value of the pageMargin property.

### getScrollDuration( ) : Number

Gets the value of the scrollDuration property.

### moveNext( )

Sets the current page to the next consecutive page in images.

### movePrevious( )

Sets the current page to the previous consecutive page in images.

### setCurrentPage( Number currentPage )

Sets the value of the currentPage property.

### setImage( Number page, String/Titanium.Blob/Titanium.Filesystem.File image )

Sets the value of image to the specified page.

### setImages( String[]/Titanium.Blob[]/Titanium.Filesystem.File[] images )

Sets the value of the images property. 

### setStyle(Number style )

Sets the value of the style property.

### setTransitionStyle( Number transitionStyle )

Sets the value of the transitionStyle property.

### setPageMargin( Number pageMargin )

Sets the value of the pageMargin property.

### setScrollDuration( Number scrollDuration )

Sets the value of the scrollDuration property.

## Events

### singletap

Fired when the device detects a single tap against the view.

#### Properties

* currentPage : Number Index of the image.
* tapsource : photo or view
* type : String Name of the event fired.
* x : NumberX coordinate of the event from the source view's coordinate system.
* y : NumberY coordinate of the event from the source view's coordinate system. 
### longclick

Fired when the device detects a long click.

#### Properties

* currentPage : Number Index of the image.
* type : String Name of the event fired.


## Contants

### PhotoViewModule.TRANSITION_DEFAULT

### PhotoViewModule.TRANSITION_TABLET

### PhotoViewModule.TRANSITION_CUBE_IN

### PhotoViewModule.TRANSITION_CUBE_OUT

### PhotoViewModule.TRANSITION_FLIP_VERTICAL

### PhotoViewModule.TRANSITION_FLIP_HORIZONTAL

### PhotoViewModule.TRANSITION_STACK

### PhotoViewModule.TRANSITION_ZOOM_IN

### PhotoViewModule.TRANSITION_ZOOM_OUT

### PhotoViewModule.TRANSITION_ROTATE_UP

### PhotoViewModule.TRANSITION_ROTATE_DOWN

### PhotoViewModule.TRANSITION_ACCORDION


## Usage

See example.

## Feedback and Support

Please direct all questions, feedback, and concerns to mywebrank@gmail.com.

## Author

Guti, mywebrank@gmail.com

## License

Copyright 2013 Guti, MyWebRank. Please see the LICENSE file included in the distribution for further details.


