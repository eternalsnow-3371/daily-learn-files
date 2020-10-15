package com.project.javaee.exception;

import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletResponse;

@ControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(value = OperationException.class)
    public void hanldeAllException(OperationException e) {
        System.out.println("ControllerExceptionHandler hanldeAllException : ");
        e.printStackTrace();
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    public void handleHttpMessageNotReadableException(HttpServletResponse httpServletResponse, HttpMessageNotReadableException httpMessageNotReadableException) {
        try {
            httpServletResponse.setHeader("content-type", "application/json;charset=UTF-8");
            httpServletResponse.getWriter().write("{\"msg\":\"waht shall failed\"}");
        } catch (Exception e) {
            System.out.println("error");
        }
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public void handleMethodArgumentNotValidException(HttpServletResponse httpServletResponse, MethodArgumentNotValidException methodArgumentNotValidException) {
        try {
            methodArgumentNotValidException.printStackTrace();
            httpServletResponse.setHeader("content-type", "application/json;charset=UTF-8");
            httpServletResponse.getWriter().write("{\"msg\":\"Enum validator failed\"}");
        } catch (Exception e) {
            System.out.println("error");
        }
    }
}
