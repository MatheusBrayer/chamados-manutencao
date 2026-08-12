package br.com.matheus.manutencao.controller;

import br.com.matheus.manutencao.entity.Mecanico;
import br.com.matheus.manutencao.repository.MecanicoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mecanicos")
public class MecanicoController {

    private final MecanicoRepository mecanicoRepository;

    public MecanicoController (MecanicoRepository mecanicoRepository) {
        this.mecanicoRepository = mecanicoRepository;
    }

    @GetMapping
    public ResponseEntity<?> listar () {
        try {
            List<Mecanico> listaMecanicos = mecanicoRepository.findAll();
            return ResponseEntity.ok(listaMecanicos);
        } catch (Exception error) {
            return ResponseEntity.status(500).body("Erro ao listar mecânicos");
        }
    }

    @PostMapping
    public ResponseEntity<?> cadastrar (@RequestBody Mecanico novoMecanico) {
        try {
            Mecanico mecanicoSalvo = mecanicoRepository.save(novoMecanico);
            return ResponseEntity.status(201).body(mecanicoSalvo);
        } catch (Exception error) {
            return ResponseEntity.status(500).body("Erro ao cadastrar Mecânico: " + error.getMessage());
        }
    }
}
