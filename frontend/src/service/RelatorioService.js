import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function desenharGraficoLinha(
  pdf,
  titulo,
  dados,
  obterRotulo,
  obterValor,
  obterSeries,
  posicaoY,
) {
  const largura = 170;
  const altura = 65;

  const x = 20;
  const y = posicaoY;

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(titulo, x, y);

  const graficoX = x + 12;
  const graficoY = y + 10;
  const graficoLargura = largura - 18;
  const graficoAltura = altura - 18;

  const valores = [];

  dados.forEach((item) => {
    obterSeries(item).forEach((serie) => {
      valores.push(Number(serie.valor) || 0);
    });
  });

  const maiorValor = Math.max(...valores, 1);

  const quantidadePontos = dados.length;

  const distanciaX =
    quantidadePontos > 1
      ? graficoLargura / (quantidadePontos - 1)
      : graficoLargura;

  pdf.setDrawColor(210, 214, 219);
  pdf.setLineWidth(0.3);

  for (let i = 0; i <= 5; i++) {
    const valor = (maiorValor / 5) * i;

    const linhaY =
      graficoY + graficoAltura - (valor / maiorValor) * graficoAltura;

    pdf.line(graficoX, linhaY, graficoX + graficoLargura, linhaY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);

    pdf.text(String(Math.round(valor)), graficoX - 5, linhaY + 2, {
      align: "right",
    });
  }

  pdf.setDrawColor(80, 80, 80);
  pdf.line(graficoX, graficoY, graficoX, graficoY + graficoAltura);

  pdf.line(
    graficoX,
    graficoY + graficoAltura,
    graficoX + graficoLargura,
    graficoY + graficoAltura,
  );

  const series = obterSeries(dados[0]);

  series.forEach((serieBase, indiceSerie) => {
    const pontos = [];

    dados.forEach((item, indice) => {
      const seriesItem = obterSeries(item)[indiceSerie];

      const valor = Number(seriesItem?.valor) || 0;

      const pontoX = graficoX + distanciaX * indice;

      const pontoY =
        graficoY + graficoAltura - (valor / maiorValor) * graficoAltura;

      pontos.push({
        x: pontoX,
        y: pontoY,
      });
    });

    pdf.setDrawColor(serieBase.r, serieBase.g, serieBase.b);

    pdf.setLineWidth(1);

    for (let i = 1; i < pontos.length; i++) {
      pdf.line(pontos[i - 1].x, pontos[i - 1].y, pontos[i].x, pontos[i].y);
    }

    pontos.forEach((ponto) => {
      pdf.setFillColor(serieBase.r, serieBase.g, serieBase.b);

      pdf.circle(ponto.x, ponto.y, 1.3, "F");
    });
  });

  dados.forEach((item, indice) => {
    const pontoX = graficoX + distanciaX * indice;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(80, 80, 80);

    pdf.text(String(obterRotulo(item)), pontoX, graficoY + graficoAltura + 8, {
      align: "center",
    });
  });

  const legendaY = graficoY + graficoAltura + 18;

  series.forEach((serie, indice) => {
    const legendaX = graficoX + indice * 45;

    pdf.setFillColor(serie.r, serie.g, serie.b);

    pdf.circle(legendaX, legendaY - 1, 1.5, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);

    pdf.text(serie.nome, legendaX + 4, legendaY + 2);
  });
}

export function gerarRelatorioPDF({
  periodo,
  indicadores,
  indicadoresMecanicos,
  dadosEvolucao,
  mes,
}) {
  const pdf = new jsPDF();

  pdf.setProperties({
    title: "Relátorio de chamados Manutenção",
    subject: `Relatório de chamados - ${periodo}`,
    author: "Manutenção Vulcabras",
  });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);

  pdf.text("Relátorio de chamados Manutenção", 20, 22);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(90, 90, 90);

  pdf.text(`Período: ${periodo}`, 20, 31);

  pdf.setTextColor(0, 0, 0);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);

  pdf.text("Resumo", 20, 45);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  pdf.text(`Total de chamados: ${indicadores.totalChamados}`, 20, 55);

  pdf.text(`Chamados de máquina: ${indicadores.chamadosMaquina}`, 20, 63);

  pdf.text(`Chamados prediais: ${indicadores.chamadosPredial}`, 20, 71);

  const dadosGrafico = dadosEvolucao || [];

  const dadosTotal = dadosGrafico;

  const dadosTipos = dadosGrafico;

  desenharGraficoLinha(
    pdf,
    "Total de chamados",
    dadosTotal,
    (item) => (mes ? item.dia : item.mes),
    (item) => item.totalChamados,
    (item) => [
      {
        nome: "Total",
        valor: item.totalChamados,
        r: 21,
        g: 94,
        b: 239,
      },
    ],
    90,
  );

  desenharGraficoLinha(
    pdf,
    "Chamados por tipo",
    dadosTipos,
    (item) => (mes ? item.dia : item.mes),
    (item) => item.totalChamados,
    (item) => [
      {
        nome: "Máquina",
        valor: item.chamadosMaquina,
        r: 16,
        g: 185,
        b: 129,
      },
      {
        nome: "Predial",
        valor: item.chamadosPredial,
        r: 245,
        g: 158,
        b: 11,
      },
    ],
    175,
  );

  pdf.addPage();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);

  pdf.text("Chamados por mecânico", 20, 22);

  autoTable(pdf, {
    startY: 30,
    head: [["Mecânico", "Máquina", "Predial", "Total"]],
    body: indicadoresMecanicos.map((mecanico) => [
      mecanico.nome,
      mecanico.chamadosMaquina,
      mecanico.chamadosPredial,
      mecanico.totalChamados,
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fontStyle: "bold",
    },
  });

  pdf.save("relatorio-chamados-manutencao.pdf");
}
