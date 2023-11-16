package com.example.testSurvey.controller;

import com.example.testSurvey.model.Header;
import com.example.testSurvey.model.entity.Tester;
import com.example.testSurvey.myapp.CrudInterface;
import com.example.testSurvey.service.TesterService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TesterApiController implements CrudInterface<Tester> {
    @Autowired
    private TesterService testerService;
    @Override
    @PostMapping("")
    public Header<Tester> create(@RequestBody Header<Tester> request) {
        return testerService.create(request);
    }
    @Override
    @GetMapping("")
    public Header<Tester> read(Integer id) {
        return null;
    }
    @GetMapping("/showtester")
    public Header<List<Tester>> readAll() {
        return testerService.readAll();
    }

    @Override
    @PutMapping("/update")
    public Header<Tester> update(@RequestBody Header<Tester> request) {
        return testerService.update(request);
    }

    @Override
    public Header delete(Integer id) {
        return null;
    }

}
