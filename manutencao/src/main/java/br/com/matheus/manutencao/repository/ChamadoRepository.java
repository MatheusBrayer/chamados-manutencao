package br.com.matheus.manutencao.repository;

import br.com.matheus.manutencao.entity.Chamado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ChamadoRepository
        extends JpaRepository<Chamado, Long>, JpaSpecificationExecutor<Chamado> {

    @EntityGraph(attributePaths = {"maquina", "setor", "mecanico"})
    Page<Chamado> findAll(
            Specification<Chamado> spec,
            Pageable pageable
    );
}