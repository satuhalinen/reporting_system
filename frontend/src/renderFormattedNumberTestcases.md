# Test cases for renderFormattedNumber

## renderFormattedNummber

RenderFormattedNumber checks if the hours parameter is number. If hour is a number, it is formatted in a Finnish way. It means that integer separator is a comma. Function also makes the number having at least one decimal place.

RenderFormattedNumber has one parameter, hours. The function makes the formatting for hours if it is of type number.

RenderFormattedNumber returns hours. If the passed one is type of number, the function returns the formatted version of it. If the passed one is not type of number, it returns the original versio of it.

## Tests

### 1. hours is type of number and has two decimals

Testing

```js
renderFormattedNumber(1.11);
```

returns "1,11"

### 2. hours is type of number and has no decimals

Testing

```js
renderFormattedNumber(1);
```

returns "1,0"

### 3. hours is type of number and has one decimal

Testing

```js
renderFormattedNumber(1.1);
```

returns "1,1"

### 4. hours is type of string

Testing

```js
renderFormattedNumber("test");
```

returns "test"

### 5. hours is type of boolean

Testing

```js
renderFormattedNumber(true);
```

returns true

### 6. hours is type of null

Testing

```js
renderFormattedNumber(null);
```

returns null

### 7. hours is type of undefined

Testing

```js
renderFormattedNumber(undefined);
```

returns undefined

### 8. hours is missing

```js
renderFormattedNumber();
```

returns undefined

### 9. hours is type of number and at least 1000

```js
renderFormattedNumber(1000);
```

returns "1 000"
