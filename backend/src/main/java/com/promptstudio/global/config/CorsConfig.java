package com.promptstudio.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * 본 프로젝트의 컨트롤러별 @CrossOrigin 을 전역 CORS 설정으로 승격한 형태.
 * 세션 쿠키를 주고받으려면:
 *  - allowedOrigins 에 명시적 origin (자격증명 동반 시 "*" 사용 불가)
 *  - allowCredentials(true)
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origin}") String allowedOrigin
    ) {
        CorsConfiguration config = new CorsConfiguration();
        // allowCredentials(true) 에서는 "*" 를 못 쓰지만 패턴은 가능.
        // 샌드박스는 Vite 개발 서버 포트가 바뀔 수 있어(5173→5174…) localhost 임의 포트를 허용한다.
        // (이식 시에는 실제 프론트 origin 을 명시적으로 지정할 것)
        config.setAllowedOriginPatterns(List.of(allowedOrigin));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
