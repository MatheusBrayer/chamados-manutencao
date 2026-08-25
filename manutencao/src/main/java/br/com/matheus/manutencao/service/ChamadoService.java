package br.com.matheus.manutencao.service;

import br.com.matheus.manutencao.dto.ChamadoRequestDTO;
import br.com.matheus.manutencao.dto.ChamadoResponseDTO;
import br.com.matheus.manutencao.entity.Chamado;
import br.com.matheus.manutencao.entity.Maquina;
import br.com.matheus.manutencao.entity.Mecanico;
import br.com.matheus.manutencao.entity.Setor;
import br.com.matheus.manutencao.enums.TipoChamado;
import br.com.matheus.manutencao.exception.AcessoNegadoException;
import br.com.matheus.manutencao.repository.ChamadoRepository;
import br.com.matheus.manutencao.repository.MaquinaRepository;
import br.com.matheus.manutencao.repository.MecanicoRepository;
import br.com.matheus.manutencao.repository.SetorRepository;
import br.com.matheus.manutencao.specification.ChamadoSpecification;
import org.springframework.stereotype.Service;
import br.com.matheus.manutencao.enums.PerfilUsuario;

import java.time.LocalDate;
import java.util.List;

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

        Mecanico mecanico = mecanicoRepository.findByMatricula(dto.getMecanicoMatricula())
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

    public ChamadoResponseDTO buscarChamadoPorId(Long id) {
        Chamado chamado = chamadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chamado não encontrado!"));

        return converterParaResponseDTO(chamado);
    }

    private ChamadoResponseDTO converterParaResponseDTO(Chamado chamado) {
        ChamadoResponseDTO dto = new ChamadoResponseDTO();

        dto.setId(chamado.getId());
        dto.setTipo(chamado.getTipo());
        dto.setDefeito(chamado.getDefeito());
        dto.setSolucao(chamado.getSolucao());
        dto.setData(chamado.getData());

        if (chamado.getMaquina() != null) {
            dto.setNp(chamado.getMaquina().getNp());
            dto.setMaquina(chamado.getMaquina().getNome());
        }

        if (chamado.getSetor() != null) {
            dto.setSetorId(chamado.getSetor().getId());
            dto.setSetor(chamado.getSetor().getNome());
        }

        if (chamado.getMecanico() != null) {
            dto.setMecanicoMatricula(
                    chamado.getMecanico().getMatricula()
            );

            dto.setMecanico(
                    chamado.getMecanico().getNome()
            );
        }

        return dto;
    }

    public List<ChamadoResponseDTO> listarComFiltros(
            TipoChamado tipo,
            Long setorId,
            Long np,
            Integer mecanicoMatricula,
            LocalDate dataInicio,
            LocalDate dataFim
    ) {
        return chamadoRepository.findAll(
                        ChamadoSpecification.filtrar(
                                tipo,
                                setorId,
                                np,
                                mecanicoMatricula,
                                dataInicio,
                                dataFim
                        )
                )
                .stream()
                .map(this::converterParaResponseDTO)
                .toList();
    }

    private void validarPermissaoDeAlteracao(
            Chamado chamado,
            Mecanico usuarioLogado
    ) {
        boolean administrador =
                usuarioLogado.getPerfil() == PerfilUsuario.ADMIN;

        boolean mecanicoDoChamado =
                chamado.getMecanico()
                        .getMatricula()
                        .equals(usuarioLogado.getMatricula());

        if (!administrador && !mecanicoDoChamado) {
            throw new AcessoNegadoException(
                    "Você não possui permissão para alterar este chamado."
            );
        }
    }

    public void excluirChamado(
            Long chamadoId,
            Integer matriculaUsuario
    ) {
        Chamado chamado = chamadoRepository
                .findById(chamadoId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Chamado não encontrado."
                        )
                );

        Mecanico usuarioLogado = mecanicoRepository
                .findByMatricula(matriculaUsuario)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Usuário não encontrado."
                        )
                );

        validarPermissaoDeAlteracao(
                chamado,
                usuarioLogado
        );

        chamadoRepository.delete(chamado);
    }

    public ChamadoResponseDTO editarChamado(
            Long chamadoId,
            Integer matriculaUsuario,
            ChamadoRequestDTO dto
    ) {
        Chamado chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Chamado não encontrado."
                        )
                );

        Mecanico usuarioLogado = mecanicoRepository
                .findByMatricula(matriculaUsuario)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Usuário não encontrado."
                        )
                );

        validarPermissaoDeAlteracao(
                chamado,
                usuarioLogado
        );

        Setor setor = setorRepository
                .findById(dto.getSetorId())
                .orElseThrow(
                        () -> new RuntimeException(
                                "Setor não encontrado."
                        )
                );

        Mecanico mecanico = mecanicoRepository
                .findByMatricula(dto.getMecanicoMatricula())
                .orElseThrow(
                        () -> new RuntimeException(
                                "Mecânico não encontrado."
                        )
                );

        chamado.setTipo(dto.getTipo());
        chamado.setSetor(setor);
        chamado.setMecanico(mecanico);
        chamado.setDefeito(dto.getDefeito());
        chamado.setSolucao(dto.getSolucao());
        chamado.setData(dto.getData());

        if (dto.getTipo() == TipoChamado.MAQUINA) {
            Maquina maquina;

            if (dto.getNp() != null) {
                maquina = maquinaRepository
                        .findByNp(dto.getNp())
                        .orElseGet(() -> {
                            if (
                                    dto.getNome() == null ||
                                            dto.getNome().isBlank()
                            ) {
                                throw new RuntimeException(
                                        "Nome da máquina é obrigatório quando o NP não está cadastrado."
                                );
                            }

                            Maquina novaMaquina = new Maquina();
                            novaMaquina.setNp(dto.getNp());
                            novaMaquina.setNome(dto.getNome());

                            return maquinaRepository.save(
                                    novaMaquina
                            );
                        });
            } else {
                if (
                        dto.getNome() == null ||
                                dto.getNome().isBlank()
                ) {
                    throw new RuntimeException(
                            "Nome da máquina é obrigatório quando a máquina não possui NP."
                    );
                }

                Maquina novaMaquina = new Maquina();
                novaMaquina.setNp(null);
                novaMaquina.setNome(dto.getNome());

                maquina = maquinaRepository.save(
                        novaMaquina
                );
            }

            chamado.setMaquina(maquina);
        }

        if (dto.getTipo() == TipoChamado.PREDIAL) {
            chamado.setMaquina(null);
        }

        Chamado chamadoAtualizado =
                chamadoRepository.save(chamado);

        return converterParaResponseDTO(
                chamadoAtualizado
        );
    }

    private void validarPermissaoDeEdicao(
            Chamado chamado,
            Mecanico usuarioLogado
    ) {
        boolean administrador =
                usuarioLogado.getPerfil()
                        == PerfilUsuario.ADMIN;

        boolean mecanicoRegistrado =
                chamado.getMecanico()
                        .getMatricula()
                        .equals(
                                usuarioLogado.getMatricula()
                        );

        if (!administrador && !mecanicoRegistrado) {
            throw new AcessoNegadoException(
                    "Você não possui permissão para editar este chamado."
            );
        }
    }
}