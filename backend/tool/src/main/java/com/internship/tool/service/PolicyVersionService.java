package com.internship.tool.service;

import com.internship.tool.entity.PolicyVersion;
import com.internship.tool.repository.PolicyVersionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
/**
 * Service layer for Policy Version business logic.
 * Handles all data operations and transformations.
 */
@Service
public class PolicyVersionService {

    private final PolicyVersionRepository repository;

    // Get all policies without pagination
    public List<PolicyVersion> getAllPolicies() {
        return repository.findByIsDeletedFalse();
    }

    // Get all policies with pagination
    public Page<PolicyVersion> getAllPoliciesPaged(
            int page, int size) {
        Pageable pageable = PageRequest.of(
                page, size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return repository
                .findByIsDeletedFalseOrderByCreatedAtDesc(
                        pageable
                );
    }

    // Get policy by ID
    public PolicyVersion getPolicyById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Policy not found with id: " + id
                        ));
    }

    // Create new policy
    public PolicyVersion createPolicy(PolicyVersion policy) {
        policy.setIsDeleted(false);
        return repository.save(policy);
    }

    // Update existing policy
    public PolicyVersion updatePolicy(
            Long id, PolicyVersion updatedPolicy) {
        PolicyVersion existing = getPolicyById(id);
        existing.setTitle(updatedPolicy.getTitle());
        existing.setVersionNumber(
                updatedPolicy.getVersionNumber()
        );
        existing.setStatus(updatedPolicy.getStatus());
        existing.setContent(updatedPolicy.getContent());
        existing.setCreatedBy(updatedPolicy.getCreatedBy());
        return repository.save(existing);
    }

    // Soft delete policy
    public void deletePolicy(Long id) {
        PolicyVersion policy = getPolicyById(id);
        policy.setIsDeleted(true);
        repository.save(policy);
    }

    // Search policies
    public List<PolicyVersion> searchPolicies(String query) {
        return repository.searchPolicies(query);
    }

    // Get stats
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total",
                repository.countByIsDeletedFalse());
        stats.put("active",
                repository.countByStatusAndIsDeletedFalse(
                        "ACTIVE"));
        stats.put("draft",
                repository.countByStatusAndIsDeletedFalse(
                        "DRAFT"));
        stats.put("inactive",
                repository.countByStatusAndIsDeletedFalse(
                        "INACTIVE"));
        return stats;
    }

    // Get analytics
    public Map<String, Object> getAnalytics(int days) {
        Map<String, Object> analytics = new HashMap<>();
        List<PolicyVersion> all =
                repository.findByIsDeletedFalse();

        LocalDateTime from = LocalDateTime.now()
                .minusDays(days);

        analytics.put("total", all.size());
        analytics.put("active",
                all.stream()
                        .filter(p -> "ACTIVE".equals(p.getStatus()))
                        .count());
        analytics.put("draft",
                all.stream()
                        .filter(p -> "DRAFT".equals(p.getStatus()))
                        .count());
        analytics.put("inactive",
                all.stream()
                        .filter(p ->
                                "INACTIVE".equals(p.getStatus()))
                        .count());
        analytics.put("recent",
                all.stream()
                        .filter(p -> p.getCreatedAt() != null &&
                                p.getCreatedAt().isAfter(from))
                        .count());
        return analytics;
    }
}