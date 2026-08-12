package br.com.matheus.manutencao.controller;

import br.com.matheus.manutencao.entity.Chamado;
import br.com.matheus.manutencao.repository.ChamadoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chamados")
public class ChamadosController {

    private final ChamadoRepository chamadoRepository;

    public ChamadosController(ChamadoRepository chamadoRepository) {
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
    public ResponseEntity<?> cadastrarChamado (@RequestBody Chamado novoChamado) {
        try {
            Chamado chamadoSalvo = chamadoRepository.save(novoChamado);
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
