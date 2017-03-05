var pokemons =
// [Pokemon, percent, level of importance (1-5) - 5 is most important,
// words that have to be included (moves), words that cannot be included]
[
    ['aerodactyl', 70, 5, [], ['ancient']],
    ['lapras', 70, 5, ['blizzard'], []],
    ['porygon', 70, 5, [], []],
    ['muk', 70, 5, ['gunk'], []],
    ['weezing', 70, 5, ['bomb'], []],
    ['unown', 0, 5, [], []],


    ['dratini', 82, 4, [], []],
    ['grimer', 82, 4, [], []],
    ['koffing', 82, 4, [], []],

    ['remoraid', 82, 3, [], []],
    ['hitmonlee', 85, 3, [], []],
    ['hitmonchan', 85, 3, [], []],
    ['skarmory', 85, 3, [], []],
    ['mantine', 82, 3, [], []],
    ['togetic', 0, 3, [], []],
    ['chinchou', 87, 3, [], []],
    ['larvitar', 82, 3, [], []],
    ['mareep', 82, 3, [], []],
    ['sneasel', 82, 3, [], []],
    ['tauros', 82, 3, ['tackle', 'earthquake'], []],
    ['pinsir', 82, 3, ['smash', 'combat'], []]
];

var rarityLevels = ['common', 'uncommon', 'rare', 'important', 'ultra'];
var seenSent = [];

console.log('start');

function sendEmail(subject, importance, location, details) {
    var fullSubject = 'subject ' + rarityLevels[importance-1] + ' ' + subject;

    var result = $.ajax({
      type: "POST",
      url: "pokemonmap-159806.appspot.com/email",
      data: {
        'subject': fullSubject,
        'body': location
      }
    });
    console.log('Sent email: ' + fullSubject);
};

function processMsg(perc, location, analyzeText) {
    var goodWordsFound = true;
    var badWordsFound = false;
    for (var i=0; i < pokemons.length; i++) {
        var poke = pokemons[i];
        if (analyzeText.indexOf(poke[0]) < 0) continue;
        if (perc < poke[1]) continue;

        for (var j=0; j < poke[3].length; j++) {
            var word = poke[3][j];
            if (analyzeText.indexOf(word) < 0) goodWordsFound = false;
        }

        if (!goodWordsFound) continue;

        for (var k=0; k < poke[4].length; k++) {
            var word = poke[4][k];
            if (analyzeText.indexOf(word) > -1) badWordsFound = true;
        }

        if (badWordsFound) continue;

        sendEmail(poke[0], poke[2], location, analyzeText + ']');
        break;
    }
}

var initialize = function() {
    $('ts-message').remove();
}

var run = function() {
    $('ts-message').each(function() {
        var thisId = $(this).attr('id');
        console.log('Processing ' + thisId);
        var msgBody = $(this).find('.message_body');
        var timeStr = 'Til' + msgBody.text().split('Til')[1];
        var fullTimeStr = timeStr.split(')')[0] + ')';
        var perc = parseInt(msgBody.find('a b').text().replace('%',''));
        if (isNaN(perc)) {
            perc = parseInt(msgBody.find('b:first').text().replace('%',''));
        }
        if (isNaN(perc)) {
            console.log('Error with ' + msgBody.text());
            $(this).remove();
            return;
        }
        if (seenSent.indexOf(thisId) > -1) return;
        var location = msgBody.find('a').attr('href');
        var analyzeText = msgBody.text().split(']')[0].toLowerCase();
        processMsg(perc, location, analyzeText);
        seenSent.push(thisId);
        console.log('Removing ' + thisId);
        $(this).remove();
    })
    setTimeout(run, 3000);
}
