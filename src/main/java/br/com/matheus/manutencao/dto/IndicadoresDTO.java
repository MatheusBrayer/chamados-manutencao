package br.com.matheus.manutencao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IndicadoresDTO {

    private Long totalChamados;

    private Long chamadosMaquina;

    private Long chamadosPredial;
}
