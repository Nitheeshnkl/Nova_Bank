package com.novabank.repository;

import com.novabank.models.PaymentHistory;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentHistoryRepository extends CrudRepository<PaymentHistory,Integer> {

    @Query(value = "SELECT * FROM v_payments WHERE user_id = :user_id ORDER BY payment_id DESC",nativeQuery = true)
    List<PaymentHistory> getPaymentsRecordsById(@Param("user_id")Long user_id);
}
