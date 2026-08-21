package br.com.matheus.manutencao.service;

import br.com.matheus.manutencao.dto.LoginRequestDTO;
import br.com.matheus.manutencao.dto.LoginResponseDTO;
import br.com.matheus.manutencao.entity.Mecanico;
import br.com.matheus.manutencao.repository.MecanicoRepository;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService {

    private final MecanicoRepository mecanicoRepository;

    public AutenticacaoService(MecanicoRepository mecanicoRepository) {
        this.mecanicoRepository = mecanicoRepository;
    }

    public LoginResponseDTO entrar(LoginRequestDTO dadosLogin) {
        Mecanico mecanico = mecanicoRepository
                .findByMatricula(Math.toIntExact(dadosLogin.getMatricula()))
                .orElseThrow(
                        () -> new RuntimeException(
                                "Matrícula ou nome incorretos."
                        )
                );

        String nomeInformado = dadosLogin.getNome().trim();
        String nomeCadastrado = mecanico.getNome().trim();

        if (!nomeCadastrado.equalsIgnoreCase(nomeInformado)) {
            throw new RuntimeException(
                    "Matrícula ou nome incorretos."
            );
        }

        return new LoginResponseDTO(
                mecanico.getId(),
                mecanico.getMatricula(),
                mecanico.getNome()
        );
    }
}
