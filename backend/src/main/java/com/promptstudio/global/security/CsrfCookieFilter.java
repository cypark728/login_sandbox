package com.promptstudio.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * CSRF 토큰을 응답 쿠키(XSRF-TOKEN)에 확실히 실어주는 필터.
 *
 * Spring Security 6+ 부터 CSRF 토큰은 '지연 로딩'이라, 아무도 토큰을 건드리지 않으면
 * XSRF-TOKEN 쿠키가 응답에 안 실린다. SPA는 그 쿠키를 읽어 헤더로 되보내야 하므로,
 * 매 요청마다 csrfToken.getToken()을 한 번 호출해 쿠키가 항상 발급되게 강제한다.
 */
public class CsrfCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            csrfToken.getToken(); // 토큰을 실제로 읽어 쿠키가 응답에 써지도록 트리거
        }
        filterChain.doFilter(request, response);
    }
}
