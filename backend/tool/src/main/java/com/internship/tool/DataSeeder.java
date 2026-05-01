package com.internship.tool;

import com.internship.tool.entity.PolicyVersion;
import com.internship.tool.repository.PolicyVersionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final PolicyVersionRepository repository;

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            log.info("Seeding database with demo data...");
            seedData();
            log.info("Database seeded successfully!");
        } else {
            log.info("Database already has data — skipping seed");
        }
    }

    private void seedData() {
        createPolicy(
                "Data Privacy Policy",
                "v1.0",
                "ACTIVE",
                "This policy defines rules for handling user data securely and in compliance with GDPR.",
                "Admin"
        );
        createPolicy(
                "Information Security Policy",
                "v2.1",
                "ACTIVE",
                "Guidelines for protecting company information assets from unauthorized access.",
                "John Smith"
        );
        createPolicy(
                "Acceptable Use Policy",
                "v1.3",
                "ACTIVE",
                "Rules governing the acceptable use of company IT resources and systems.",
                "Jane Doe"
        );
        createPolicy(
                "Password Management Policy",
                "v3.0",
                "ACTIVE",
                "Standards for creating and managing secure passwords across all systems.",
                "Admin"
        );
        createPolicy(
                "Remote Work Policy",
                "v1.1",
                "DRAFT",
                "Guidelines for employees working remotely including security requirements.",
                "HR Team"
        );
        createPolicy(
                "Incident Response Policy",
                "v2.0",
                "ACTIVE",
                "Procedures for responding to security incidents and data breaches.",
                "Security Team"
        );
        createPolicy(
                "Business Continuity Policy",
                "v1.5",
                "DRAFT",
                "Plans and procedures for maintaining business operations during disruptions.",
                "Management"
        );
        createPolicy(
                "Data Retention Policy",
                "v2.2",
                "ACTIVE",
                "Rules for how long different types of data should be retained and when to delete.",
                "Legal Team"
        );
        createPolicy(
                "Vendor Management Policy",
                "v1.0",
                "DRAFT",
                "Guidelines for selecting and managing third party vendors and suppliers.",
                "Procurement"
        );
        createPolicy(
                "Change Management Policy",
                "v3.1",
                "ACTIVE",
                "Process for managing changes to IT systems and infrastructure.",
                "IT Team"
        );
        createPolicy(
                "Access Control Policy",
                "v2.0",
                "ACTIVE",
                "Rules for granting and revoking access to company systems and data.",
                "Security Team"
        );
        createPolicy(
                "Email Usage Policy",
                "v1.4",
                "INACTIVE",
                "Guidelines for appropriate use of company email systems.",
                "IT Team"
        );
        createPolicy(
                "Social Media Policy",
                "v1.2",
                "INACTIVE",
                "Rules for employee use of social media platforms in professional context.",
                "HR Team"
        );
        createPolicy(
                "Anti Virus Policy",
                "v2.3",
                "ACTIVE",
                "Requirements for installing and maintaining antivirus software on all devices.",
                "IT Team"
        );
        createPolicy(
                "Clean Desk Policy",
                "v1.0",
                "DRAFT",
                "Requirements for maintaining a clean and secure workspace environment.",
                "Admin"
        );
    }

    private void createPolicy(
            String title,
            String version,
            String status,
            String content,
            String createdBy) {
        PolicyVersion policy = new PolicyVersion();
        policy.setTitle(title);
        policy.setVersionNumber(version);
        policy.setStatus(status);
        policy.setContent(content);
        policy.setCreatedBy(createdBy);
        policy.setIsDeleted(false);
        repository.save(policy);
    }
}