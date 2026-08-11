package br.com.matheus.manutencao.repository;

import br.com.matheus.manutencao.entity.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChamadoRepository extends JpaRepository<Chamado, Long> {
}
