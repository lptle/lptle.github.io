const SDK = lpTag.agentSDK || {};
SDK.init();
$(document).ready(function() {
	$('#submit').click(function() {
		sendDatePicker();
	});
	$('#s_submit').click(function() {
		sendScheduleSlotList();
	});
	$('#title').on('input',function() {
		$('#chCounter').text('('+ $('#title').val().length + ')');
	});
	$('#s_title').on('input',function() {
		$('#s_chCounter').text('('+ $('#s_title').val().length + ')');
	});
	document.getElementById('s_start').valueAsDate = new Date();
	$("#copyText").click(function(){
		$("#outputArea").select();
		document.execCommand('copy');
	});
});
 
function sendDatePicker() {
	let title = $('#title').val();
	let start = $('#start').val();
	let end = $('#end').val();
	let type = $('#type').val();
	let minDate = start ? new Date(start) / 1000 : undefined;
	let maxDate = end ? new Date(end) / 1000 : undefined;
	console.log('>> sending date picker', title, minDate, maxDate, type);
	let rc = {
		"type": "vertical",
		"border": "dropShadow",
		"elements": [
			{
				"type": "button",
				"tooltip": "Pick a day",
				"title": "PICK A DAY",
				"class": "button",
				"style": {
					"background-color": "#0363AD",
					"color": "#ffffff",
					"size": "medium",
					"bold": true
				},
				"click": {
					"actions": [
						{
							"type": "datePicker",
							"class": type
						}
					]
				}
			}
		]
	};
	if (title.length > 0) {
		rc.elements[0].click.actions[0].title = title
	}
	if (Number.isInteger(minDate)) {
		rc.elements[0].click.actions[0].minDate = minDate
	}
	if (Number.isInteger(maxDate)) {
		rc.elements[0].click.actions[0].maxDate = maxDate
	}
	let data = {
		json: JSON.stringify(rc)
	}
	$('#outputArea').val(data.json);
	SDK.command(SDK.cmdNames.writeSC, data, function (err) {
		let mee = err ? err : 'datePicker sent';
		console.log('>>', mee);
	});
}

function sendScheduleSlotList() {
	const title = $('#s_title').val();
	const firstDayOfTheWeek = $('#s_firstDayOfTheWeek').val();
	const start = $('#s_start').val();
	const days = parseInt($('#s_days').val(), 10);
	const gap = parseInt($('#s_gap').val(), 10);
	const perDay = parseInt($('#s_perDay').val(), 10);
	const startTime = $('#s_startTime').val();
	const slotInterval = 60;
	let nextSlotTime, nextEndSlotTime, slotsStartTime;
	
	aString = [8,0];
	if (start) {
		if (startTime) {
			aString = startTime.split(":");
		}
	}
	const slots = [];
	slotsStartTime = new Date(start).setHours(aString[0],aString[1]);
	for(let y=0; y<days; y++) {
		nextSlotTime = slotsStartTime;
		var slotPerDay = perDay;
		if ($('#s_perDayRandom').is(':checked')) {
			slotPerDay = Math.floor(Math.random() * (perDay + 1));
		}
		for(let i = 0; i < slotPerDay; i++) {
			nextEndSlotTime = nextSlotTime + slotInterval * 60 * 1000;
			let slot =  {
				"type": "scheduleSlot",
				"id": "" + nextSlotTime,
				"start": nextSlotTime / 1000,
				"end": nextEndSlotTime / 1000,
				// "title": "Day_"+ (y+1) +"_Slot_" + (i+1),
				//"description": "Slot " + (i+1) + " of " + slotInterval + "M"
			}
			switch ($('#s_title option').filter(':selected').val()) {
				case "1":
					slot.title = "Day_"+ (y+1) +"_Slot_" + (i+1);
					break;
				case "2":
					if (Math.random() < 0.5) {
						slot.title = "Day_"+ (y+1) +"_Slot_" + (i+1);
					}
					break;
			}
			switch ($('#s_description option').filter(':selected').val()) {
				case "1":
					slot.description = "Slot " + (i+1) + " of " + slotInterval + "M";
					break;
				case "2":
					if (Math.random() < 0.5) {
						slot.description = "Slot " + (i+1) + " of " + slotInterval + "M";
					}
					break;
			}
			
			if ($('#s_imageUrl').is(':checked')) {
				imageUrl = 'https://robohash.org/'+ nextSlotTime +'.png?size=35x35&set=set2';
				if ($('#s_imageRandom').is(':checked')) {
					if (Math.random() < 0.7) {
						slot.imageUrl = imageUrl;
					}
				} else {
					slot.imageUrl = imageUrl;
				}
			}
			slots.push(slot);
			nextSlotTime = nextEndSlotTime;
		}
		slotsStartTime = slotsStartTime + ((gap + 1) * 24 * 60 * 60 * 1000);
	}

	let rc = {
		"type": "vertical",
		"border": "dropShadow",
		"elements": [
		  {
			"type": "horizontal",
			"borderLine": false,
			"elements": [
			  {
				"type": "vertical",
				"elements": [
				  {
					"type": "text",
					"text": "Schedule List",
					"tooltip": "text tooltip",
					"style": {
					  "bold": true,
					  "size": "large"
					}
				  },
				  {
					"type": "text",
					"text": "Select appointment for your repair",
					"tooltip": "text tooltip"
				  }
				]
			  }
			]
		  },
		  {
			"type": "button",
			"tooltip": "button tooltip",
			"title": "Select appointment",
			"class": "button",
			"style": {
			  "background-color": "#3736A6",
			  "color": "#ffffff",
			  "border-radius": 10,
			  "border-color": "#000000",
			  "size": "medium",
			  "bold": true
			},
			"click": {
			  "actions": [
				{
				  "type": "scheduleSlotList",
				  "title": title,
				  "firstDayOfTheWeek": firstDayOfTheWeek,
				  "slots": slots
				}
			  ]
			}
		  }
		]
	}
	console.log(rc);
	let data = {
		json: JSON.stringify(rc)
	}
	$('#outputArea').val(data.json);
	SDK.command(SDK.cmdNames.writeSC, data, function (err) {
		let mee = err ? err : 'datePicker sent';
		console.log('>>', mee);
	});
}