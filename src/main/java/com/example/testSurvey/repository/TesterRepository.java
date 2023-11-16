package com.example.testSurvey.repository;

import com.example.testSurvey.model.entity.Tester;
import org.aspectj.weaver.ast.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TesterRepository extends JpaRepository<Tester, Integer> {
    Optional<Tester> findByPhoneNumber(String phoneNumber);
    Optional<Tester> findByEmail(String email);
}
