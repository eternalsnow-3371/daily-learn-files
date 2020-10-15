package com.project.javaee.application.filter;

import com.project.javaee.util.MultiReadRequestWrapper;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuthenticationFilter implements Filter {

    private static final String HTTP_REQUEST_HEADER_TOKEN = "token_placeholder";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // do nothing
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        try {
            HttpServletRequest httpServletRequest = (HttpServletRequest) request;
            String token = httpServletRequest.getHeader(HTTP_REQUEST_HEADER_TOKEN);
            Boolean checkResult = checkToken(token);
            if (checkResult == null || checkResult) {
                chain.doFilter(new MultiReadRequestWrapper(httpServletRequest), response);
                return;
            } else {
                HttpServletResponse httpServletResponse = (HttpServletResponse) response;
                httpServletResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Not authorized.");
            }
            System.out.println("get not authorized request");
        } catch (Exception e) {
            e.printStackTrace();
            HttpServletResponse httpServletResponse = (HttpServletResponse) response;
            httpServletResponse.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error.");
        }
    }

    private Boolean checkToken(String token) {
        if (token == null) {
            return null;
        } else {
            return false;
        }
    }
}
