package com.internship.tool.repository;

import com.internship.tool.entity.PolicyVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyVersionRepository
        extends JpaRepository<PolicyVersion, Long> {

    List<PolicyVersion> findByIsDeletedFalse();

    @Query("SELECT p FROM PolicyVersion p WHERE " +
            "p.isDeleted = false AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.status) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<PolicyVersion> searchPolicies(@Param("query") String query);

    long countByIsDeletedFalse();

    long countByStatusAndIsDeletedFalse(String status);
}