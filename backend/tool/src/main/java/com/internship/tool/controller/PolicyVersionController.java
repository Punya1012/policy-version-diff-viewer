package com.internship.tool.controller;

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
@Tag(
        name = "Policy Version API",
        description = "Endpoints for managing policy versions"
)
/**
 * REST Controller for Policy Version management.
 * Provides endpoints for CRUD operations,
 * search, stats, analytics, CSV export and file upload.
 */
@RestController
public class PolicyVersionController {

    private final PolicyVersionService service;
    private final AuditLogRepository auditLogRepository;

    // ✅ 1. GET all — no path variable
    @Operation(summary = "Get all policies with pagination")
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                service.getAllPoliciesPaged(page, size)
        );
    }

    // ✅ 2. GET stats — fixed path before /{id}
    @Operation(summary = "Get policy statistics")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(service.getStats());
    }

    // ✅ 3. GET analytics — fixed path before /{id}
    @Operation(summary = "Get analytics data")
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(
                service.getAnalytics(days)
        );
    }

    // ✅ 4. GET search — fixed path before /{id}
    @Operation(summary = "Search policies by keyword")
    @GetMapping("/search")
    public ResponseEntity<List<PolicyVersion>> search(
            @RequestParam String q) {
        return ResponseEntity.ok(
                service.searchPolicies(q)
        );
    }

    // ✅ 5. GET audit logs — fixed path before /{id}
    @Operation(summary = "Get audit logs")
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(
                auditLogRepository
                        .findTop10ByOrderByPerformedAtDesc()
        );
    }

    // ✅ 6. GET export CSV — fixed path before /{id}
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

    // ✅ 7. GET by ID — AFTER all fixed paths
    @Operation(summary = "Get policy by ID")
    @GetMapping("/{id}")
    public ResponseEntity<PolicyVersion> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                service.getPolicyById(id)
        );
    }

    // ✅ 8. POST create policy
    @Operation(summary = "Create new policy")
    @PostMapping
    public ResponseEntity<PolicyVersion> create(
            @RequestBody PolicyVersion policy) {
        return ResponseEntity.ok(
                service.createPolicy(policy)
        );
    }

    // ✅ 9. PUT update policy
    @Operation(summary = "Update existing policy")
    @PutMapping("/{id}")
    public ResponseEntity<PolicyVersion> update(
            @PathVariable Long id,
            @RequestBody PolicyVersion policy) {
        return ResponseEntity.ok(
                service.updatePolicy(id, policy)
        );
    }

    // ✅ 10. DELETE soft delete
    @Operation(summary = "Soft delete policy")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {
        service.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ 11. POST file upload
    @Operation(summary = "Upload a file")
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file)
            throws IOException {
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

    // ✅ 12. Exception handler
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(
            RuntimeException ex) {
        return ResponseEntity
                .status(500)
                .body(ex.getMessage());
    }
}