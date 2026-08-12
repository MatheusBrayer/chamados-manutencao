package br.com.matheus.manutencao.service;

import br.com.matheus.manutencao.dto.ChamadoRequestDTO;
import br.com.matheus.manutencao.entity.Chamado;
import br.com.matheus.manutencao.entity.Maquina;
import br.com.matheus.manutencao.entity.Mecanico;
import br.com.matheus.manutencao.entity.Setor;
import br.com.matheus.manutencao.enums.TipoChamado;
import br.com.matheus.manutencao.repository.ChamadoRepository;
import br.com.matheus.manutencao.repository.MaquinaRepository;
import br.com.matheus.manutencao.repository.MecanicoRepository;
import br.com.matheus.manutencao.repository.SetorRepository;
import org.springframework.stereotype.Service;

@Service
public class ChamadoService {

    private final ChamadoRepository chamadoRepository;
    private final MaquinaRepository maquinaRepository;
    private final SetorRepository setorRepository;
    private final MecanicoRepository mecanicoRepository;

    public ChamadoService(
            ChamadoRepository chamadoRepository,
            MaquinaRepository maquinaRepository,
            SetorRepository setorRepository,
            MecanicoRepository mecanicoRepository
    ) {
        this.chamadoRepository = chamadoRepository;
        this.maquinaRepository = maquinaRepository;
        this.setorRepository = setorRepository;
        this.mecanicoRepository = mecanicoRepository;
    }

    public Chamado cadastrarChamado(ChamadoRequestDTO dto) {

        Setor setor = setorRepository.findById(dto.getSetorId())
                .orElseThrow(() -> new RuntimeException("Setor não encontrado"));

        Mecanico mecanico = mecanicoRepository.findById(dto.getMecanicoId())
                .orElseThrow(() -> new RuntimeException("Mecânico não encontrado"));

        Chamado chamado = new Chamado();

        chamado.setTipo(dto.getTipo());
        chamado.setSetor(setor);
        chamado.setMecanico(mecanico);
        chamado.setDefeito(dto.getDefeito());
        chamado.setSolucao(dto.getSolucao());
        chamado.setData(dto.getData());

        if (dto.getTipo() == TipoChamado.MAQUINA) {

            Maquina maquina;

            if (dto.getNp() != null) {

                maquina = maquinaRepository.findByNp(dto.getNp())
                        .orElseGet(() -> {
                            if (dto.getNome() == null || dto.getNome().isBlank()) {
                                throw new RuntimeException("Nome da máquina é obrigatório quando o NP não está cadastrado!");
                            }

                            Maquina novaMaquina = new Maquina();
                            novaMaquina.setNp(dto.getNp());
                            novaMaquina.setNome(dto.getNome());

                            return maquinaRepository.save(novaMaquina);
                        });

            } else {

                if (dto.getNome() == null || dto.getNome().isBlank()) {
                    throw new RuntimeException("Nome da máquina é obrigatório quando a máquina não possui NP!");
                }

                Maquina novaMaquina = new Maquina();
                novaMaquina.setNp(null);
                novaMaquina.setNome(dto.getNome());

                maquina = maquinaRepository.save(novaMaquina);
            }

            chamado.setMaquina(maquina);
        }

        if (dto.getTipo() == TipoChamado.PREDIAL) {
            chamado.setMaquina(null);
        }

        return chamadoRepository.save(chamado);
    }
}