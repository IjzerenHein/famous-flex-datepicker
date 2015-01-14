famous-flex-datepicker
==========

Date/time picker-wheel for famo.us.

![Screenshot](screenshot.gif)


### Demos

- [famous-flex-demo](https://rawgit.com/IjzerenHein/famous-flex-demo/master/dist/index.html) ([source](https://github.com/IjzerenHein/famous-flex-demo))

### Getting started

Install using bower or npm:

	bower install famous-flex-datepicker

	npm install famous-flex-datepicker

Create date-picker:

```javascript
var DatePicker = require('famous-flex/DatePicker');

var datePicker = new DatePicker({
	components: [
		new DatePicker.Component.FullDay(),
		new DatePicker.Component.Hour(),
		new DatePicker.Component.Minute(),
	]
});
this.add(datePicker); // add to the render-tree
```

Getting and setting the selected date:

```javascript
// To set the initial date, specify it in the constructor
datePicker = new DatePicker({
	date: new Date(), // specify initial date
	...
});

// Get and set the date
datePicker.setDate(new Date());
var date = datePicker.getDate();
```

Handle events when a new date has been selected:

```javascript
// The `datechange` event is emitted immediately when the date
// has been changed.
datePicker.on('datechange', function(event) {
	// TODO
});
```

Customizing the appearance:

```javascript
var datePicker = new DatePicker({
	perspective: 2000,  // perspective used for the wheel layout
	wheelOptions: {     // layout-options that are passed to the `WheelLayout`
		itemSize: 50,   // height of single item on the datepicker wheel
		diameter: 200   // diameter of the wheel in pixels
	},
	components: [
		// use `sizeRatio' to define the width of each component
		new DatePicker.Component.Hour({sizeRatio: 5}),   // 50% width
		new DatePicker.Component.Minute({sizeRatio: 2}), // 20% width
		new DatePicker.Component.Second({sizeRatio: 3}), // 30% width
	]
});
```

## Components

DatePicker is shipped with various components out of the box.

|Component|Description|
|---|---|
|`DatePicker.Component.Year`|4 digit year component.| 
|`DatePicker.Component.Month`|Month component (e.g. 'July').| 
|`DatePicker.Component.FullDay`|Full day component including year, month & day.| 
|`DatePicker.Component.WeekDay`|Day of the week (e.g. 'Monday').| 
|`DatePicker.Component.Day`|1 or 2 digit day of the month (e.g. 31).| 
|`DatePicker.Component.Hour`|2 digit hour component.| 
|`DatePicker.Component.Minute`|2 digit minute component.| 
|`DatePicker.Component.Second`|2 digit second component.| 
|`DatePicker.Component.Millisecond`|3 digit millisecond component.| 

### Customizing components

All components share a set of properties which can customized:

|Property|Type|Description|
|---|---|
|`sizeRatio`|`Number`|Width-ratio the component occupies in the date-picker (the sum of all sizeRatio's equals a width of 100%).| 
|`step`|`Number`|The value by which the component is incremented/decremented when scrolling up/down.| 
|`max`|`Number`|The minimum value of the component (e.g. `59` for an Hour component).|
|`min`|`Number`|The maximum value of the component (e.g. `0`).|
|`loop`|`Bool`|When set to `true` causes the component to loop when min/max is reached (default: `true`).| 
|`format`|`Function`|Function that formats the component into a string (see [Internationalisation & custom formatting](internationalisation-custom-formatting)).| 
|`create`|`Function`|Function that creates the renderable for an item (see [Using custom renderables](using-custom-renderables)).| 

Example:

```javascript
var datePicker = new DatePicker({
	components: [
		new DatePicker.Component.FullDay({
			sizeRatio: 5,  	// occupy 50% width
			format: function (date) {
				// format the date the way you want
				return date.toLocaleDateString();
			}
		}),
		new DatePicker.Component.Hour({
			sizeRatio: 2.5  // occupy 25% width
		}),
		new DatePicker.Component.Minute({
			step: 15,     	// Select increments of 15 minutes
			sizeRatio: 2.5  // occupy 25% width
		})
	]
});
```

## Internationalisation & custom formatting

By default the `Month` and `WeekDay` components are formatted in English.
If you want to format a component using a different locale, use the 
formatting library of your choice. The following example uses [momentjs](http://momentjs.com) to format the month in the currently selected locale:

```javascript
var moment = require('moment/moment');

var datePicker = new DatePicker({
	components: [
		new DatePicker.Component.Year(),
		new DatePicker.Component.Month({
			// uses momentjs to format the full month in the current locale
			format: function(date) {
				return moment(date).format('MMMM');
			}
		}),
		new DatePicker.Component.Day(),
	]
});
```

## Advanced topics

### Using custom renderables

By default the date-picker creates a Surface with class `famous-flex-datepicker-item` for each item in a component. Instead of using this Surface you can also create
your own surfaces or views. To do this, override the `create` method for each component:

```javascript
function createRenderable(date) {
	date = date || new Date();
	var surface = new Surface({
		classes: ['mydatepickeritem'],
		content: this.format(date)
	});
	surface.date = date;
	return surface;
}

var datePicker = new DatePicker({
	components: [
		new DatePicker.Component.FullDay({
			create: createRenderable
		});
	]
});
```


## Contribute

If you like this project and want to support it, show some love
and give it a star.


## Contact
- 	@IjzerenHein
- 	http://www.gloey.nl
- 	hrutjes@gmail.com (for hire)

© 2015 Hein Rutjes
