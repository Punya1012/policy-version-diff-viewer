package com.internship.tool.service;

import com.internship.tool.entity.PolicyVersion;
import com.internship.tool.repository.PolicyVersionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PolicyVersionService {

    private final PolicyVersionRepository repository;

    public List<PolicyVersion> getAllPolicies() {
        return repository.findByIsDeletedFalse();
    }

    public PolicyVersion getPolicyById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Policy not found with id: " + id));
    }

    public PolicyVersion createPolicy(PolicyVersion policy) {
        policy.setIsDeleted(false);
        return repository.save(policy);
    }

    public PolicyVersion updatePolicy(Long id, PolicyVersion updatedPolicy) {
        PolicyVersion existing = getPolicyById(id);
        existing.setTitle(updatedPolicy.getTitle());
        existing.setVersionNumber(updatedPolicy.getVersionNumber());
        existing.setStatus(updatedPolicy.getStatus());
        existing.setContent(updatedPolicy.getContent());
        existing.setCreatedBy(updatedPolicy.getCreatedBy());
        return repository.save(existing);
    }

    public void deletePolicy(Long id) {
        PolicyVersion policy = getPolicyById(id);
        policy.setIsDeleted(true);
        repository.save(policy);
    }

    public List<PolicyVersion> searchPolicies(String query) {
        return repository.searchPolicies(query);
    }
    public java.util.Map<String, Object> getStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("total", repository.countByIsDeletedFalse());
        stats.put("active", repository.countByStatusAndIsDeletedFalse("ACTIVE"));
        stats.put("draft", repository.countByStatusAndIsDeletedFalse("DRAFT"));
        stats.put("inactive", repository.countByStatusAndIsDeletedFalse("INACTIVE"));
        return stats;
    }
}