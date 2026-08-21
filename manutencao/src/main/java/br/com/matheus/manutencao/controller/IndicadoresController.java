package br.com.matheus.manutencao.controller;

import br.com.matheus.manutencao.dto.IndicadoresDTO;
import br.com.matheus.manutencao.enums.TipoChamado;
import br.com.matheus.manutencao.service.IndicadoresService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.matheus.manutencao.dto.IndicadorMensalDTO;
import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/indicadores")
public class IndicadoresController {

    private final IndicadoresService indicadoresService;

    public IndicadoresController(IndicadoresService indicadoresService) {
        this.indicadoresService = indicadoresService;
    }

    @GetMapping
    public ResponseEntity<?> buscarIndicadores(
            @RequestParam(required = false) TipoChamado tipo,

            @RequestParam(required = false) Long setorId,

            @RequestParam(required = false) Long np,

            @RequestParam(required = false) Integer mecanicoMatricula,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataInicio,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataFim
    ) {
        try {
            IndicadoresDTO indicadores = indicadoresService.buscarIndicadores(
                    tipo,
                    setorId,
                    np,
                    mecanicoMatricula,
                    dataInicio,
                    dataFim
            );

            return ResponseEntity.ok(indicadores);

        } catch (Exception error) {
            return ResponseEntity.status(500).body("Erro ao buscar indicadores: " + error.getMessage());
        }
    }

    @GetMapping("/mensais")
    public ResponseEntity<?> buscarIndicadoresMensais(
            @RequestParam Integer ano
    ) {
        try {
            List<IndicadorMensalDTO> indicadoresMensais =
                    indicadoresService.buscarIndicadoresMensais(ano);

            return ResponseEntity.ok(indicadoresMensais);

        } catch (Exception erro) {
            return ResponseEntity
                    .status(500)
                    .body(
                            "Erro ao buscar indicadores mensais: ");


        }
    }
}