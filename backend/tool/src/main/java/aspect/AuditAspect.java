package com.internship.tool.aspect;

import com.internship.tool.entity.AuditLog;
import com.internship.tool.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @AfterReturning(
            pointcut = "execution(* com.internship.tool.service.PolicyVersionService.createPolicy(..))",
            returning = "result"
    )
    public void logCreate(JoinPoint joinPoint, Object result) {
        saveAuditLog("CREATE", result);
    }

    @AfterReturning(
            pointcut = "execution(* com.internship.tool.service.PolicyVersionService.updatePolicy(..))",
            returning = "result"
    )
    public void logUpdate(JoinPoint joinPoint, Object result) {
        saveAuditLog("UPDATE", result);
    }

    @AfterReturning(
            pointcut = "execution(* com.internship.tool.service.PolicyVersionService.deletePolicy(..))"
    )
    public void logDelete(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        AuditLog auditLog = new AuditLog();
        auditLog.setAction("DELETE");
        auditLog.setEntityName("PolicyVersion");
        if (args.length > 0) {
            auditLog.setEntityId(Long.valueOf(args[0].toString()));
        }
        auditLog.setPerformedBy("system");
        auditLog.setPerformedAt(LocalDateTime.now());
        auditLogRepository.save(auditLog);
        log.info("Audit log saved for DELETE action");
    }

    private void saveAuditLog(String action, Object result) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setAction(action);
            auditLog.setEntityName("PolicyVersion");
            auditLog.setNewValue(result.toString());
            auditLog.setPerformedBy("system");
            auditLog.setPerformedAt(LocalDateTime.now());
            auditLogRepository.save(auditLog);
            log.info("Audit log saved for {} action", action);
        } catch (Exception e) {
            log.error("Failed to save audit log: {}", e.getMessage());
        }
    }
}