package com.promptstudio.global.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 인증되지 않은 사용자가 보호 리소스에 접근할 때 401 을 JSON({code,message})으로 반환.
 * (Spring Security 기본 동작은 로그인 페이지 리다이렉트/빈 응답이라 SPA 에 맞지 않음)
 * 응답 포맷은 본 프로젝트의 ApiErrorResponse{code,message} 와 동일하게 맞춘다.
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"code\":\"unauthenticated\",\"message\":\"로그인이 필요합니다.\"}");
    }
}
