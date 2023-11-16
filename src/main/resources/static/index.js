$(document).ready(function() {
    $('#respondent-form').submit(function(e) {
        e.preventDefault(); // 기본 form 제출 동작을 막음

        // 이름 검사
        var name = $('#name').val();
        if (!checkValidInput(name)) {
            alert("이름은 한글만 입력해주세요.");
            return;
        }

        // 아이디 변수 입력
        var sesacId = $('#sesacId').val();

        // 번호 검사
        var email = $('#email').val();
        if (!checkValidEmail(email)) {
            alert("유효한 이메일을 입력해주세요.");
            return;
        }

        // 서버에 보낼 데이터 객체 생성
        var requestData = {
            communicationTimestamp: new Date().toISOString(),
            resultCode: "OK",
            resultDescription: "Sending tester info",
            data: {
                name: name,
                sesacId : sesacId,
                email : email
            }
        };

        // AJAX로 서버에 데이터 전송
        $.ajax({
            url: '/api', // 서버에 데이터를 보낼 URL
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                // 서버로부터의 응답을 처리
                if (response.resultCode === "ACK-OK / Data") {
                    // 쿠키에 사용자 정보 저장
                    var tester = response.data;
                    // localStorage.setItem('tester', JSON.stringify(tester));   // 기존 코드
                    setCookie('tester', JSON.stringify(tester), 7); // 7일 동안 쿠키를 저장
                    // 성공적으로 처리되었다면 survey.html로 이동
                    window.location.href = '/survey';
                } else {
                    // 에러 발생시 처리
                    alert('Error: ' + response.resultDescription);
                }
            },
            error: function() {
                // 서버와 통신 실패시 처리
                alert('Server communication error');
            }
        });
    });
});

function checkValidInput(input) {
    var pattern = /^[가-힣]+$/; // 한글만 허용, 공백 제외
    return pattern.test(input);
}

function checkValidPhoneNumber(phoneNumber) {
    // 대시(-)와 공백을 포함하거나 포함하지 않는 10~11자리 숫자를 허용하는 정규 표현식
    var pattern = /^(\d{3}[-\.\s]?\d{3,4}[-\.\s]?\d{4})$/;
    return pattern.test(phoneNumber);
}

function checkValidEmail(email) {
    // 기본적인 이메일 형식을 허용하는 정규 표현식
    var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
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

$(function(){
    $(".privateterm02").click(function(){
        $(".term").toggleClass("on");
        $(".modal_bg").toggleClass("on");
    });
    $(".modal_btn").click(function(){
        $(".term").removeClass("on");
                $(".modal_bg").removeClass("on");
    });
});

