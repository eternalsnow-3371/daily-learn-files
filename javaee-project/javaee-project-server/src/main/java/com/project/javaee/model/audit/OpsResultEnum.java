package com.project.javaee.model.audit;

public enum OpsResultEnum {
    SUCCESS("success"),
    FAIL("fail");

    private String value;

    OpsResultEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
