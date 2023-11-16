$(document).ready(function () {
    $.ajax({
        url: 'api/showtester', // 서버 url을 여기에 넣어야 함.
        method: 'GET',
        success: function (response){
            if (response.resultCode === "ACK-OK / Data") {  // 서버에서 정상적인 ACK 코드를 반환했는지 확인
                var testers = response.data;
                if (Array.isArray(testers)) { // 배열인지 확인
                    for (var i = 0; i < testers.length; i++) {
                        // 날짜 형식 2023-10-10 10:10 으로 변경
                        var originalDate = testers[i].updateAt;
                        var formattedDate = originalDate.replace("T", " ").split(":").slice(0, -1).join(":");

                        $('#tester-info-tbody').append('<tr><td>' + testers[i].id + '</td><td>' + testers[i].name + '</td><td>' + formattedDate + '</td></tr>');
                    }
                }
            } else {
                alert('Error: ' + response.resultDescription); // 에러 메시지 출력
            }
        },
        error: function () {
            alert('Server communication error'); // 서버와 통신 실패
        }
    });
});
