package com.internship.tool.controller;

import com.internship.tool.entity.PolicyVersion;
import com.internship.tool.service.PolicyVersionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policy-versions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PolicyVersionController {

    private final PolicyVersionService service;

    @GetMapping
    public ResponseEntity<List<PolicyVersion>> getAll() {
        return ResponseEntity.ok(service.getAllPolicies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyVersion> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.getPolicyById(id));
    }

    @PostMapping
    public ResponseEntity<PolicyVersion> create(
            @RequestBody PolicyVersion policy) {
        return ResponseEntity.ok(service.createPolicy(policy));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PolicyVersion> update(
            @PathVariable Long id,
            @RequestBody PolicyVersion policy) {
        return ResponseEntity.ok(service.updatePolicy(id, policy));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {
        service.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PolicyVersion>> search(
            @RequestParam String q) {
        return ResponseEntity.ok(service.searchPolicies(q));
    }
}