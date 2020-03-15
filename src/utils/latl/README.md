# LATL specification

## Feature Definition

## Rule Definition
ex. 
```
(
  `Unmotivated A to C`
  A -> B / _
  A -> C / _
  ``A becomes C in all environments with a intermediate state of B``
)
```
### Rule Body
#### Sound Definition
#### Change Definition
#### Environment Definition
##### Null Environment
Valid syntaxes:
```
A -> B          ; no indicated environment
A -> B / _      ; environment indicated wth underscore
A -> B / . _ .  ; environment indicated with underscore and placeholder dots
```
### Rule Metadata
#### Rule Title
#### Rule Description

## Language Primitives
## Data Structures
### Sets
Sets are collections of pointers to phones. The GLOBAL set contains all phones, making all other sets subsets of GLOBAL.
#### Global Set
[ GLOBAL ] is a shorthand for [ GLOBAL.SETS ]
#### Set Definition
#### Set Usage
#### Set Operations
##### 'and' Operation
##### 'or' Operation
##### 'not' Operation
##### 'nor' Operation
##### 'in' Operation
##### 'yield' Operation
### Lexemes
#### Lexeme Operations
### Phone
For set of phones 'a', 'b', and 'ab':
```
GLOBAL ┬▻ <Key: a> ┬▻ <Key: b> ┬▻ { feature: <Boolean>, ... }
       │           │           └▻ grapheme: <String: 'ab'>
       │           └┬▻ { feature: <Boolean>, ... }
       │            └▻ grapheme: <String: 'a'>
       └┬▻ { feature: <Boolean>, ... }
        └▻ grapheme: <String: 'b'>
```
#### Phone Operations
### Epochs