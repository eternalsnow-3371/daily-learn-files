package com.project.javaee.exception;

public class OperationException extends RuntimeException {

    private String code = "";

    private String msg = "";

    public OperationException(String code, String msg, Throwable cause) {
        super(cause);
        this.code = code;
        this.msg = msg;
    }
}
