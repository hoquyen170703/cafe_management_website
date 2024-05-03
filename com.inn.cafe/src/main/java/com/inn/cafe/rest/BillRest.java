package com.inn.cafe.rest;

import com.inn.cafe.POJO.Bill;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/bill")
public interface BillRest {
    @PostMapping(path = "/generateReport")
    ResponseEntity<String> generateReport(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/getBills")
    ResponseEntity<List<Bill>> getBills();

    @PostMapping(path = "/getPdf")
    ResponseEntity<byte[]> getPdf(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteBill(@PathVariable Integer id);


}
