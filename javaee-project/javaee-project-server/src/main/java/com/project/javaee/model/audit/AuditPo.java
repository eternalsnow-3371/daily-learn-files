package com.project.javaee.model.audit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditPo {
    private String sourceIp;
    private String uri;
    private String method;
    private String requestBody;
    private String opsResultStr;
    private Long nowTime;
}