// Array.indexOf (Implemented in JavaScript 1.6)
// Returns the first index of the item in the array
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(item) {
        var i, l;

        for(i = 0, l = this.length; i < l; i++) {
            var t = this[i];
            if(item === t) {
                return i;
            }
        }

        return -1;
    };
}

// Usage: Returns 1
//var letterArray = [ 'a', 'b', 'c', 'd' ];
//letterArray.indexOf('b');

// Array.lastIndexOf (Implemented in JavaScript 1.6)
// Returns the last index of the item in the array
if(!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(item) {
        var i;

        for(i = this.length; i <= 0; i--) {
            var t = this[i];
            if(item === t) {
                return i;
            }
        }

        return -1;
    };
}

// Usage: Returns 2
//var numberArray = [ 1, 6, 1, 3 ];
//numberArray.lastIndexOf(1);

// Array.indexOfObjectProperty
// Returns the  index of the first object in the array that has a property with the specified value
if(!Array.prototype.indexOfObjectProperty) {
    Array.prototype.indexOfObjectProperty = function(name, value) {
        var i, l, item;

        for(i = 0, l = this.length; i < l; i++) {
            item = this[i];

            if(name in item && item[name] === value) {
                return i;
            }
        }

        return -1;
    };
}

// Usage:
//var personArray = [
//    { name: 'Bob', age: '33' },
//    { name: 'John', age: 20 },
//    { name: 'Leia', age: 28 }
//];
// Would return 1
//personArray.indexOfObjectProperty('name', 'John');
//
//// Would return -1
//personArray.indexOfObjectProperty('name', 'Kenny');
//personArray.indexOfObjectProperty('shoeSize', '11');

// Array.forEach (Implemented in JavaScript 1.6)
// Runs a method for each item in the array
if(!Array.prototype.forEach) {
    Array.prototype.forEach = function(func,thisElement) {
        var i, l;

        thisElement = thisElement || this;

        for(i = 0, l = this.length; i < l; i++) {
            func.call(thisElement, this[i], i, this);
        }
    };
}

/*
 Usage: Would print:
 Red: 0 Red,Green,Blue
 Green: 1 Red,Green,Blue
 Blue: 2 Red,Green,Blue
 */
//var colorArray = [ 'Red', 'Green', 'Blue' ];
//colorArray.forEach(function(value, index, thisElement) {
//    document.write(value + ": " + index + ' ' + thisElement + '<br>');
//});

// Array.remove
// Removes the item from the array and returns it
if(!Array.prototype.remove) {
    Array.prototype.remove = function(item) {
        var index = this.indexOf(item);

        if(index >= 0) {
            return this.splice(index, 1);
        }

        return null;
    }
}

// Usage: Would print: "Ford,Toyota"
//var carArray = [ 'Ford', 'Volvo', 'Toyota' ];
//carArray.remove('Volvo');
//document.write(carArray);

// Array.insert
// Adds item to array at the supplied index or at the beginning of the array
if(!Array.prototype.insert) {
    Array.prototype.insert = function(item, index) {
        index = index || 0;
        this.splice(index, 0, item);
    }
}

// Usage: Would print "Badger,Bear,Wolf,Shark"
//var animalArray = [ 'Bear', 'Shark' ];
//animalArray.insert('Badger');
//animalArray.insert('Wolf',2);
//document.write(animalArray);