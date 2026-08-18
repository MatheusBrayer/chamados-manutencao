package br.com.matheus.manutencao.specification;

import br.com.matheus.manutencao.entity.Chamado;
import br.com.matheus.manutencao.enums.TipoChamado;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ChamadoSpecification {

    public static Specification<Chamado> filtrar(
            TipoChamado tipo,
            Long setorId,
            Long np,
            Integer mecanicoMatricula,
            LocalDate dataInicio,
            LocalDate dataFim
    ) {
        return (root, query, criteriaBuilder) -> {

            var predicate = criteriaBuilder.conjunction();

            if (tipo != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("tipo"), tipo)
                );
            }

            if (setorId != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("setor").get("id"), setorId)
                );
            }

            if (np != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("maquina").get("np"), np)
                );
            }

            if (mecanicoMatricula != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("mecanico").get("matricula"), mecanicoMatricula)
                );
            }

            if (dataInicio != null && dataFim != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.between(root.get("data"), dataInicio, dataFim)
                );
            }

            return predicate;
        };
    }
}