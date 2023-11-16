package com.example.testSurvey.model.entity;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Tester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String sesacId;
    private String phoneNumber;
    private String email;
    private Float score;
    private LocalDateTime updateAt;
    private Integer q1;
    private Integer q2;
    private Integer q3;
    private Integer q4;
    private Integer q5;
    private Integer q6;
    private Integer q7;
    private Integer q8;
    private Integer q9;
    private Integer q10;
    private Integer q11;
    private Integer q12;
    private Integer q13;
    private Integer q14;
    private Integer q15;
    private Integer q16;
    private Integer q17;
    private Integer q18;
    private Integer q19;
    private Integer q20;
    private Integer q21;
    private Integer q22;
    private Integer q23;
    private Integer q24;
    private Integer q25;
    private Integer q26;
    private Integer q27;
    private Integer q28;
    private Integer q29;
    private Integer q30;
    private Integer q31;
    private Integer q32;
    private Integer q33;
    private Integer q34;
    private Integer q35;
    private Integer q36;
    private Integer q37;
    private Integer q38;
    private Integer q39;
    private Integer q40;
}

