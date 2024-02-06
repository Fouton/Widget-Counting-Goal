let fieldData;
let currentPoints = 0;
let sessionData;
let counter = 0;

window.addEventListener('onEventReceived', (obj) => {
    if(!obj.detail.event) return;
    if (obj.detail.event.listener === 'widget-button') {
      if (obj.detail.event.field === 'addRun') {
        counter += 1;
        AnalysePoints();
      }
      else if (obj.detail.event.field === 'completeRun') {
        counter -= 1;
        AnalysePoints();
      }
      else if (obj.detail.event.field === 'resetData') {
        counter = 0;
        currentPoints = 0;
        AnalysePoints();
      }
      return;
    }
    let event = obj.detail.listener;
    let data = obj.detail.event;
    if (data.bulkGifted)
      return;
  	if (event == 'subscriber-latest') {
      HandleIncrease((data.tier ? tierValue(data.tier) : 1) * fieldData.subValue);
    }
  	else if (event == 'cheer-latest') {
      HandleIncrease(data.amount*fieldData.bitsValue);
    }
  	else if (event == 'tip-latest') {
      HandleIncrease(data.amount*fieldData.donationValue);
    }
});

window.addEventListener('onWidgetLoad', (obj) => {
    fieldData = obj.detail.fieldData;
  	LoadState();
  	AnalysePoints(false);
});

function tierValue(tier) {
  if (tier == 3000) return 6;
  else if (tier == 2000) return 2;
  else return 1;
}

function HandleIncrease(amount) {
  	currentPoints += amount;
  	while (currentPoints >= fieldData.goal) {
      counter += 1;
      currentPoints -= fieldData.goal;
    }
  	AnalysePoints();
}

function LoadState() {
  	SE_API.store.get('hatgoal').then(obj => {
        if (obj !== null) {
            currentPoints = obj.current;
          	counter = obj.counter;
        }
    });
}

function SaveState() {
    SE_API.store.set('hatgoal', {counter: counter, current: currentPoints});
}

function CleanText(text) {
  	let cleanedText = text.replace("0","O");
  	return cleanedText;
}

function AnalysePoints(save = true) {
  	if (save) SaveState();
    let percentage = currentPoints / fieldData.goal * 100;
  	if (fieldData.counterFontName == "Motion Control")
    	$("#hatcount").text(CleanText(counter.toString())); 
  	else
    	$("#hatcount").text(counter);
    $("#bar").css('width', Math.min(100, percentage) + "%");
    $("#percent").text(parseFloat(currentPoints).toFixed(2));
}

function Test(amount) {
    $("#hatcount").text(amount);
}