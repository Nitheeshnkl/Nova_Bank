package com.novabank.interceptors;

import com.novabank.helpers.authorization.JwtService;
import com.novabank.models.User;
import com.novabank.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AppInterceptor implements HandlerInterceptor{
    public UserRepository userRepository;
    private final JwtService jwtService;

    @Autowired
    public AppInterceptor(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        System.out.println("In Pre Handle Interceptor Method");

        //TODO: CHECK REQUEST URI:
        if(request.getRequestURI().startsWith("/app") || request.getRequestURI().startsWith("/transact") || request.getRequestURI().startsWith("/logout") || request.getRequestURI().startsWith("/account")){


            //Get Header:
            String header = request.getHeader("Authorization");

            //Check Is Token Included
            if (!jwtService.isTokenIncluded(header)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "You need to be logged in.");
                return false;
            }

            System.out.println("Hereee is theeeeeeeeeeeeeeeeeee header: "+ header);
            //Get Access Token From Header
            String token = jwtService.getAccessTokenFromHeader(header);
            if (token == null) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid authorization header.");
                return false;
            }

            //Decode Token
            System.out.println("Jwt from logout: " + token);
            Claims claims = jwtService.decodeToken(token);
            if (claims == null) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token.");
                return false;
            }
            String email = claims.getSubject(); //email burada
            if (email == null || email.isEmpty()) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token subject.");
                return false;
            }

            //Get User By Email
            User user = userRepository.getUserDetails(email);

            //Open Session
            request.getSession().setAttribute("user",user);
            request.getSession().setAttribute("token",token);


            //TODO: Get Token Stored int Session:
            System.out.println("allahım lütfen token yazsın "+ request.getSession().getAttribute("token"));

            //TODO: Get User Object Stored In Session:
            System.out.println("allahım lütfen user yazsın "+ request.getSession().getAttribute("user"));

            //TODO: Validate Session Attributes / Objects:
            if(user == null ){
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "You need to be logged in.");
                return false;
            }
            //End of Validate Session//Attributes
        }

        return true;
        // End of Check Request URI
    }
    //End Of Pre Handle Method


    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("After Handle Interceptor Method");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("After Completion Interceptor Method");
    }
}
//End of Interceptor Class
