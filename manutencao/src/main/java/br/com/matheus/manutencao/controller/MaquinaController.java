package br.com.matheus.manutencao.controller;

import br.com.matheus.manutencao.dto.MaquinaResponseDTO;
import br.com.matheus.manutencao.entity.Maquina;
import br.com.matheus.manutencao.repository.MaquinaRepository;
import br.com.matheus.manutencao.service.MaquinaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/maquinas")
public class MaquinaController {

    private final MaquinaRepository maquinaRepository;
    private final MaquinaService maquinaService;

    public MaquinaController(
            MaquinaRepository maquinaRepository,
            MaquinaService maquinaService
    ) {
        this.maquinaRepository = maquinaRepository;
        this.maquinaService = maquinaService;
    }

    @GetMapping
    public ResponseEntity<?> listarMaquinas() {
        try {
            List<MaquinaResponseDTO> maquinas =
                    maquinaService.listarMaquinas();

            return ResponseEntity.ok(maquinas);

        } catch (Exception erro) {
            return ResponseEntity
                    .status(500)
                    .body(
                            "Erro ao listar máquinas: "
                                    + erro.getMessage()
                    );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarMaquinaPorId(
            @PathVariable Long id
    ) {
        try {
            Optional<Maquina> maquina =
                    maquinaRepository.findById(id);

            if (maquina.isEmpty()) {
                return ResponseEntity
                        .status(404)
                        .body("Máquina não encontrada!");
            }

            return ResponseEntity.ok(maquina.get());

        } catch (Exception erro) {
            return ResponseEntity
                    .status(500)
                    .body(erro.getMessage());
        }
    }

    @GetMapping("/np/{np}")
    public ResponseEntity<?> buscarMaquinaPorNp(
            @PathVariable Long np
    ) {
        try {
            MaquinaResponseDTO maquina =
                    maquinaService.buscarMaquinaPorNp(np);

            return ResponseEntity.ok(maquina);

        } catch (RuntimeException erro) {
            return ResponseEntity
                    .status(404)
                    .body(erro.getMessage());

        } catch (Exception erro) {
            return ResponseEntity
                    .status(500)
                    .body("Erro ao buscar máquina.");
        }
    }
}