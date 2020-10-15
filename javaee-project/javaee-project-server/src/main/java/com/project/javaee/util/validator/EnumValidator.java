package com.project.javaee.util.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER, ElementType.FIELD})
@Constraint(validatedBy = EnumValidatorService.class)
public @interface EnumValidator {
    String value();

    String message() default "Value is not in list.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
