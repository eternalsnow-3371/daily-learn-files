package com.project.javaee.util.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class EnumValidatorService implements ConstraintValidator<EnumValidator, Object> {
    private String values;

    @Override
    public void initialize(EnumValidator constraintAnnotation) {
        this.values = constraintAnnotation.value();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        try {
            if (value == null || value.equals("")) {
                return true;
            }

            String[] legalValueList = values.split(",");
            for (String legalValue : legalValueList) {
                if (legalValue.equals(value) || legalValue.equals(String.valueOf(value))) {
                    return true;
                }
            }

            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
