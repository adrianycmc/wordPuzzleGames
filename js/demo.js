
buzz.defaults.formats = ['ogg', 'mp3'];
buzz.defaults.preload = 'metadata';
 
var games = [
    { img: 'img/koala.png', color: '#176580', word: 'koala', sound: 'sounds/koala' },
    { img: 'img/elephant1.png', color: '#a36513', word: 'elephant', sound: 'sounds/elephant' },
    { img: 'img/monkey.png', color: '#ffc48b', word: 'monkey', sound: 'sounds/monkey' },
    { img: 'img/bear.png', color: '#807148', word: 'bear', sound: 'sounds/bear' },
    { img: 'img/horse.png', color: '#bc9e6c', word: 'horse', sound: 'sounds/horse' },
    { img: 'img/bull.png', color: '#ff5f09', word: 'bull', sound: 'sounds/bull' },
    { img: 'img/rabbit.png', color: '#c81f27', word: 'rabbit', sound: 'sounds/rabbit' },
    { img: 'img/tiger.png', color: '#b3eef4', word: 'tiger', sound: 'sounds/tiger' },
    { img: 'img/turtle.png', color: '#d5ea86', word: 'turtle', sound: 'sounds/turtle' },
    { img: 'img/lion1.png', color: '#dd992d', word: 'lion', sound: 'sounds/lion' },
    { img: 'img/duck.png', color: '#ffd255', word: 'duck', sound: 'sounds/duck' },
    { img: 'img/cat.png', color: '#cd9057', word: 'cat', sound: 'sounds/cat' },
    { img: 'img/dog.png', color: '#f9cb9c', word: 'dog', sound: 'sounds/dog' },
    { img: 'img/fish.png', color: '#ff6f1d ', word: 'fish', sound: 'sounds/fish' },
    { img: 'img/dolphin.png', color: '#008E97 ', word: 'dolphin', sound: 'sounds/dolphin' },
    { img: 'img/shark.png', color: '#daeaea ', word: 'shark', sound: 'sounds/shark' },
    { img: 'img/eagle.png', color: '#ac6e04', word: 'eagle', sound: 'sounds/eagle' },
    { img: 'img/wolf.png', color: '#978989', word: 'wolf', sound: 'sounds/wolf' },
    { img: 'img/penguin.png', color: '#58cfe8', word: 'penguin', sound: 'sounds/penguin' },
    { img: 'img/chicken.png', color: '#fafafa', word: 'chicken', sound: 'sounds/chicken' }
];
 
var winSound = new buzz.sound('sounds/win'),
    errorSound = new buzz.sound('sounds/error'),
    alphabetSounds = {},
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
 
for (var i in alphabet) {
    var letter = alphabet[i];
    alphabetSounds[letter] = new buzz.sound('sounds/kid/' + letter);
}

// Implementação 1
// Atualização e exibição dos pontos na tela
var score = 0;

function attScore() {
    $('#score').text('Pontuação: ' + score);
}


// Implementação 2
// Função que indica o fim do jogo após completar os 20 bichinhos, parabeniza o jogador e zera o placar

function fimDeJogo() {
    if(score >= 200) {
        alert("Parabéns!🥳 \n Você chegou ao fim do jogo.🤖\n Quer jogar de novo❓");
        score = 0;
        attScore();
    }
}
 
$(function () {
    if (!buzz.isSupported()) {
        $('#warning').show();
    }
 
    var idx = 0,
        $container = $('#container'),
        $picture = $('#picture'),
        $models = $('#models'),
        $letters = $('#letters');


 
    $('body').bind('selectstart', function () {
        return false
    });
 
    $('#next').click(function () {
        refreshGame();
        buildGame(++idx);
        return false;
    });
 
    $('#previous').click(function () {
        refreshGame();
        buildGame(--idx);
        return false;
    });
 
    $('#level').click(function () {
        if ($(this).text() == 'easy') {
            $(this).text('hard');
            $models.addClass('hard');
        } else {
            $(this).text('easy');
            $models.removeClass('hard');
        }
        return false;
    });
 
    function refreshGame() {
        $('#models').html('');
        $('#letters').html('');
    }
 
    function buildGame(x) {
        if (x > games.length - 1) {
            idx = 0;
        }
        if (x < 0) {
            idx = games.length - 1;
        }
 
        var game = games[idx],
            score = 0;
 
        var gameSound = new buzz.sound(game.sound);
        gameSound.play();
 
        // Fade the background color
        $('body').stop().animate({
            backgroundColor: game.color
        }, 1000);
        $('#header a').stop().animate({
            color: game.color
        }, 1000);
 
        // Update the picture
        $picture.attr('src', game.img)
            .unbind('click')
            .bind('click', function () {
                gameSound.play();
            });
 
        // Build model
        var modelLetters = game.word.split('');
 
        for (var i in modelLetters) {
            var letter = modelLetters[i];
            $models.append('<li>' + letter + '</li>');
        }
 
        var letterWidth = $models.find('li').outerWidth(true);
 
        $models.width(letterWidth * $models.find('li').length);
 
        // Build shuffled letters
        var letters = game.word.split(''),
            shuffled = letters.sort(function () { return Math.random() < 0.5 ? -1 : 1 });
 
        for (var i in shuffled) {
            $letters.append('<li class="draggable">' + shuffled[i] + '</li>');
        }
 
        $letters.find('li').each(function (i) {
            var top = ($models.position().top) + (Math.random() * 100) + 80,
                left = ($models.offset().left - $container.offset().left) + (Math.random() * 20) + (i * letterWidth),
                angle = (Math.random() * 30) - 10;
 
            $(this).css({
                top: top + 'px',
                left: left + 'px'
            });
 
            rotate(this, angle);
 
            $(this).mousedown(function () {
                var letter = $(this).text();
                if (alphabetSounds[letter]) {
                    alphabetSounds[letter].play();
                }
            });
        });
 
        $letters.find('li.draggable').draggable({
            zIndex: 9999,
            stack: '#letters li'
        });
 
        $models.find('li').droppable({
            accept: '.draggable',
            hoverClass: 'hover',
            drop: function (e, ui) {
                var modelLetter = $(this).text(),
                    droppedLetter = ui.helper.text();
 
                if (modelLetter == droppedLetter) {
                    ui.draggable.animate({
                        top: $(this).position().top,
                        left: $(this).position().left
                    }).removeClass('draggable').draggable('option', 'disabled', true);
 
                    rotate(ui.draggable, 0);
 
                    score++;
 
                    if (score == modelLetters.length) {
                        winGame();
                    }
                } else {
                    ui.draggable.draggable('option', 'revert', true);
 
                    errorSound.play();
 
                    setTimeout(function () {
                        ui.draggable.draggable('option', 'revert', false);
                    }, 100);
                }
            }
        });
    }
 
    function winGame() {
        winSound.play();

        $('#letters li').each(function (i) {
            var $$ = $(this);
            setTimeout(function () {
                $$.animate({
                    top: '+=60px'
                });
            }, i * 300);
        });
 
        setTimeout(function () {
            refreshGame();
            buildGame(++idx);
        }, 3000);

// Implementação 3
// Adiciona 10 pontos com o acerto da palavra e chama a função attScore para atualizar o placar

        score += 10;
        attScore();
    }
 
    function rotate(el, angle) {
        $(el).css({
            '-webkit-transform': 'rotate(' + angle + 'deg)',
            '-moz-transform': 'rotate(' + angle + 'deg)',
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)'
           
        });

// Implementação 4
// Chamada da função de finalização do jogo parabenizando o jogador
        fimDeJogo();
    }

    buildGame(idx);
});



