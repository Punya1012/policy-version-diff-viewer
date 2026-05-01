package com.internship.tool.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Policy Version Diff Viewer API")
                        .version("1.0")
                        .description(
                                "REST API for managing policy versions"
                        )
                        .contact(new Contact()
                                .name("Team 5")
                                .email("team5@internship.com")
                        )
                );
    }
}