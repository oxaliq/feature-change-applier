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
#### Set Definition
#### Set Usage
#### Set Operation
### Lexemes
#### Lexeme Operations
### Phone
#### Phone Operations
### Epochs