package br.com.matheus.manutencao.service;

import br.com.matheus.manutencao.dto.IndicadoresDTO;
import br.com.matheus.manutencao.entity.Chamado;
import br.com.matheus.manutencao.enums.TipoChamado;
import br.com.matheus.manutencao.repository.ChamadoRepository;
import br.com.matheus.manutencao.specification.ChamadoSpecification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class IndicadoresService {

    private final ChamadoRepository chamadoRepository;

    public IndicadoresService(ChamadoRepository chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    public IndicadoresDTO buscarIndicadores(
            TipoChamado tipo,
            Long setorId,
            Long np,
            Integer mecanicoMatricula,
            LocalDate dataInicio,
            LocalDate dataFim
    ) {
        List<Chamado> chamados = chamadoRepository.findAll(
                ChamadoSpecification.filtrar(
                        tipo,
                        setorId,
                        np,
                        mecanicoMatricula,
                        dataInicio,
                        dataFim
                )
        );

        long totalChamados = chamados.size();

        long chamadosMaquina = chamados.stream()
                .filter(chamado -> chamado.getTipo() == TipoChamado.MAQUINA)
                .count();

        long chamadosPredial = chamados.stream()
                .filter(chamado -> chamado.getTipo() == TipoChamado.PREDIAL)
                .count();

        return new IndicadoresDTO(
                totalChamados,
                chamadosMaquina,
                chamadosPredial
        );
    }
}
