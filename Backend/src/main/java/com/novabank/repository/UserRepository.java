package com.novabank.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.novabank.models.User;

import javax.transaction.Transactional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    @Query(value="SELECT email FROM users WHERE email = :email", nativeQuery = true)
    String getUserEmail(@Param("email")String email);

    @Query(value="SELECT password FROM users WHERE email = :email", nativeQuery = true)
    String getUserPassword(@Param("email")String email);

    @Query(value="SELECT verified FROM users WHERE email = :email", nativeQuery = true)
    int isVerified(@Param("email")String email);

    @Query(value="SELECT * FROM users WHERE email = :email", nativeQuery = true)
    User getUserDetails(@Param("email")String email);

    @Modifying
    @Query(value = "UPDATE users SET token=null,code=null, verified=1, verified_at=Now(), updated_at=Now() WHERE "+
            "token= :token AND code= :code", nativeQuery = true)
    @Transactional
    void verifyAccount(@Param("token")String token, @Param("code")String code);

    @Query(value = "SELECT token FROM users WHERE token = :token",nativeQuery = true)
    String checkToken(@Param("token")String token);
}
