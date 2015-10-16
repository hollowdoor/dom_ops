dom-ops
-------

Install
-------

`npm install --save dom-ops`

Basic Usage
-----------

```html
<!DOCTYPE html>
<html>
    <head>
    <title>dom ops!</title>
    </head>
<body>
    <div id="location"></div>
    <script>
    var domOps = require('../index.js'),
        div = domOps(document.querySelector('#location'), function(content, data){
            return '<p>'+content+'</p>';
        });

    //Append a bunch of things inside paragraphs to #location
    for(var i=0; i<10; i++){
        div.append('thing '+i);
    }
    </script>
  </body>
</html>
```

domOps(element, template callback)
----------------------------------

Construct a new dom-ops object for a DOM element.

The **template callback** is optional. If you supply a template callback every dom operation method from a domOps instance will use that callback as a filter before the dom operation.

In the following documentation everywhere you see the word **toAdd** this is a value that can be any of these:

-	DOM element
-	HTML string
-	Array of elements
-	An array like object (DOM library instance)

The return value from the template callback should be the same types as **toAdd**.

Any time you see the word **data** this means a value of any kind that is passed to the template function passed to the `domOps` constructor.

The word **element** refers to a DOM element passed to the first argument of `domOps` constructor.

Methods
-------

### appendTo(parent)

Append element to parent.

### append(toAdd, data)

Append a value to element.

### prepend(toAdd, data)

Prepend a value to element.

### insert(toAdd, index|child, data)

Insert a value at index, or before the specified child.

### replace(toAdd, index|child, data)

Replace a child at index, or the matched child with toAdd.

### remove(index|child) child

Remove the child at index, or the matched child. Returns the removed child.

If you pass an index you'll get the template returned. If you pass a child node remove will return that.

### indexOf(child)

Get the index of the child of element.

indexOf will still work if you have a template set. If the **child** is not a direct descendant of element a search through parent nodes is done before the index is looked for.

Any children of children of children, ... and so on passed to indexOf will get the index of the the top most parent that is a child of element.

indexOf is used internally so DOM operations like replace will work to replace any value added by itself, or contained in a template you provide. Alternatively you can just pass an index to a method that accepts an index.

Keep reference variables to the children of a template if you need to operate on those later. indexOf won't serve you to get references of children of a template.

### get(index)

Get the child, or child template at the child index of element.

Properties
----------

### root

The element set with the constructor.

### children

A reference to the element's children. These will be templates if you provide one.

### classList

A reference to the element's classList object property. For using DOM classList operations.

### recent

The last added child of element.

Static Methods
--------------

### domFrom(value)

Get a DOM element, or fragment from a value.

value can be any of these:

-	DOM element
-	HTML string
-	Array of elements
-	An array like object (DOM library instance)

See [dom-from](https://www.npmjs.com/package/dom-from) for more details.

More Info
---------

This module is only for DOM operations. Hopefully it will stay that way. :)
