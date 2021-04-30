let canvas, 
    mouseX  = 0,
    mouseY  = 0,
    key     = false, 
    clicked = false,
    running = true,
    ctx, 
    wid, 
    hei, 
    size,
    memTime = 0,
    aktuell = 0,
    images  = [], 
    audios  = [],
    phase   = 0,    // Phase 0: Start, 1: Tor Tor Tor
    punkte  = 0,
    darkFactor = 1

document.addEventListener('mousemove', mouseMove)
document.addEventListener('mousedown', mouseDown)
document.addEventListener('keyup',     keyUp)
window.  addEventListener('resize',    getSize)

function mouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function mouseDown() {
  clicked = true
}

function keyUp(e) {
  key = ['a', 'b', 'c', 'd'].includes(e.key) ? e.key : false
}

function getSize() {
  wid    = canvas.width  = document.documentElement.clientWidth
  hei    = canvas.height = document.documentElement.clientHeight
  size = Math.min(wid / 34, hei / 22)
}

window.onload = function() {
  canvas = document.getElementById('C')
  ctx    = canvas.getContext('2d')
  ctx.textBaseline = 'middle'
  getSize()

  let img = ['start', 'klopp', 'lewa', 'ronaldo', 'messi', 'kimmich', 'mainz', 'sprechblase', 'quiz',
             'typ0', 'typ1', 'typ2', 'typ3', 'typ4', 'typ5']
  let aud = ['leben', 'tor', 'ehrung0', 'ehrung1', 'ehrung2', 'ehrung3', 'ende', 'quiz']

  for (let i = 0; i < Math.max(img.length, aud.length); i++) {
    images[i]     = new Image()
    images[i].src = `./rsc/${img[i]}.png`

    if (aud[i]) {
      audios[i]    = new Audio()
      audios[i].src= `./rsc/${aud[i]}.mp3`
    }
  }
  loop()
}

function loop() {
  background()
  phaseContent()
  clicked = false
  key     = false

  if (running)
    requestAnimationFrame(loop)
}

function phaseContent() {
  if (phase == 0) 
    startFenster()
  if (phase == 1)
    torTorTor()
  if (phase == 2)
    leben()
  if (phase == 3)
    quiz()
  if (phase == 4)
    ehrung()
}

function startFenster() {
  let w = wid / 2,
      h = hei / 2

  ctx.drawImage(images[0],w -75 , h -75, 150, 150)
  if (clicked && Math.hypot(mouseX - w, mouseY - h) < wid / 12) 
    phase = 1
}

function torTorTor() {
  darkFactor *= .995
  if (darkFactor < .92 && darkFactor > .75) 
    audios[1].play()
  if (darkFactor > .5) 
    return

  phase = 2
  audios[0].play()
}

function leben() {
  if (audios[0].currentTime > 27)
    audios[0].volume *= .993
  if (audios[0].currentTime > 29.5) 
    audios[0].pause()

  if (audios[0].currentTime > .3) {
    write('Alles Gute',      wid / 2, hei * .1, size * 2, 'orange')
    write('zum Geburtstag,', wid / 2, hei * .2, size * 2, 'orange')
    write('lieber Moritz!',  wid / 2, hei * .3, size * 2, 'orange')
  } 
  showStars()
}

function showStars(time = audios[0].currentTime / 29.5) {
  if (time > .1) {
    ctx.drawImage(images[1], wid * .3, hei * .6, wid * .35, hei * .4)
    ctx.drawImage(images[7], wid * .5, hei * .5, wid / 5.5, hei / 4.5)
    write('Super',   wid * .6, hei * .583, size * .9, 'black')
    write('Moritz!', wid * .6, hei * .63, size * .9, 'black')
  }

  if (time > .27) {
    ctx.drawImage(images[2], 0,         hei * .6, wid * .25, hei * .4)
    ctx.drawImage(images[7], wid * .15, hei * .44, wid / 5.5, hei / 4.5)
    write('Happy', wid * .247 , hei * .525,  size * .8, 'black')
    write('Birthday!', wid * .247 , hei * .57, size * .8, 'black')
  }

  if (time > .53) {
    ctx.drawImage(images[3], wid * .65, hei * .6, wid * .35, hei * .6)
    ctx.drawImage(images[7], wid * .8, hei * .53, wid / 5.5, hei / 4.5)
    write('So ein', wid * .9, hei * .615,  size * .9, 'black')
    write('Kuchen!', wid * .9, hei * .658,  size * .9, 'black')
  }

  if (time > .7) {
    ctx.drawImage(images[5], wid * .66, 0, wid * .35, hei * .62)
    ctx.save()
    ctx.translate(wid * .87, hei * .47)
    ctx.rotate(Math.PI)
    ctx.drawImage(images[7], 0, 0, wid/5, hei/4)
    ctx.restore()
    write('WILL AUCH',   wid * .76,  hei * .338, size * .65, 'black')
    write('GEBURTSTAG!!', wid * .76, hei * .38,  size * .65, 'black')
  }

  if (time > .9) {
    let val = Math.max(0, (time - .9)) * 2700 - 300
    ctx.drawImage(images[8], val + size, size * -2, size * 10, size * 12)
    if (clicked && mouseX > wid * .05 && mouseX < wid * .25 && mouseY > hei * .05 && mouseY < hei * .25)
      phase = 3
  }
}

function quiz() {
  audios[7].play()
  audios[7].volume = .35
  let fragen  = []
  for (let i = 0; i < 10; i++)
    fragen.push(new Frage(i))

  rect(.25 * wid, .2 * hei, .5 * wid, .6 * hei, 'rgba(0, 0, 0, .5)', 'silver', size / 3)
  write(fragen[aktuell].frage, wid / 2, hei * .3, size * .8, 'gold')
  for (let i = 0; i < 4; i++)
    write(`${['A', 'B', 'C', 'D'][i]}) ${fragen[aktuell].antworten[i]}`, wid / 2, hei * .45 + i * size * 1.2 , size, 'goldenrod')
  write('(Drücke eine Taste!)', wid / 2, hei * .7, size * .7, 'silver')

  if (key) {
    if (key == fragen[aktuell].richtige) 
      punkte++
    aktuell++
    if (aktuell >= fragen.length) {
      audios[7].pause()
      phase = 4
    }
  }
}

function ehrung() {
  background()
  ctx.drawImage(images[9 + Math.floor(punkte / 2)], wid /2 - size * 7, hei / 2 - size * 7, size * 14, size * 14)
  write(`${punkte}/10 Punkte`, wid * .5, hei / 2 + size * 8, size * 1, 'gold')

  running = false
  let nr = punkte < 3 ? 0 : punkte < 7 ? 1 : punkte < 10 ? 2 : 3
  audios[2 + nr].play()

  setTimeout( _ => {
    audios[6].play()
    running = false
  }, 4000)
  
}

function background() {
  ctx.drawImage(images[6], 0, 0, wid, hei)
  rect(0, 0, wid, hei, `rgba(0, 0, 0, ${darkFactor}`)
}

function rect(x, y, w, h, col, stroke, thick = 2) {
  if (col) {
    ctx.fillStyle = col
    ctx.fillRect(x, y, w, h)
  }
  if (stroke) {
    ctx.lineWidth   = thick
    ctx.strokeStyle = stroke
    ctx.strokeRect(x, y, w, h)
  }
}

function write(text, x, y, size, col, align = 'center') {
  ctx.font = `${size}px Comic Sans MS`
  ctx.fillStyle = col
  ctx.textAlign = align
  ctx.fillText(text, x, y)
}

class Frage {
  constructor(i) {
    this.id         = i
    this.frage      = this.getFrage(i)
    this.antworten  = this.getAntworten(i)
    this.richtige   = ["b", "c", "a", "d", "c", "a", "c", "a", "d", "a"][i]
  }

  getFrage(i) {
    return ['Wann wurde der FSV Mainz gegründet?',
            'Wer ist Letzter in der Bundesliga?',
            'Wer machte ein Tor mit der "Hand Gottes"?',
            'Welches Land wurde nie Weltmeister?',
            'In der Bundesliga spielen...',
            'Können Frauen auch Fußball spielen?',
            'Wer wird auch "der Kaiser" genannt?',
            'Klopp als Spieler hatte...',
            'Wo gibt es keinen Bundesligaverein?',
            'Was passiert bei passivem Abseits?'][i]    
  }

  getAntworten(i) {
    return [['Am 24.07.1901','Am 16.03.1905', 'Am 15.02.1928', 'Am 22.11.1968'],
            ['1.FC Köln', 'TSG Hoffenheim', 'Schalke 04', 'VfB Stuttgart'],
            ['Maradona', 'Beckenbauer', 'Messi', 'Pele'],
            ['Frankreich', 'Deutschland', 'Italien', 'Niederlande'],
            ['14 Vereine', '16 Vereine', '18 Vereine', '20 Vereine'],
            ['Ja, manche sogar sehr gut!', 'Nein, das ist verboten!', 'Nein, sie sind zu klein!', 'Nein, es ist zu gefährlich!'],
            ['Lothar Matthäus', 'Uwe Seeler', 'Franz Beckenbauer', 'Jürgen Klopp'],
            ['0 Bundesligaeinsätze', '48 Bundsligaeinsätze', '163 Bundesligaeinsätze', '345 Bundesligaeinsätze'],
            ['Bayern', 'Hessen', 'Rheinlanz-Pfalz', 'Saarland'],
            ['Es wird weiter gespielt', 'Es wird abgepfiffen', 'Das Spiel wird beendet', 'Es gibt die Rote Karte']][i]
  }
}