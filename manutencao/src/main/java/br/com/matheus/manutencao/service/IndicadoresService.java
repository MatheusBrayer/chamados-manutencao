package br.com.matheus.manutencao.service;

import br.com.matheus.manutencao.dto.IndicadoresDTO;
import br.com.matheus.manutencao.entity.Chamado;
import br.com.matheus.manutencao.enums.TipoChamado;
import br.com.matheus.manutencao.repository.ChamadoRepository;
import br.com.matheus.manutencao.specification.ChamadoSpecification;
import org.springframework.stereotype.Service;
import br.com.matheus.manutencao.dto.IndicadorMensalDTO;
import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;
import br.com.matheus.manutencao.dto.IndicadorMecanicoDTO;
import java.util.Comparator;
import br.com.matheus.manutencao.dto.IndicadorDiarioDTO;
import br.com.matheus.manutencao.entity.Mecanico;
import br.com.matheus.manutencao.repository.MecanicoRepository;

@Service
public class IndicadoresService {

    private final ChamadoRepository chamadoRepository;
    private final MecanicoRepository mecanicoRepository;

    public IndicadoresService(
            ChamadoRepository chamadoRepository,
            MecanicoRepository mecanicoRepository
    ) {
        this.chamadoRepository = chamadoRepository;
        this.mecanicoRepository = mecanicoRepository;
    }

    public IndicadoresDTO buscarIndicadores(
            TipoChamado tipo,
            Long setorId,
            Long np,
            Integer mecanicoMatricula,
            LocalDate dataInicio,
            LocalDate dataFim
    ) {

        long inicio = System.currentTimeMillis();

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

        long depoisDoBanco = System.currentTimeMillis();

        System.out.println(
                "INDICADORES - BANCO: "
                        + (depoisDoBanco - inicio)
                        + " ms"
        );

        long totalChamados = chamados.size();

        long chamadosMaquina = chamados.stream()
                .filter(chamado -> chamado.getTipo() == TipoChamado.MAQUINA)
                .count();

        long chamadosPredial = chamados.stream()
                .filter(chamado -> chamado.getTipo() == TipoChamado.PREDIAL)
                .count();

        long fim = System.currentTimeMillis();

        System.out.println(
                "INDICADORES - TOTAL: "
                        + (fim - inicio)
                        + " ms"
        );

        return new IndicadoresDTO(
                totalChamados,
                chamadosMaquina,
                chamadosPredial
        );
    }

    public List<IndicadorMensalDTO> buscarIndicadoresMensais(Integer ano) {

        LocalDate dataInicio = LocalDate.of(ano, 1, 1);
        LocalDate dataFim = LocalDate.of(ano, 12, 31);

        List<Chamado> chamadosDoAno = chamadoRepository.findAll(
                ChamadoSpecification.filtrar(
                        null,
                        null,
                        null,
                        null,
                        dataInicio,
                        dataFim
                )
        );

        List<IndicadorMensalDTO> indicadoresMensais = new ArrayList<>();

        for (int mes = 1; mes <= 12; mes++) {

            int mesAtual = mes;

            long totalChamados = chamadosDoAno.stream()
                    .filter(chamado ->
                            chamado.getData().getMonthValue() == mesAtual
                    )
                    .count();

            long chamadosMaquina = chamadosDoAno.stream()
                    .filter(chamado ->
                            chamado.getData().getMonthValue() == mesAtual
                                    && chamado.getTipo() == TipoChamado.MAQUINA
                    )
                    .count();

            long chamadosPredial = chamadosDoAno.stream()
                    .filter(chamado ->
                            chamado.getData().getMonthValue() == mesAtual
                                    && chamado.getTipo() == TipoChamado.PREDIAL
                    )
                    .count();

            IndicadorMensalDTO indicadorMensal =
                    new IndicadorMensalDTO(
                            mesAtual,
                            totalChamados,
                            chamadosMaquina,
                            chamadosPredial
                    );

            indicadoresMensais.add(indicadorMensal);
        }

        return indicadoresMensais;
    }

    public List<IndicadorDiarioDTO> buscarIndicadoresDiarios(
            Integer ano,
            Integer mes
    ) {

        LocalDate dataInicio = LocalDate.of(ano, mes, 1);
        LocalDate dataFim = dataInicio.withDayOfMonth(
                dataInicio.lengthOfMonth()
        );

        List<Chamado> chamadosDoMes = chamadoRepository.findAll(
                ChamadoSpecification.filtrar(
                        null,
                        null,
                        null,
                        null,
                        dataInicio,
                        dataFim
                )
        );

        List<IndicadorDiarioDTO> indicadoresDiarios = new ArrayList<>();

        int quantidadeDias = dataInicio.lengthOfMonth();

        for (int dia = 1; dia <= quantidadeDias; dia++) {

            int diaAtual = dia;

            long totalChamados = chamadosDoMes.stream()
                    .filter(chamado ->
                            chamado.getData().getDayOfMonth() == diaAtual
                    )
                    .count();

            long chamadosMaquina = chamadosDoMes.stream()
                    .filter(chamado ->
                            chamado.getData().getDayOfMonth() == diaAtual
                                    && chamado.getTipo() == TipoChamado.MAQUINA
                    )
                    .count();

            long chamadosPredial = chamadosDoMes.stream()
                    .filter(chamado ->
                            chamado.getData().getDayOfMonth() == diaAtual
                                    && chamado.getTipo() == TipoChamado.PREDIAL
                    )
                    .count();

            indicadoresDiarios.add(
                    new IndicadorDiarioDTO(
                            diaAtual,
                            totalChamados,
                            chamadosMaquina,
                            chamadosPredial
                    )
            );
        }

        return indicadoresDiarios;
    }

    public List<IndicadorMecanicoDTO> buscarIndicadoresMecanicos(
            LocalDate dataInicio,
            LocalDate dataFim
    ) {

        List<Mecanico> mecanicos = mecanicoRepository.findAll();

        List<Chamado> chamados = chamadoRepository.findAll(
                ChamadoSpecification.filtrar(
                        null,
                        null,
                        null,
                        null,
                        dataInicio,
                        dataFim
                )
        );


        return mecanicos.stream()
                .filter(mecanico ->
                        !mecanico.getNome().equalsIgnoreCase("Daniel")
                                && !mecanico.getNome().equalsIgnoreCase("Matheus")
                                && !mecanico.getNome().equalsIgnoreCase("Luiz")
                )
                .map(mecanico -> {

                    List<Chamado> chamadosMecanico = chamados.stream()
                            .filter(chamado ->
                                    chamado.getMecanico().getId()
                                            .equals(mecanico.getId())
                            )
                            .toList();

                    long chamadosMaquina = chamadosMecanico.stream()
                            .filter(chamado ->
                                    chamado.getTipo() == TipoChamado.MAQUINA
                            )
                            .count();

                    long chamadosPredial = chamadosMecanico.stream()
                            .filter(chamado ->
                                    chamado.getTipo() == TipoChamado.PREDIAL
                            )
                            .count();

                    long totalChamados = chamadosMecanico.size();

                    return new IndicadorMecanicoDTO(
                            mecanico.getNome(),
                            chamadosMaquina,
                            chamadosPredial,
                            totalChamados
                    );
                })
                .sorted(
                        Comparator.comparing(
                                IndicadorMecanicoDTO::getTotalChamados
                        ).reversed()
                )
                .toList();
        }
    }
