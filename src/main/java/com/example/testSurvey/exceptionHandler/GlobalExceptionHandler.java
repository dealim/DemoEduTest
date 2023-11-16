//package com.example.testSurvey.exceptionHandler;
//
//import java.sql.SQLIntegrityConstraintViolationException;
//
//import com.example.testSurvey.model.Header;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
//    public Header<?> handleSQLIntegrityConstraintViolationException(SQLIntegrityConstraintViolationException e) {
//        // DB unique 조건 위반 시 에러 메시지
//        String errorMessage = "가입 오류! 이미 번호가 있습니다.";
//        return Header.ERROR(errorMessage);
//    }
//}
