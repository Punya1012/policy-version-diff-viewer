package com.internship.tool.controller;

import java.time.LocalDateTime;
import com.internship.tool.entity.AuditLog;
import com.internship.tool.entity.PolicyVersion;
import com.internship.tool.repository.AuditLogRepository;
import com.internship.tool.service.PolicyVersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/policy-versions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Policy Version API",
        description = "Endpoints for managing policy versions")
public class PolicyVersionController {

    private final PolicyVersionService service;
    private final AuditLogRepository auditLogRepository;

    @Operation(summary = "Get all policies")
    @GetMapping
    public ResponseEntity<List<PolicyVersion>> getAll() {
        return ResponseEntity.ok(service.getAllPolicies());
    }

    @Operation(summary = "Get policy by ID")
    @GetMapping("/{id}")
    public ResponseEntity<PolicyVersion> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.getPolicyById(id));
    }

    @Operation(summary = "Create new policy")
    @PostMapping
    public ResponseEntity<PolicyVersion> create(
            @RequestBody PolicyVersion policy) {
        return ResponseEntity.ok(service.createPolicy(policy));
    }

    @Operation(summary = "Update existing policy")
    @PutMapping("/{id}")
    public ResponseEntity<PolicyVersion> update(
            @PathVariable Long id,
            @RequestBody PolicyVersion policy) {
        return ResponseEntity.ok(
                service.updatePolicy(id, policy));
    }

    @Operation(summary = "Soft delete policy")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {
        service.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Search policies by keyword")
    @GetMapping("/search")
    public ResponseEntity<List<PolicyVersion>> search(
            @RequestParam String q) {
        return ResponseEntity.ok(service.searchPolicies(q));
    }

    @Operation(summary = "Get policy statistics")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(service.getStats());
    }

    @Operation(summary = "Get audit logs")
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(
                auditLogRepository
                        .findTop10ByOrderByPerformedAtDesc()
        );
    }

    @Operation(summary = "Export policies as CSV")
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv() {
        List<PolicyVersion> policies =
                service.getAllPolicies();

        StringBuilder csv = new StringBuilder();
        csv.append(
                "ID,Title,Version,Status,CreatedBy,CreatedAt\n"
        );

        for (PolicyVersion p : policies) {
            csv.append(p.getId()).append(",")
                    .append(p.getTitle()).append(",")
                    .append(p.getVersionNumber()).append(",")
                    .append(p.getStatus()).append(",")
                    .append(p.getCreatedBy()).append(",")
                    .append(p.getCreatedAt()).append("\n");
        }

        byte[] csvBytes = csv.toString().getBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(
                MediaType.parseMediaType("text/csv")
        );
        headers.setContentDispositionFormData(
                "attachment", "policies.csv"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }

    @Operation(summary = "Upload a file")
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file)
            throws IOException {

        // File type validation
        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.equals("application/pdf") &&
                        !contentType.equals("text/plain") &&
                        !contentType.equals("application/msword") &&
                        !contentType.contains("wordprocessingml"))) {
            return ResponseEntity.badRequest().body(
                    Map.of("error",
                            "Only PDF, TXT and DOC files allowed")
            );
        }

        // File size validation — max 5MB
        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            return ResponseEntity.badRequest().body(
                    Map.of("error",
                            "File size must be less than 5MB")
            );
        }

        return ResponseEntity.ok(Map.of(
                "message", "File uploaded successfully",
                "filename", file.getOriginalFilename(),
                "size", String.valueOf(file.getSize()),
                "type", contentType
        ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(
            RuntimeException ex) {
        return ResponseEntity
                .status(500)
                .body(ex.getMessage());
    }
    @Operation(summary = "Get analytics data")
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(
            @RequestParam(defaultValue = "30") int days) {
        List<PolicyVersion> all = service.getAllPolicies();
        LocalDateTime from = LocalDateTime.now()
                .minusDays(days);

        Map<String, Object> analytics = new java.util.HashMap<>();
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
                        .filter(p -> "INACTIVE".equals(p.getStatus()))
                        .count());
        analytics.put("recent",
                all.stream()
                        .filter(p -> p.getCreatedAt() != null &&
                                p.getCreatedAt().isAfter(from))
                        .count());

        return ResponseEntity.ok(analytics);
    }
}