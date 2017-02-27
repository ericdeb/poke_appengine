var pokemons =
// [Pokemon, percent, level of importance (1-5) - 5 is most important,
// words that have to be included (moves), words that cannot be included]
[
    ['Aerodactyl', 75, 5, [], ['Ancient']],
    ['Hitmonlee', 80, 3, [], []],
    ['Hitmonchan', 85, 3, [], []],
    ['Skarmory', 85, 3, [], []],
    ['Mantine', 85, 4, [], []],
    ['Togetic', 0, 4, [], []],
    ['Remoraid', 90, 4, [], []],
    ['Grimer', 90, 4, [], []],
    ['Weezing', 80, 4, [], []],
    ['Lapras', 0, 5, [], []],
    ['Teddiursa', 90, 3, [], []],
    ['Porygon', 0, 5, [], []],
    ['Unown', 0, 5, [], []],
    ['Dratini', 85, 4, [], []]
];

var rarityLevels = ['common', 'uncommon', 'rare', 'important', 'ultra'];

console.log('start');

function sendEmail(subject, importance, location, details) {
    var fullSubject = rarityLevels[importance-1] + ' ' + subject;

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
            if (analyzeText.indexOf(word) > 0) badWordsFound = true;
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
        var msgBody = $(this).find('.message_body');
        var timeStr = 'Til' + msgBody.text().split('Til')[1];
        var fullTimeStr = timeStr.split(')')[0] + ')';
        var perc = parseInt(msgBody.find('a b').text().replace('%',''));
        if (isNaN(perc)) {
            perc = parseInt(msgBody.find('b:first').text().replace('%',''));
        }
        if (isNaN(perc)) {
            console.log('Error with ' + msgBody.text());
            return;
        }
        var location = msgBody.find('a').attr('href');
        var analyzeText = msgBody.text().split(']')[0];
        processMsg(perc, location, analyzeText);
        $(this).remove();
    })
    setTimeout(run, 3000);
}