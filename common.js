let synth = window.speechSynthesis;
let gl = new webkitSpeechGrammarList();
gl.addFromString("#JSGV V1.0; grammar code; public <code> = tornado wildflower", 1);

function getMaleVoice() {
  return synth.getVoices().find((x) => { return (x.name == 'Google UK English Male'); });
}

function getVoice() {
  if (document.body.className == 'note') {
    // return synth.getVoices().find((x) => { return (x.lang == 'ja-JP'); });
    return synth.getVoices().find((x) => { return (x.lang == 'Google US English Female'); });
  } else {
    return synth.getVoices().find((x) => { return (x.name == 'Google UK English Female'); });
  }
}

function addButton(msg) {
  let el = document.createElement('button');
  el.className = 'open-door-btn';
  el.innerText = msg;
  document.body.append(el);
  el.scrollIntoView();
}

function showImage(url) {
  let el = document.createElement('img');
  el.src = url;
  el.width = 500;
  el.style.width = '500px';
  document.body.append(el);
  el.scrollIntoView();
}

function say(msg) {
  console.log('say ' + msg);
  return new Promise((resolve, reject) => {
    let tmr = setTimeout(resolve, 5000);
    let voice = getVoice();
    let p = document.createElement('p');
    p.innerText = msg;

    let speech = new SpeechSynthesisUtterance(msg);
    speech.voice = voice;
    // speech.pitch = 1.1;
    // speech.rate = 1.1;
    speech.onstart = () => { document.body.append(p); p.scrollIntoView(); }
    speech.onend = () => { console.log('ended'); clearTimeout(tmr); resolve(); };

    synth.speak(speech);
    console.log('spoken');
  });
}

function sayMale(msg) {
  console.log('say ' + msg);
  return new Promise((resolve, reject) => {
    let tmr = setTimeout(resolve, 5000);
    let voice = getMaleVoice();
    let p = document.createElement('p');
    p.className = "male";
    p.innerText = msg;

    let speech = new SpeechSynthesisUtterance(msg);
    speech.voice = voice;
    speech.pitch = 0.8;
    speech.rate = 0.8;
    speech.onstart = () => { document.body.append(p); p.scrollIntoView(); }
    speech.onend = () => { console.log('ended'); clearTimeout(tmr); resolve(); };

    synth.speak(speech);
    console.log('spoken');
  });
}

function tryit() {
  return new Promise((resolve, reject) => {
    let popup = document.getElementById('popup');
    popup.style.display = 'block';

    let recog = new webkitSpeechRecognition();
    let tmr = setTimeout(() => { recog.abort(); reject(); }, 5000);
    recog.grammars = gl;
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (e) => {
      clearTimeout(tmr);
      let text = e.results[0][0].transcript;
      if (text.toLowerCase() == "tornado wildflower" || text.toLowerCase() == "wildflower tornado") {
        say("Thank you. Opening door.").then(() => resolve());
      } else {
        say("You said " + text).then(() => { say("that is incorrect"); reject(); });
      }
    };
    recog.start();
  });
}

