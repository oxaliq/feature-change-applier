# Feature Change Applier

[Try the app!](https://sorrelbri.github.io/feature-change-applier/)

[Inspired by the Zompist Sound Change Applier 2](https://www.zompist.com/sca2.html)

## What is this?

Feature Change Applier is a tool for applying systemic sound change rules to an input lexicon.

Features:
- feature based phone definitions
- feature based sound change rule support
- multi-character phone support
- comparative runs for multiple rule sets

## How do I use FCA?

An FCA run requires the user to define three parameters:
- [the input lexicon](#The-Input-Lexicon), expressed in phonetic terms
- [the feature set](#the-feature-set), which maps each phonetic feature to positive or negative values for each phone
- [at least one 'epoch' of sound change rules](#epochs) to apply to the input lexicon

### The Input Lexicon

For best effect, the input lexicon should use a narrow phonetic transcription of each lexeme. 
Lexemes must be separated by line breaks in order to be parsed properly by FCA.
Multi-word lexemes can be inserted with or without spaces, any white-space will be removed from the lexeme at runtime.
FCA does not currently support suprasegmentals by default, however features can be used to define prosodic information so long as it can be associated with a single phone.
For example:
- For tonemes, use IPA tone markers as in `ma˨˩˦` (马)
- For phonetic length, use IPA length markers as in `ħaːsin` (حَاسِن‎)
- For stress or syllabic breaks, however `ˈɡʊd.nɪs` may result in unpredictable behavior and is best avoided.
See below for defining these features in the feature set.

#### Future Changes to the Input Lexicon
- Future versions of FCA will allow for greater suprasegmental feature support.
- Future versions will allow for epoch specific lexemes

### The Feature Set

Phones in FCA are defined by the features they exhibit.
To add or edit a feature use the form to enter the feature name and the phones which are associated with the feature in the `+` and `-` inputs.
Phones should be separated by a forward slash and may be represented with multiple characters.
For example:  

`aspirated + tʰ / pʰ / kʰ - t / p / k / ʔ`  
Results in:  
`[+ aspirated] = tʰ / pʰ / kʰ  [- aspirated] = t / p / k / ʔ`

If the feature already exists, any phones associated with that feature will be replaced with the phones in the form.
A feature is not required to have a value for every phone, and every phone is not required to have a value for every feature.
Rules targeting `-` values for specific features will not target phones that are not defined in the feature set.  

For example:  
`[- aspirated]>ʔ/[+ vowel]_.`  
This rule will not operate on the phone `ʊ` in `haʊs` as it was not defined with a negative `aspirated` value above.

#### Suprasegmentals
Toneme example using Mandarin tone system:
```
[+ tone] = ˥ / ˧˥ / ˨˩˦ / ˥˩  [- tone] = 
[+ high] = ˥ / ˥˩             [- high] = ˧˥ / ˨˩˦
[+ low] = ˨˩˦                 [- low] = ˥ / ˥˩ / ˧˥
[+ rising] = ˧˥               [- rising] = ˥ / ˨˩˦ / ˥˩
[+ falling] = ˨˩˦ / ˥˩        [- falling] = ˥ / ˧˥
```
Length example using Modern Standard Arabic (without allophonic variation):
```
[+ long] = aː / iː / uː                 [- long] = a / i / u / aj / aw
[+ geminate] = mː / nː / tː / tˤː / ... [- geminate] = m / n / t / tˤ / ...
```

#### Future Chagnes to the Feature Set
- Future versions of FCA will allow for greater suprasegmental feature support
- Future versions will allow for exclusive features. In the example below a phone cannot have a labial value and a coronal value simultaneously:
```
[!place 
  [labial
    [+ labiodental] = f
    [- labiodental] = p / m / kp / ŋm
    [+ labiovelar]  = kp / ŋm
    [- labiovelar]  = f / p / m
  ]
  [coronal
    [+ anterior]    = t̪ / n̪ / t / n
    [- anterior]    = c / ɲ / ʈ / ɳ
    [+ distributed] = t̪ / n̪ / c / ɲ 
    [- distributed] = t / n / ʈ / ɳ
  ]
  ...
]
```

### Epochs
This is where the rules to transform your lexicon are defined.
An FCA project can have as many 'epochs' or suites of sound change rules as you would like to define.
Rules can be defined using phones or features:
- `n>ŋ/._k`
- `[+ nasal alveolar]>[- alveolar + velar]/._[+ velar]` 

These two rules will both act on the phone `n` in the sequence `nk` transforming it into `ŋ`, however the feature defined rule could also transform the `n` in the sequences `ng`, `nŋ`, `nx`, etc. 

By default, FCA will pipe the initial lexicon into each one of these epochs and apply their transformations independently.
The output of one epoch can be piped into another epoch, however, by defining the `parent` parameter from the dropdown when adding a new epoch.
