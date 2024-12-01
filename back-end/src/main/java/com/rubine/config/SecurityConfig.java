package com.rubine.config;

import com.rubine.authentication.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
            throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/auth/login").permitAll();
                    auth.requestMatchers("/users/**").hasAnyRole("SYS_ADMIN", "ADMIN");
                    auth.requestMatchers(HttpMethod.PUT,"/products/update/{id}").hasAnyRole("SYS_ADMIN", "ADMIN");
                    auth.requestMatchers(HttpMethod.POST,"/products/create").hasAnyRole("SYS_ADMIN", "ADMIN");
                    auth.requestMatchers(HttpMethod.DELETE,"/products/delete/{id}").hasAnyRole("SYS_ADMIN", "ADMIN");
                    auth.requestMatchers(HttpMethod.PUT,"/products/updateStock/{productId}").hasAnyRole("SYS_ADMIN", "ADMIN");
                    auth.requestMatchers("/products/all").permitAll();
                    auth.requestMatchers("/products/{id}").permitAll();
                    auth.requestMatchers("/main/**").permitAll();
                    auth.requestMatchers("/auth/login").permitAll(); // Public access for login
                    auth.requestMatchers("/orders/all").hasAnyRole("SYS_ADMIN", "ADMIN"); // View all orders
                    auth.requestMatchers(HttpMethod.POST, "/orders/create").hasAnyRole("SYS_ADMIN", "ADMIN"); // Create orders
                    auth.requestMatchers(HttpMethod.PUT, "/orders/{orderId}").hasAnyRole("SYS_ADMIN", "ADMIN"); // Update order by ID
                    auth.requestMatchers(HttpMethod.DELETE, "/orders/{orderId}").hasAnyRole("SYS_ADMIN", "ADMIN"); // Delete order by ID
                    auth.requestMatchers("/cart/**").permitAll();
                    auth.anyRequest().authenticated();
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8080", "http://localhost:3306"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}