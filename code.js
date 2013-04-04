// based on http://stackoverflow.com/questions/5686483/how-to-compute-number-of-syllables-in-a-word-in-javascript
function number_of_syllables(word) {
    word = word.toLowerCase().replace('.','').replace('\n',''); // lower case plus remove periods and line returns
    if(word.length <= 3) {
        return 1; //return 1 if word.length <= 3
    }
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    syllable_string = word.match(/[aeiouy]{1,2}/g);
    
    // check if word is actually a word with length
    if(!!syllable_string){
        syllables = syllable_string.length;
    }else{
        syllables=0;
    }
    return syllables;
}

var t=''; // container for getting selected text from browser
if(window.getSelection){
    t = window.getSelection();
}else if(document.getSelection){
    t = document.getSelection();
}else if(document.selection){
    t = document.selection.createRange().text;
}

var text; // container for plain text
text=String(t); //remove all other information the browser passes about the selected text, other than the actual text

var wholeDocumentSelected = false; // does the user want to analyze the entire document?

if (text==''){ // if no selected text from the browser
    text = jQuery('body').text(); // get all of the text from the document using jQuery
    wholeDocumentSelected = true;   
}

// WORD COUNT //
words_raw = text.replace(/[.!?-]+/g,' ').split(' '); // collection of all words
var words = 0;
for (var i = 0; i < words_raw.length; i++) {
    if(words_raw[i]!=0){ // check if word is a real word
        words = words + 1; // increment word count
    }
}

// SENTENCE COUNT //
sentences_raw = text.split(/[.!?]+/); // collection of all sentences
var sentences = 0;
for (var i = 0; i < sentences_raw.length; i++) {
    if(sentences_raw[i]!=''){ // check if sentence is a real sentence (has length)
        sentences = sentences + 1; // increment sentence count
    }
}


// SYLLABLE COUNT //
var total_syllables = 0; // total syllable count
var syllables1 = 0; // number of 1 syllable words
var syllables2 = 0; // number of 2 syllable words
for (var i = 0; i < words_raw.length; i++) {
    if(words_raw[i]!=0){ // if a real word
        syllable_count = number_of_syllables(words_raw[i]);
        if(syllable_count==1){
            syllables1 = syllables1 + 1; // increment 1 syllable words
        }
        if(syllable_count==2){
            syllables2 = syllables2 + 1; // increment 2 syllable words
        }
        total_syllables = total_syllables + syllable_count; // add total syllables
    }
}

var characters = text.replace(/[.!?|\s]+/g,'').length; // number of characters
var pollysyllables = (words-(syllables1+syllables2)); // number of words with 3 syllables or more

var flesch_reading_ease = 206.835 - (1.015 * words/sentences) - (84.6 * total_syllables/words)

// restrict the range to 0-100
if(flesch_reading_ease > 100){
    flesch_reading_ease = 100;
} else if(flesch_reading_ease < 0) {
    flesch_reading_ease = 0;
}

var gunning_fog_index = (words/sentences + 100*(pollysyllables/words)) * 0.4;

var flesch_kincaid_grade_level = (0.39 * words/sentences) + (11.8 * total_syllables/words) - 15.9;

var automated_readability_index = 4.71 * (characters/words) + 0.5 * (words/sentences) - 21.43;

var smog = 1.0430 * Math.sqrt(pollysyllables*30/sentences) + 3.1291

var coleman_liau = 0.0588 * (100*characters/words) - 0.296 * (100*sentences/words) - 15.8;

var msg ='';
    
msg = msg + 'Flesch Reading Ease: ' + flesch_reading_ease.toFixed(1);
msg = msg + '\nWCAG2 AAA requires 60 or greater'
msg = msg + '\n\n';
msg = msg + 'Grade Level Average: ' + ((flesch_kincaid_grade_level + gunning_fog_index + automated_readability_index + coleman_liau + (sentences>=30?smog:0))/(sentences>=30?5:4)).toFixed(1);
msg = msg + '\n';
msg = msg + '(Flesch-Kincaid): ' + flesch_kincaid_grade_level.toFixed(1);
msg = msg + '\n';
msg = msg + '(Gunning-Fog): ' + gunning_fog_index.toFixed(1);
msg = msg + '\n';
msg = msg + '(Automated Readability): ' + automated_readability_index.toFixed(1);
msg = msg + '\n';
msg = msg + '(Colemane-Liau): ' + coleman_liau.toFixed(1);
msg = msg + '\n';
msg = msg + (sentences>=30?'(SMOG): ' + smog.toFixed(1) + '\n':'');
msg = msg + 'WCAG2 AAA requires grade 9 or lower';
msg = msg + '\n\n';
msg = msg + 'Words: ' + words;
msg = msg + '\n';
msg = msg + 'Complex Words: ' + Math.round(100*((words-(syllables1+syllables2))/words)) +'%';
msg = msg + '\n';
msg = msg + 'Sentences: ' + sentences;
msg = msg + '\n';
msg = msg + 'Words Per Sentence: ' + (words/sentences).toFixed(1);
msg = msg + '\n';
msg = msg + 'Syllables: ' + total_syllables;
msg = msg + '\n';
msg = msg + 'Characters: ' + characters;
if(wholeDocumentSelected) {
    msg = msg + '\n\n';
    msg = msg + "For more accurate results, first select the text in your page you would like to analyze then reactivate the tool.";
}
    
alert (msg);
