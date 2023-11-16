package com.example.testSurvey.service;

import com.example.testSurvey.model.Header;
import com.example.testSurvey.model.entity.Tester;
import com.example.testSurvey.myapp.CrudInterface;
import com.example.testSurvey.repository.TesterRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TesterService implements CrudInterface<Tester> {
    @Autowired
    private TesterRepository testerRepository;

    @Override
    public Header<Tester> create(Header<Tester> request) {
        Tester newTester = request.getData();
        // 응답자 업데이트 시간 정보
        newTester.setUpdateAt(LocalDateTime.now());
        // 이메일로 기존 응답자 찾기
        Optional<Tester> existingTester = testerRepository.findByEmail(newTester.getEmail());

        if (existingTester.isPresent()) {
            // 이미 존재하는 응답자 정보 업데이트
            Tester updateTester = existingTester.get();
            updateTester.setName(newTester.getName());
            updateTester.setSesacId(newTester.getSesacId());
            updateTester.setUpdateAt(LocalDateTime.now());
            return Header.ACK(testerRepository.save(updateTester));
        } else {
            // 새로운 응답자 저장
            return Header.ACK(testerRepository.save(newTester));
        }
    }

    @Override
    public Header<Tester> read(Integer id) {
        Header<Tester> ack = Header.ACK(testerRepository.findById(id).orElse(null));
        return ack;
    }

    public Header<List<Tester>> readAll() {
        List<Tester> testers = testerRepository.findAll();

        List<Tester> filteredUpdateAtNullTesters = testers.stream()
                .filter(tester -> tester.getUpdateAt() != null)
                .collect(Collectors.toList());
        return Header.ACK(filteredUpdateAtNullTesters);
    }

    @Override
    public Header<Tester> update(Header<Tester> request) {
        Header<Tester> ack = Header.ACK(testerRepository.save(request.getData()));
        return ack;
    }

    @Override
    public Header delete(Integer id) {
        testerRepository.deleteById(id);
        return Header.ACK();
    }

}
