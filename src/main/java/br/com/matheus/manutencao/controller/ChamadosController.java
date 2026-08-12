package br.com.matheus.manutencao.controller;

import br.com.matheus.manutencao.dto.ChamadoRequestDTO;
import br.com.matheus.manutencao.entity.Chamado;
import br.com.matheus.manutencao.repository.ChamadoRepository;
import br.com.matheus.manutencao.service.ChamadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chamados")
public class ChamadosController {

    private final ChamadoRepository chamadoRepository;
    private final ChamadoService chamadoService;

    public ChamadosController(ChamadoRepository chamadoRepository, ChamadoService chamadoService) {
        this.chamadoService = chamadoService;
        this.chamadoRepository = chamadoRepository;
    }

    @GetMapping
    public ResponseEntity<?> listarChamados () {
        try {
            List<Chamado> listaChamados = chamadoRepository.findAll();
            return ResponseEntity.ok(listaChamados);
        }catch (Exception error) {
            return ResponseEntity.status(500).body(error.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> cadastrarChamado (@RequestBody ChamadoRequestDTO dto) {
        try {
            Chamado chamadoSalvo = chamadoService.cadastrarChamado(dto);
            return ResponseEntity.ok(chamadoSalvo);
        }catch (Exception error) {
            return ResponseEntity.status(500).body(error.getMessage());
        }
    }

    @GetMapping ("/{id}")
    public ResponseEntity<?> cadastrarChamado (@PathVariable Long id) {
        try {
            if (!chamadoRepository.existsById(id)) {
                return ResponseEntity.status(404).body("Chamado não encontrado!");
            }

            Optional<Chamado> chamado = chamadoRepository.findById(id);

            return ResponseEntity.ok(chamado);
        }catch (Exception error) {
            return ResponseEntity.status(500).body(error.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarChamado(@PathVariable Long id) {
        try {
            if (!chamadoRepository.existsById(id)) {
                return ResponseEntity.status(404).body("Chamado não encontrado!");
            }

            chamadoRepository.deleteById(id);

            return ResponseEntity.status(201).body("Chamado deletado com sucesso!");

        } catch (Exception error) {
            return ResponseEntity.status(500).body("Erro ao deletar chamado: " + error.getMessage());
        }
    }
}
