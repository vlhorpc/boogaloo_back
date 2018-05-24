# Boogaloo back

API for boogaloo.


## Requirements
* node `^6.8.1`
* npm `^3.10.8`
* elasticsearch `6.2.4`

## Getting Started

After confirming that your development environment meets the specified [requirements](#requirements), you can create start project:

### Install dependencies, and check to see it works

```bash
$ npm install                   # Install project dependencies
$ npm run dev                   # Run in development mode
```

## API usage

#### Using relations 
```$xslt
/{controllerName}?relations={a,b,c}        # a,b,c - relations name
```

#### Filtering requests
In order to use the filtering, you must specify the ```where``` parameter.
```AND``` and ```OR``` parametrs are using different types of brackets.<br />Examples of usage:
1. ```OR``` parameter
```$xslt
[(id*=*10),(id*=*12)]               # [] - specifies 'OR'
// id=10 OR id=12
```
2. ```AND``` parameter
```
((id*=*10),(name*=*test))           # [] - specifies 'AND'
// id=10 AND name=test
```

##### Combining two types of requests
```$xslt
[(id*=*10;name*=*Jeffry),(id*=*14)]
// (id=10 AND name=Jeffry) OR (id=14)
```

##### Supported Operations
Supported list of such comparative operations for filtering data:

| Operation  | Usage |
| ------------- | ------------- |
| =  | (id*=*1)  |
| !=  | (id*!=*1)  |
| \>  | (id*\>*1)  |
| >=  | (id*\>=*1)  |
| <  | (id*<*1)  |
| <=  | (id*<=*1)  |
| IN  | (id\*IN\*1,2,3)  |
| NOT IN  | (id\*NOT IN\*1,2,3)  |
| LIKE  | (email\*LIKE\*%test%)  |




