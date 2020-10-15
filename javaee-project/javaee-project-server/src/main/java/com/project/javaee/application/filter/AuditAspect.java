package com.project.javaee.application.filter;

import com.project.javaee.constant.ResponseCode;
import com.project.javaee.model.audit.OpsResultEnum;
import com.project.javaee.model.common.BaseResponse;
import com.project.javaee.service.audit.AuditService;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@Aspect
@Component
public class AuditAspect {
    @Resource
    private AuditService auditService;

    @Pointcut("execution(public * com.project.javaee.controller..*Controller.add*(..))"
            + "|| execution(public * com.project.javaee.controller..*Controller.create*(..))"
            + "|| execution(public * com.project.javaee.controller..*Controller.set*(..))"
            + "|| execution(public * com.project.javaee.controller..*Controller.edit*(..))"
            + "|| execution(public * com.project.javaee.controller..*Controller.modify*(..))"
            + "|| execution(public * com.project.javaee.controller..*Controller.delete*(..))"
    )
    public void auditPointCut() {

    }

    @AfterReturning(value = "auditPointCut()", returning = "result")
    public void doSuccessAudit(JoinPoint joinPoint, Object result) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return;
        }
        HttpServletRequest request = attributes.getRequest();
        if (result instanceof BaseResponse) {
            BaseResponse response = (BaseResponse) result;
            String code = response.getCode();
            if (StringUtils.isEmpty(code) || !ResponseCode.SERVER_RESPONSE_OK.equals(code)) {
                auditService.auditProcess(joinPoint, OpsResultEnum.FAIL, request);
            } else {
                auditService.auditProcess(joinPoint, OpsResultEnum.SUCCESS, request);
            }
        } else {
            auditService.auditProcess(joinPoint, OpsResultEnum.FAIL, request);
        }
    }

    @AfterThrowing(value = "auditPointCut()")
    public void doFailAudit(JoinPoint joinPoint) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return;
        }
        HttpServletRequest request = attributes.getRequest();
        auditService.auditProcess(joinPoint, OpsResultEnum.FAIL, request);
    }

}
