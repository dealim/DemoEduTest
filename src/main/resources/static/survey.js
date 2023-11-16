//전역 변수
var x;
var count;
var current;
var percent;
var z = [];
var examEndTime;

// 페이지가 로드되면 'show' 클래스를 추가(페이드인 애니메이션용)
window.addEventListener("load", function() {
	// 페이지 로딩이 시작된 시간
	document.body.classList.add("show");
	// 쿠키에서 종료 시간 가져오기
	var endTimeFromCookie = getCookie("examEndTime");

	// 쿠키에 종료 시간이 없으면 새로 설정
	if (!endTimeFromCookie) {
		examEndTime = new Date(Date.now() + 20 * 90000); // 20분 후
		setCookie("examEndTime", examEndTime.toISOString(), 1/48); // 30분 동안 쿠키를 유지
	} else {
		examEndTime = new Date(endTimeFromCookie);
	}
	// 페이지 로드될 때 초기 시간 업데이트
	displayRemainingTime();
	// 1초마다 시간 업데이트
	setInterval(displayRemainingTime, 1000);
});

//jquery를 통해 결과창 숨김
$('.mm-prev-btn').hide();
$('.mm-survey').addClass('okay');
buttonConfig();

// AJAX 요청을 사용해 서버에서 JSON 파일 불러오기(비동기)
$.getJSON('questions.json', function(data) {
	questions = data;  // 불러온 데이터 저장
	// 데이터 배열을 순회하면서 각 객체의 question 속성에 있는 줄 바꿈 문자를 <br>로 대체
	data.forEach(function(item) {
		item.question = item.question.replace(/\n/g, '<br>');
	});

	init();
	loadQuestion(current);
	setRadioButtonsFromCookieForCurrentPage();
	goToNext();
	goToPrev();
	buildStatus();
	submitData();
	goBack();
});

function init(){
	current = 1;
	count = questions.length;
}

// index 번째 문항 로딩 하고 페이지에 띄우기
function loadQuestion(index) {
	index = index - 1; // index는 0부터 시작
	var questionData = questions[index];
	var html = '<div class="mm-survey-page active" data-page="' + (index + 1) + '">';  // 항상 active 클래스를 추가
	html += '<div class="mm-survey-content"><div class="mm-survey-question"><p>';
	html += (index+1) + ". " + questionData.question;

	// codeSnippet이 null이 아니면 추가
	if (questionData.codeSnippet) {
		html += '<div class="mm-survey-snippet">';
		html += questionData.codeSnippet;
		html += '</div>';
	}

	html += '</p></div>';

	questionData.options.forEach(function(option) {
		html += '<div class="mm-survey-item">';
		html += '<input type="radio" id="q' + (index + 1) + '_' + option.optionNumber + '" name="q' + (index + 1) + '" value="' + option.optionText + '" number="' + option.optionNumber + '" />';
		html += '<label for="q' + (index + 1) + '_' + option.optionNumber + '"><span></span><p>' + option.optionText + '</p></label>';
		html += '</div>';
	});

	html += '</div></div>'; // .mm-survey-content와 .mm-survey-page를 닫는 태그
	// .mm-survey-controller 전에 삽입
	$(html).insertBefore(".mm-survey-controller");
}

function removeQuestion(){
	$('.mm-survey-page.active').remove();
}

function goToNext() {

	jQuery('.mm-next-btn').on('click', function() {
		current = current + 1;
		goToSlide(current);
		setRadioButtonsFromCookieForCurrentPage();
	});
}

function goToPrev() {

	jQuery('.mm-prev-btn').on('click', function() {
		current = current - 1;
		goToSlide(current);
		setRadioButtonsFromCookieForCurrentPage();
	});
}

function goToSlide(x) {
	var g = x/count;
	current = x;

	removeQuestion();
	loadQuestion(x);
	buildProgress(g);
	getButtons();
	checkStatus();

	// 현재 페이지가 마지막 페이지인지 확인합니다.
	if (current === count) {
		$('.mm-finish-btn').addClass('active');
	} else {
		// 마지막 페이지가 아닌 경우 제출 버튼을 비활성화합니다.
		$('.mm-finish-btn').removeClass('active');
	}
	buttonConfig();
	buildStatus();
}
function buildProgress(g) {

	if(g > 1){
		g = g - 1;
	}
	g = g * 100;
	jQuery('.mm-survey-progress-bar').css({ 'width' : g+'%' });
}

function getButtons() {

	if(current === count) {
		jQuery('.mm-next-btn').hide();
	}
	else if(current === 1) {
		jQuery('.mm-prev-btn').hide();
	}
	else {
		jQuery('.mm-next-btn').show();
		jQuery('.mm-prev-btn').show();
	}

}

function checkStatus() {
	jQuery('.mm-survey-constent .mm-survey-item').on('click', function() {
		var item;
		item = jQuery(this);
		item.closest('.mm-survey-page').addClass('pass');
	});
}

function buildStatus() {
	// 기존에 바인딩된 change 이벤트 핸들러 제거
	jQuery('.mm-survey-content .mm-survey-item input[type="radio"]').off('change');

	// 새롭게 change 이벤트 핸들러 설정
	jQuery('.mm-survey-content .mm-survey-item input[type="radio"]').on('change', function() {
		var page = jQuery(this).closest('.mm-survey-page');
		page.addClass('pass');

		if (page.find('input[type="radio"]:checked').length > 0) {
			jQuery('.mm-survey').addClass('okay');
			buttonConfig();
		}

		var questionName = $(this).attr('name');
		var selectedValue = $(this).attr('number');

		var testerData = JSON.parse(getCookie('tester') || '{}');
		testerData[questionName] = selectedValue;
		setCookie('tester', JSON.stringify(testerData), 7);
	});
}

function deliverStatus() {
	jQuery('.mm-survey-item').on('click', function() {
		if (jQuery('.mm-survey-container').hasClass('good')) {
			jQuery('.mm-survey').addClass('okay');
		} else {
			jQuery('.mm-survey').removeClass('okay');
		}
		buttonConfig(); // 버튼 상태 업데이트
	});
}

// 버튼 활성화/비활성화 제어
function buttonConfig() {
	if (jQuery('.mm-survey').hasClass('okay')) {
		jQuery('.mm-next-btn button').prop('disabled', false);
	} else {
		jQuery('.mm-next-btn button').prop('disabled', true);
	}

	// .mm-finish-btn에 active 클래스가 있는 경우 버튼을 활성화
	if (jQuery('.mm-finish-btn').hasClass('active')) {
		// .mm-finish-btn에 active 클래스가 있으면 버튼을 보이게 설정
		jQuery('.mm-finish-btn').prop('disabled', false);
	} else {
		// .mm-finish-btn에 active 클래스가 없으면 버튼을 숨김
		jQuery('.mm-finish-btn').prop('disabled', true);
	}
}

function submitData() {
	jQuery('.mm-finish-btn').on('click', function() {
		var completedTester = collectData(); // 답변 데이터를 수집하는 함수
		var score = calculateScore(completedTester);

		// completedTester 객체에 점수 추가
		completedTester.score = score;

		// 헤더 JSON 구성
		var requestData = {
			communicationTimestamp: new Date().toISOString(),
			resultCode: "OK",
			resultDescription: "Sending survey responses",
			data: completedTester // 설문 응답 값 객체
		};
		// AJAX로 서버에 데이터 전송 (PUT 방식)
		$.ajax({
			url: '/api/update',
			method: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify(requestData),
			success: function(response) {
				jQuery('#scoreDisplay').text(score);
				jQuery('.mm-survey-bottom').slideUp();
				jQuery('.mm-survey-results').slideDown();
			},
			error: function() {
				alert('Server communication error');
			}
		});
	});
}

function collectData() {
	// 쿠키에서 사용자 정보 가져오기
	var tester = JSON.parse(getCookie('tester') || '{}'); // 쿠키가 없으면 빈 객체로 초기화
	return tester;
}

function goBack() {
	jQuery('.mm-back-btn').on('click', function() {
		window.location.href = '/'; // 인덱스 페이지로 이동
	});
}
// 모달을 열거나 닫는 함수
function toggleModal() {
	const modal = document.getElementById('termsModal');
	if (modal.style.opacity === "1") {
		modal.style.opacity = "0";
		setTimeout(() => {
			modal.style.display = "none";
		}, 500);
	} else {
		modal.style.display = "block";
		setTimeout(() => {
			modal.style.opacity = "1";
		}, 1);
	}
}

function setCookie(name, value, days) {
		var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	// 인코딩하여 저장
	document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/";
}
function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length === 2) {
		// 디코딩하여 반환
		return decodeURIComponent(parts.pop().split(";").shift());
	}
	return null;
}

function setRadioButtonsFromCookieForCurrentPage() {
	// 현재 tester 쿠키 값 불러오기
	var testerData = JSON.parse(getCookie('tester') || '{}');  // 쿠키가 없으면 빈 객체로 초기화

	// 현재 페이지의 문항에 대한 라디오 버튼 값을 가져옴
	var questionName = "q" + current;
	if (testerData[questionName]) {
		var selectedValue = testerData[questionName];
		$('input[name=' + questionName + '][number=' + selectedValue + ']').prop('checked', true);
	}
}
function displayRemainingTime() {
	var now = new Date();
	var timeDiff = examEndTime - now;

	if (timeDiff <= 0) {
		jQuery('.mm-finish-btn').trigger('click');
		return;
	}

	var hours = Math.floor(timeDiff / (1000 * 60 * 60));
	var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

	var mmTimeElement = document.querySelector(".mm-time");
	mmTimeElement.textContent = hours + "시간 " + minutes + "분 " + seconds + "초";
}

function calculateScore(completedTester) {
	var totalScore = 0;
	var scorePerQuestion = 100 / questions.length;

	for (var i = 0; i < questions.length; i++) {
		var question = questions[i];
		var userAnswerKey = 'q' + question.questionNumber;
		var userAnswer = completedTester[userAnswerKey];

		if (String(userAnswer) === String(question.answer)) {
			totalScore += scorePerQuestion;
		}
	}

	return totalScore;
}
