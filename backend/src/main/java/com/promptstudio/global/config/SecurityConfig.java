package com.promptstudio.global.config;

import com.promptstudio.global.security.CsrfCookieFilter;
import com.promptstudio.global.security.RestAccessDeniedHandler;
import com.promptstudio.global.security.RestAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * 세션 + 쿠키 기반 인증 설정.
 *
 * CSRF: 2단계 적용 완료. CookieCsrfTokenRepository 로 XSRF-TOKEN 쿠키를 발급하고,
 *       상태 변경 요청(POST/PUT/DELETE)은 X-XSRF-TOKEN 헤더로 그 값을 되보내야 통과한다.
 *       (GET 등 안전한 메서드는 CSRF 검사 대상 아님. H2 콘솔은 ignoringRequestMatchers 로 예외.)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /** 수동 로그인 시 SecurityContext 를 세션에 저장하기 위해 명시적 빈으로 노출. */
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            RestAuthenticationEntryPoint authenticationEntryPoint,
            RestAccessDeniedHandler accessDeniedHandler,
            CorsConfigurationSource corsConfigurationSource
    ) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                // CSRF 방어 ON: 토큰을 JS가 읽을 수 있는 XSRF-TOKEN 쿠키로 발급,
                // 상태 변경 요청은 X-XSRF-TOKEN 헤더로 그 값을 되보내야 통과.
                // (plain 핸들러 = 쿠키 토큰과 헤더 토큰이 동일 값 → 학습에 이해하기 쉬움)
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                        .ignoringRequestMatchers("/h2-console/**"))  // H2 콘솔은 예외
                // 지연 로딩된 토큰이 쿠키로 항상 나가도록 강제하는 필터
                .addFilterAfter(new CsrfCookieFilter(), CsrfFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/register", "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/problems", "/problems/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                // H2 콘솔이 프레임을 쓰므로 same-origin 허용 (샌드박스 편의용)
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                // 로그아웃은 JSON 응답을 위해 커스텀 컨트롤러(/auth/logout)에서 처리
                .logout(logout -> logout.disable());

        return http.build();
    }
}
