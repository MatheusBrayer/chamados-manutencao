package br.com.matheus.manutencao.repository;

import br.com.matheus.manutencao.entity.Maquina;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaquinaRepository extends JpaRepository <Maquina, Long> {

    Optional<Maquina> findByNp(Long np);

}
