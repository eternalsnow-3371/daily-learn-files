package com.project.javaee.model.common;

import lombok.Data;

@Data
public class BaseResponse {

    private String code;

    private String msg;

    private Object obj;

    private BaseResponse(String code, String msg, Object obj) {
        this.code = code;
        this.msg = msg;
        this.obj = obj;
    }

    public static BaseResponse constructBaseResponse(String code, String msg, Object obj) {
        return new BaseResponse(code, msg, obj);
    }

}
