package com.project.javaee.constant;

import org.apache.http.HttpStatus;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.HashMap;
import java.util.Map;

public class ErrorCode {

    @ErrorCodeInfo(httpCode = HttpStatus.SC_OK, errorCode = "0", errorMsg = "success")
    public static final String SUCCESS = "0";

    private static final Map<String, ErrorCodeInfo> ERROR_CODE_INFO_MAP = new HashMap<>();

    static {
        final Field[] fields = ErrorCode.class.getDeclaredFields();
        for (Field field : fields) {
            if (!Modifier.isStatic(field.getModifiers()) || !Modifier.isFinal(field.getModifiers())) {
                continue;
            }
            try {
                Object value = field.get(null);
                if (value instanceof String) {
                    ErrorCodeInfo errorCodeInfo = field.getAnnotation(ErrorCodeInfo.class);
                    if (errorCodeInfo != null) {
                        ERROR_CODE_INFO_MAP.put((String) value, errorCodeInfo);
                    }
                }
            } catch (IllegalArgumentException | IllegalAccessException e) {
                System.out.println("error");
            }

        }
    }

    public static ErrorCodeInfo analyzeErrorCode(String errorCode) {
        return ERROR_CODE_INFO_MAP.get(errorCode);
    }
}
