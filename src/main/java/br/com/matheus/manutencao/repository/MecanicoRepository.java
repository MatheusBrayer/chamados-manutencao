package br.com.matheus.manutencao.repository;

import br.com.matheus.manutencao.entity.Mecanico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MecanicoRepository extends JpaRepository <Mecanico,Long> {
}
