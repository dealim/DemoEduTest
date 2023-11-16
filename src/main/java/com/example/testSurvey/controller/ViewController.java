package com.example.testSurvey.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("")
public class ViewController {
    @GetMapping()
    public String home(){
        return "forward:/index.html";
    }

    @GetMapping("/survey")
    public String survey() {
        return "forward:/survey.html";
    }

    @GetMapping("/showtester")
    public String showTester() {
        return "forward:/showtester.html";
    }
}
