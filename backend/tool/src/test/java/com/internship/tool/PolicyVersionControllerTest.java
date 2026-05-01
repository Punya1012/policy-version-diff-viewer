package com.internship.tool;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.tool.entity.PolicyVersion;
import com.internship.tool.service.PolicyVersionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class PolicyVersionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PolicyVersionService service;

    // Test 1 — GET all policies returns 200
    @Test
    @WithMockUser
    public void testGetAllPolicies() throws Exception {
        mockMvc.perform(get("/api/policy-versions"))
                .andExpect(status().isOk());
    }

    // Test 2 — GET stats returns 200
    @Test
    @WithMockUser
    public void testGetStats() throws Exception {
        mockMvc.perform(get("/api/policy-versions/stats"))
                .andExpect(status().isOk());
    }

    // Test 3 — POST create policy returns 200
    @Test
    @WithMockUser
    public void testCreatePolicy() throws Exception {
        PolicyVersion policy = new PolicyVersion();
        policy.setTitle("Test Policy");
        policy.setVersionNumber("v1.0");
        policy.setStatus("DRAFT");
        policy.setCreatedBy("tester");
        policy.setContent("Test content");

        mockMvc.perform(post("/api/policy-versions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(policy)))
                .andExpect(status().isOk());
    }

    // Test 4 — GET by ID returns 200
    @Test
    @WithMockUser
    public void testGetById() throws Exception {
        PolicyVersion policy = new PolicyVersion();
        policy.setTitle("Test Get By ID");
        policy.setVersionNumber("v1.0");
        policy.setStatus("DRAFT");
        policy.setCreatedBy("tester");
        PolicyVersion saved = service.createPolicy(policy);

        mockMvc.perform(get(
                        "/api/policy-versions/" + saved.getId()))
                .andExpect(status().isOk());
    }

    // Test 5 — GET by invalid ID returns 500
    @Test
    @WithMockUser
    public void testGetByInvalidId() throws Exception {
        mockMvc.perform(get("/api/policy-versions/99999"))
                .andExpect(status().is5xxServerError());
    }

    // Test 6 — PUT update policy returns 200
    @Test
    @WithMockUser
    public void testUpdatePolicy() throws Exception {
        PolicyVersion policy = new PolicyVersion();
        policy.setTitle("Original Title");
        policy.setVersionNumber("v1.0");
        policy.setStatus("DRAFT");
        policy.setCreatedBy("tester");
        PolicyVersion saved = service.createPolicy(policy);
        saved.setTitle("Updated Title");

        mockMvc.perform(put(
                        "/api/policy-versions/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saved)))
                .andExpect(status().isOk());
    }

    // Test 7 — DELETE policy returns 204
    @Test
    @WithMockUser
    public void testDeletePolicy() throws Exception {
        PolicyVersion policy = new PolicyVersion();
        policy.setTitle("To Delete");
        policy.setVersionNumber("v1.0");
        policy.setStatus("DRAFT");
        policy.setCreatedBy("tester");
        PolicyVersion saved = service.createPolicy(policy);

        mockMvc.perform(delete(
                        "/api/policy-versions/" + saved.getId()))
                .andExpect(status().isNoContent());
    }

    // Test 8 — GET search returns 200
    @Test
    @WithMockUser
    public void testSearchPolicies() throws Exception {
        mockMvc.perform(get(
                        "/api/policy-versions/search?q=test"))
                .andExpect(status().isOk());
    }

    // Test 9 — GET audit logs returns 200
    @Test
    @WithMockUser
    public void testGetAuditLogs() throws Exception {
        mockMvc.perform(get(
                        "/api/policy-versions/audit-logs"))
                .andExpect(status().isOk());
    }

    // Test 10 — POST with empty title returns 200
    @Test
    @WithMockUser
    public void testCreatePolicyWithEmptyTitle()
            throws Exception {
        PolicyVersion policy = new PolicyVersion();
        policy.setTitle("");
        policy.setVersionNumber("v1.0");
        policy.setStatus("DRAFT");
        policy.setCreatedBy("tester");

        mockMvc.perform(post("/api/policy-versions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(policy)))
                .andExpect(status().isOk());
    }
}