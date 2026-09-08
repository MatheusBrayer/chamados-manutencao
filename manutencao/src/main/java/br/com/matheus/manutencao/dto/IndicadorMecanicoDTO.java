package br.com.matheus.manutencao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IndicadorMecanicoDTO {

    private String nome;
    private Long chamadosMaquina;
    private Long chamadosPredial;
    private Long totalChamados;
}
