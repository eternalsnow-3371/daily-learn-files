package com.project.javaee.service.audit;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.project.javaee.constant.Constant;
import com.project.javaee.constant.PunctuationConstant;
import com.project.javaee.model.audit.AuditPo;
import com.project.javaee.model.audit.OpsResultEnum;
import com.project.javaee.util.IpCheckUtil;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuditService {
    private static final String PARAM_MAP_KEY_OF_HTTP_SERVLET_REQUEST = "httpServletRequest";
    private static final String PARAM_MAP_KEY_OF_HTTP_OPERATION_TARGET = "httpOperationTarget";

    private static final String METHOD_GET = "GET";
    private static final String HTTP_HEADER_X_FORWADED_FOR = "x-forwarded-for";

    private static final String DEFAULT_INFO_ARG_NAME = "info";

    private static final String OPERATION_PARAM_SEPERATOR =
            PunctuationConstant.PUNCTUATION_STRING_OF_COMMA + PunctuationConstant.PUNCTUATION_STRING_OF_BLANK_SPACE;

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = RuntimeException.class)
    public void auditProcess(JoinPoint joinPoint, OpsResultEnum opsResult, HttpServletRequest httpServletRequestFromJoinPoint) {
        Map<String, Object> params = parseParam(joinPoint);
        HttpServletRequest httpServletRequest = (HttpServletRequest) params.get(PARAM_MAP_KEY_OF_HTTP_SERVLET_REQUEST);
        if (httpServletRequest == null) {
            httpServletRequest = httpServletRequestFromJoinPoint;
        }
        String uri = httpServletRequest.getRequestURI();
        if (null == httpServletRequest || null == uri || httpServletRequest.getMethod().equals(METHOD_GET)) {
            return;
        }

        String requestBody = null;
        try {
            ServletInputStream servletInputStream = httpServletRequest.getInputStream();
            String bodyStr = IOUtils.toString(servletInputStream, Charset.forName(Constant.CHARSET_UTF_8_NAME));
            if (StringUtils.isEmpty(bodyStr)) {
                requestBody = "";
            } else {
                String[] argNames = {DEFAULT_INFO_ARG_NAME};
                Object[] paramsObjectArray = {bodyStr};
                requestBody = getRequestBody(argNames, paramsObjectArray, uri);
            }
        } catch (IOException e) {
            String[] argNames = ((MethodSignature) joinPoint.getSignature()).getParameterNames();
            requestBody = getRequestBody(argNames, joinPoint.getArgs(), uri);
        }

        AuditPo po = constructAuditPo(httpServletRequest, opsResult, requestBody);
        System.out.println(JSON.toJSONString(po));
    }

    private Map<String, Object> parseParam(JoinPoint joinPoint) {
        Map<String, Object> paramMap = new HashMap<>();
        StringBuilder operationTagertParam = new StringBuilder();
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        String[] funcParamNames = methodSignature.getParameterNames();
        Object[] funcParamValues = joinPoint.getArgs();

        for (int i = 0; i < funcParamNames.length; ++i) {
            String funcParamName = funcParamNames[i];
            Object funcParamValue = funcParamValues[i];
            if (null == funcParamValue) {
                continue;
            }

            if (funcParamValue instanceof HttpServletRequest) {
                paramMap.put(PARAM_MAP_KEY_OF_HTTP_SERVLET_REQUEST, funcParamValue);
                continue;
            }

            if (funcParamValue instanceof MultipartFile) {
                operationTagertParam.append(funcParamName).append(PunctuationConstant.PUNCTUATION_STRING_OF_EQUAL)
                        .append(funcParamValue.getClass().getSimpleName()).append(OPERATION_PARAM_SEPERATOR);
            }
            operationTagertParam.append(funcParamName).append(PunctuationConstant.PUNCTUATION_STRING_OF_EQUAL)
                    .append(funcParamValue).append(OPERATION_PARAM_SEPERATOR);
        }

        String httpOperationTarget = StringUtils.substringBeforeLast(operationTagertParam.toString(), OPERATION_PARAM_SEPERATOR);
        paramMap.put(PARAM_MAP_KEY_OF_HTTP_OPERATION_TARGET, httpOperationTarget);

        return paramMap;
    }

    private String getRequestBody(String[] argNames, Object[] paramsObjectArray, String uri) {
        if (paramsObjectArray.length <= 0 || paramsObjectArray[0] == null) {
            return PunctuationConstant.PUNCTUATION_STRING_OF_EMPTY;
        }
        String params = PunctuationConstant.PUNCTUATION_STRING_OF_EMPTY;

        JSONObject requestBodyJsonObject = new JSONObject();
        for (int i = 0; i < paramsObjectArray.length; ++i) {
            String argName = argNames[i];
            Object argValue = paramsObjectArray[i];
            if (argValue instanceof HttpServletRequest) {
                continue;
            }
            if (argValue instanceof String) {
                String argValueStr = (String) paramsObjectArray[i];
                putIntoJSONObject(argName, argValueStr, requestBodyJsonObject);
            } else {
                requestBodyJsonObject.put(argName, argValue);
            }
        }

        if (requestBodyJsonObject.size() == 1) {
            Map<String, Object> innerMap = requestBodyJsonObject.getInnerMap();
            for (Map.Entry<String, Object> entry : innerMap.entrySet()) {
                Object value = entry.getValue();
                params = JSON.toJSONString(value);
            }
        } else {
            params = JSON.toJSONString(requestBodyJsonObject);
        }
        if (StringUtils.isEmpty(params)) {
            return PunctuationConstant.PUNCTUATION_STRING_OF_EMPTY;
        }
        return getFinalParams(params, uri);

    }

    private void putIntoJSONObject(String argName, String argValueStr, JSONObject paramsJSONObject) {
        try {
            if (JSON.isValidObject(argValueStr)) {
                paramsJSONObject.put(argName, JSON.parseObject(argValueStr));
            } else if (JSON.isValidArray(argValueStr)) {
                paramsJSONObject.put(argName, JSON.parseArray(argValueStr));
            } else {
                paramsJSONObject.put(argName, argValueStr);
            }
        } catch (Exception e) {
            System.out.println("putIntoJSONObject error");
        }
    }

    // 脱敏处理
    private String getFinalParams(String params, String uri) {
        return params.trim();
    }

    private AuditPo constructAuditPo(HttpServletRequest httpServletRequest, OpsResultEnum opsResult, String requestBody) {
        String sourceIp = getSourceIp(httpServletRequest);
        String uri = httpServletRequest.getRequestURI();
        String method = httpServletRequest.getMethod();
        String opsResultStr = opsResult.getValue();
        Long nowTime = System.currentTimeMillis();

        return new AuditPo(sourceIp, uri, method, requestBody, opsResultStr, nowTime);
    }

    private String getSourceIp(HttpServletRequest httpServletRequest) {
        try {
            String ipAddr = httpServletRequest.getHeader(HTTP_HEADER_X_FORWADED_FOR);
            if (StringUtils.isNotEmpty(ipAddr) && ipAddr.contains(PunctuationConstant.PUNCTUATION_STRING_OF_COMMA)) {
                ipAddr = ipAddr.split(PunctuationConstant.PUNCTUATION_STRING_OF_COMMA)[0];
            }
            if (!IpCheckUtil.ipCheck(ipAddr) || Constant.STRING_OF_UNKNOWN.equalsIgnoreCase(ipAddr)) {
                ipAddr = httpServletRequest.getRemoteAddr();
                if (ipAddr.equals(Constant.LOCAL_IP_V4) || ipAddr.equals(Constant.LOCAL_IP_V6)) {
                    try {
                        InetAddress inetAddress = Inet4Address.getLocalHost();
                        ipAddr = inetAddress.getHostAddress();
                    } catch (UnknownHostException e) {
                        System.out.println("error");
                    }
                }
            }
            return ipAddr;
        } catch (Exception e) {
            return Constant.STRING_OF_UNKNOWN;
        }
    }
}
