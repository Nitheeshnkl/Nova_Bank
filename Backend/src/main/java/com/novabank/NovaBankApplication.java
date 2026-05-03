package com.novabank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.novabank"})
public class NovaBankApplication {

	public static void main(String[] args) {
		SpringApplication.run(NovaBankApplication.class, args);
	}

}
