package br.com.matheus.manutencao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaquinaResponseDTO {

    private Long id;
    private Long np;
    private String nome;
    private Long setorId;
    private String setor;
}