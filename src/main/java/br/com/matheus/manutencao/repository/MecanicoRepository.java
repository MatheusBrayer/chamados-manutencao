package br.com.matheus.manutencao.repository;

import br.com.matheus.manutencao.entity.Mecanico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MecanicoRepository extends JpaRepository <Mecanico,Long> {

    Optional<Mecanico> findByMatricula(Integer matricula);
}
