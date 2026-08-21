package br.com.matheus.manutencao.controller;

import br.com.matheus.manutencao.dto.LoginRequestDTO;
import br.com.matheus.manutencao.dto.LoginResponseDTO;
import br.com.matheus.manutencao.service.AutenticacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    public AutenticacaoController(
            AutenticacaoService autenticacaoService
    ) {
        this.autenticacaoService = autenticacaoService;
    }

    @PostMapping
    public ResponseEntity<?> entrar(
            @RequestBody LoginRequestDTO dadosLogin
    ) {
        try {
            LoginResponseDTO mecanico =
                    autenticacaoService.entrar(dadosLogin);

            return ResponseEntity.ok(mecanico);

        } catch (RuntimeException erro) {
            return ResponseEntity
                    .status(401)
                    .body(erro.getMessage());

        } catch (Exception erro) {
            return ResponseEntity
                    .status(500)
                    .body("Erro ao realizar login.");
        }
    }
}