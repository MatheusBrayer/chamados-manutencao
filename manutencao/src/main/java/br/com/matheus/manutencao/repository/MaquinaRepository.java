package br.com.matheus.manutencao.repository;

import br.com.matheus.manutencao.entity.Maquina;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaquinaRepository extends JpaRepository<Maquina, Long> {

    @EntityGraph(attributePaths = {"setor"})
    List<Maquina> findAll();

    @EntityGraph(attributePaths = {"setor"})
    Optional<Maquina> findByNp(Long np);
}