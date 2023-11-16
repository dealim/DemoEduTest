package com.example.testSurvey.myapp;

import com.example.testSurvey.model.Header;
import com.example.testSurvey.model.entity.Tester;
import org.springframework.web.bind.annotation.GetMapping;

public interface CrudInterface<T> {

    Header<T> create(Header<T> request);

    Header<T> read(Integer id);

    Header<T> update(Header<T> request);

    Header delete(Integer id);
}
