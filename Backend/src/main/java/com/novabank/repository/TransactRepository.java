package com.novabank.repository;

import com.novabank.models.Transact;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactRepository extends CrudRepository<Transact, Integer> {
}
