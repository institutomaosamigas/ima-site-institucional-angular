import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';

interface Experiencia {
  cargo: string;
  empresa: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
}

interface Formacao {
  instituicao: string;
  curso: string;
  dataInicio: string;
  dataFim: string;
  status: string;
}

interface Projeto {
  nome: string;
  descricao: string;
  tecnologias: string;
  link: string;
}

interface Link {
  rotulo: string;
  url: string;
}

@Component({
  selector: 'app-gerador-curriculo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerador-curriculo.component.html',
  styleUrl: './gerador-curriculo.component.scss',
})
export class GeradorCurriculoComponent implements AfterViewInit {
  // Opções de status para formação acadêmica
  statusFormacao = ['Concluído', 'Cursando', 'Incompleto', 'Em andamento'];

  // Paletas de cores disponíveis
  paletasCores = [
    {
      nome: 'Magenta Profissional',
      primaria: '#b300aa',
      secundaria: '#500150',
      rgb: [179, 0, 170],
    },
    {
      nome: 'Azul Corporativo',
      primaria: '#0066cc',
      secundaria: '#003d7a',
      rgb: [0, 102, 204],
    },
    {
      nome: 'Verde Moderno',
      primaria: '#00a86b',
      secundaria: '#006644',
      rgb: [0, 168, 107],
    },
    {
      nome: 'Laranja Criativo',
      primaria: '#ff6b35',
      secundaria: '#cc4422',
      rgb: [255, 107, 53],
    },
    {
      nome: 'Roxo Elegante',
      primaria: '#7b2cbf',
      secundaria: '#4a148c',
      rgb: [123, 44, 191],
    },
    {
      nome: 'Vermelho Vibrante',
      primaria: '#dc143c',
      secundaria: '#8b0000',
      rgb: [220, 20, 60],
    },
    {
      nome: 'Preto Clássico',
      primaria: '#000000',
      secundaria: '#333333',
      rgb: [0, 0, 0],
    },
    {
      nome: 'Cinza Moderno',
      primaria: '#424242',
      secundaria: '#757575',
      rgb: [66, 66, 66],
    },
    {
      nome: 'Cinza Azulado',
      primaria: '#37474f',
      secundaria: '#546e7a',
      rgb: [55, 71, 79],
    },
  ];
  paletaSelecionada = this.paletasCores[0]; // Magenta por padrão

  // Dados Pessoais
  nome: string = '';
  cidade: string = '';
  estado: string = '';
  telefone: string = '';
  email: string = '';
  linkedin: string = '';
  github: string = '';
  linksCustomizados: Link[] = [];
  novoLinkRotulo: string = '';
  novoLinkUrl: string = '';
  mostrarInputLink: boolean = false;

  // Resumo Profissional
  resumoProfissional: string = '';

  // Experiências Profissionais
  experiencias: Experiencia[] = [];

  // Formação Acadêmica
  formacoes: Formacao[] = [];

  // Projetos de Destaque
  projetos: Projeto[] = [];

  // Habilidades Técnicas
  habilidades: string[] = [];
  novaHabilidade: string = '';

  // Seções expandidas
  secaoDadosExpandida: boolean = true;
  secaoResumoExpandida: boolean = false;
  secaoExperienciasExpandida: boolean = false;
  secaoFormacaoExpandida: boolean = false;
  secaoProjetosExpandida: boolean = false;
  secaoPaletaExpandida: boolean = true; // Começa aberta

  // Controle de inputs com Flatpickr inicializados
  private flatpickrInstances = new Set<HTMLElement>();
  secaoHabilidadesExpandida: boolean = false;

  // Adicionar nova experiência
  adicionarExperiencia(): void {
    this.experiencias.push({
      cargo: '',
      empresa: '',
      dataInicio: '',
      dataFim: '',
      descricao: '',
    });
    setTimeout(() => this.initializeFlatpickr(), 50);
  }

  removerExperiencia(index: number): void {
    this.experiencias.splice(index, 1);
  }

  // Adicionar nova formação
  adicionarFormacao(): void {
    this.formacoes.push({
      instituicao: '',
      curso: '',
      dataInicio: '',
      dataFim: '',
      status: 'Concluído',
    });
    setTimeout(() => this.initializeFlatpickr(), 50);
  }

  removerFormacao(index: number): void {
    this.formacoes.splice(index, 1);
  }

  // Adicionar novo projeto
  adicionarProjeto(): void {
    this.projetos.push({
      nome: '',
      descricao: '',
      tecnologias: '',
      link: '',
    });
  }

  removerProjeto(index: number): void {
    this.projetos.splice(index, 1);
  }

  // Adicionar/remover habilidade
  adicionarHabilidade(): void {
    if (this.novaHabilidade.trim()) {
      this.habilidades.push(this.novaHabilidade.trim());
      this.novaHabilidade = '';
    }
  }

  removerHabilidade(index: number): void {
    this.habilidades.splice(index, 1);
  }

  // Adicionar/remover link customizado
  adicionarLink(): void {
    if (this.novoLinkRotulo.trim() && this.novoLinkUrl.trim()) {
      this.linksCustomizados.push({
        rotulo: this.novoLinkRotulo.trim(),
        url: this.novoLinkUrl.trim(),
      });
      this.novoLinkRotulo = '';
      this.novoLinkUrl = '';
      // NÃO fechar o input, permitir adicionar múltiplos links
    }
  }

  removerLink(index: number): void {
    this.linksCustomizados.splice(index, 1);
  }

  toggleInputLink(): void {
    this.mostrarInputLink = !this.mostrarInputLink;
    if (!this.mostrarInputLink) {
      this.novoLinkRotulo = '';
      this.novoLinkUrl = '';
    }
  }

  // Toggle seções
  toggleSecao(secao: string): void {
    switch (secao) {
      case 'paleta':
        this.secaoPaletaExpandida = !this.secaoPaletaExpandida;
        break;
      case 'dados':
        this.secaoDadosExpandida = !this.secaoDadosExpandida;
        break;
      case 'resumo':
        this.secaoResumoExpandida = !this.secaoResumoExpandida;
        break;
      case 'experiencias':
        this.secaoExperienciasExpandida = !this.secaoExperienciasExpandida;
        break;
      case 'formacao':
        this.secaoFormacaoExpandida = !this.secaoFormacaoExpandida;
        break;
      case 'projetos':
        this.secaoProjetosExpandida = !this.secaoProjetosExpandida;
        break;
      case 'habilidades':
        this.secaoHabilidadesExpandida = !this.secaoHabilidadesExpandida;
        break;
    }

    // Inicializar Flatpickr após expandir seção
    setTimeout(() => this.initializeFlatpickr(), 50);
  }

  // Máscara de telefone
  aplicarMascaraTelefone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
      if (value.length <= 10) {
        // (XX) XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else {
        // (XX) XXXXX-XXXX
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      }
    }

    this.telefone = value.trim();
  }

  // Formatar cidade para capitalizar primeira letra de cada palavra
  formatarCidade(cidade: string): string {
    if (!cidade) return '';

    return cidade
      .toLowerCase()
      .split(' ')
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');
  }

  // Formatar data do formato YYYY-MM para "Mês Ano"
  formatarData(data: string): string {
    if (!data) return '';

    const meses = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    const [ano, mes] = data.split('-');
    const mesIndex = parseInt(mes, 10) - 1;

    return `${meses[mesIndex]} ${ano}`;
  }

  // Inicializar Flatpickr após a view carregar
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeFlatpickr();
    }, 100);
  }

  // Configurar Flatpickr para todos os campos de data
  initializeFlatpickr(): void {
    console.log('Iniciando Flatpickr...');
    const dateInputs = document.querySelectorAll('.date-input');
    console.log('Inputs encontrados:', dateInputs.length);

    dateInputs.forEach((input, index) => {
      const htmlInput = input as HTMLElement;

      // Verificar se já foi inicializado
      if (this.flatpickrInstances.has(htmlInput)) {
        console.log(`Input ${index + 1} já inicializado, pulando...`);
        return;
      }

      console.log(`Configurando input ${index + 1}...`);

      const instance = flatpickr(htmlInput, {
        locale: Portuguese,
        plugins: [
          monthSelectPlugin({
            shorthand: false,
            dateFormat: 'Y-m',
            altFormat: 'F \\d\\e Y',
          }),
        ],
        clickOpens: true,
        allowInput: true,
        onChange: (selectedDates: Date[], dateStr: string) => {
          console.log('Data selecionada:', dateStr);

          // Validar datas de experiências e formações
          this.validarDatas();

          // Trigger Angular change detection
          const ngModelChangeEvent = new Event('input', { bubbles: true });
          (htmlInput as HTMLInputElement).dispatchEvent(ngModelChangeEvent);
        },
      });

      console.log('Instância criada:', instance ? 'Sim' : 'Não');

      // Marcar como inicializado
      this.flatpickrInstances.add(htmlInput);

      // Fazer o ícone abrir o calendário
      const parent = htmlInput.parentElement;
      if (parent) {
        const icon = parent.querySelector('.calendar-icon');
        if (icon) {
          console.log('Ícone encontrado, adicionando listener...');
          icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Ícone clicado, abrindo calendário...');
            instance.open();
          });
        }
      }
    });

    console.log('Flatpickr inicializado!');
  }

  // Validar se data fim é maior ou igual à data início
  validarDatas(): void {
    // Validar experiências
    this.experiencias.forEach((exp, index) => {
      if (exp.dataInicio && exp.dataFim) {
        const [anoInicio, mesInicio] = exp.dataInicio.split('-').map(Number);
        const [anoFim, mesFim] = exp.dataFim.split('-').map(Number);

        const dataInicioNum = anoInicio * 12 + mesInicio;
        const dataFimNum = anoFim * 12 + mesFim;

        if (dataFimNum < dataInicioNum) {
          alert(
            `Experiência ${
              index + 1
            }: A data de término não pode ser anterior à data de início.`
          );
          exp.dataFim = '';
        }
      } else if (!exp.dataInicio && exp.dataFim) {
        // Se só tem data fim, validar quando preencher data início
        alert(
          `Experiência ${
            index + 1
          }: Por favor, preencha primeiro a data de início.`
        );
        exp.dataFim = '';
      }
    });

    // Validar formações
    this.formacoes.forEach((form, index) => {
      if (form.dataInicio && form.dataFim) {
        const [anoInicio, mesInicio] = form.dataInicio.split('-').map(Number);
        const [anoFim, mesFim] = form.dataFim.split('-').map(Number);

        const dataInicioNum = anoInicio * 12 + mesInicio;
        const dataFimNum = anoFim * 12 + mesFim;

        if (dataFimNum < dataInicioNum) {
          alert(
            `Formação ${
              index + 1
            }: A data de término não pode ser anterior à data de início.`
          );
          form.dataFim = '';
        }
      } else if (!form.dataInicio && form.dataFim) {
        // Se só tem data fim, validar quando preencher data início
        alert(
          `Formação ${
            index + 1
          }: Por favor, preencha primeiro a data de início.`
        );
        form.dataFim = '';
      }
    });
  }

  // Melhorar currículo com IA
  melhorarComIA(): void {
    alert(
      'Funcionalidade de IA em desenvolvimento! Em breve você poderá melhorar seu currículo automaticamente.'
    );
  }

  // Gerar PDF
  gerarPDF(): void {
    if (!this.nome && !this.email) {
      alert(
        'Por favor, preencha pelo menos seu nome e e-mail antes de gerar o currículo.'
      );
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Ordenar experiências por data (mais recente primeiro)
    const experienciasOrdenadas = [...this.experiencias].sort((a, b) => {
      const dataA = a.dataFim || a.dataInicio || '9999-99';
      const dataB = b.dataFim || b.dataInicio || '9999-99';
      return dataB.localeCompare(dataA);
    });

    // Ordenar formações por data (mais recente primeiro)
    const formacoesOrdenadas = [...this.formacoes].sort((a, b) => {
      const dataA = a.dataFim || a.dataInicio || '9999-99';
      const dataB = b.dataFim || b.dataInicio || '9999-99';
      return dataB.localeCompare(dataA);
    });

    // Helper para adicionar texto com quebra de linha
    const addText = (
      text: string,
      fontSize: number,
      isBold: boolean = false,
      color: number[] = [0, 0, 0],
      lineHeight: number = 1.4
    ): void => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);

      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);

      // Verificar se precisa de nova página
      const neededSpace = lines.length * fontSize * lineHeight * 0.35;
      if (yPosition + neededSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      lines.forEach((line: string, index: number) => {
        doc.text(
          line,
          margin,
          yPosition + index * fontSize * lineHeight * 0.35
        );
      });

      yPosition += lines.length * fontSize * lineHeight * 0.35;
    };

    const addSpace = (space: number): void => {
      yPosition += space;
    };

    const addLine = (): void => {
      const rgb = this.paletaSelecionada.rgb;
      doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    };

    // CABEÇALHO
    addText(this.nome.toUpperCase(), 18, true, this.paletaSelecionada.rgb);
    yPosition -= 5; // Reduzir espaço entre nome e contato

    // Contato - agora com links clicáveis
    let contatoParts: { text: string; link?: string }[] = [];

    if (this.cidade || this.estado) {
      const cidadeFormatada = this.formatarCidade(this.cidade);
      const estadoFormatado = this.estado.toUpperCase();
      contatoParts.push({
        text: `${cidadeFormatada}${
          this.cidade && this.estado ? ', ' : ''
        }${estadoFormatado}`,
      });
    }

    if (this.telefone) {
      contatoParts.push({ text: this.telefone });
    }

    if (this.email) {
      contatoParts.push({ text: this.email, link: `mailto:${this.email}` });
    }

    if (this.linkedin) {
      contatoParts.push({ text: 'LinkedIn', link: this.linkedin });
    }

    if (this.github) {
      contatoParts.push({ text: 'GitHub', link: this.github });
    }

    // Adicionar links customizados
    this.linksCustomizados.forEach((link) => {
      contatoParts.push({ text: link.rotulo, link: link.url });
    });

    // Renderizar contato com links
    if (contatoParts.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);

      let xPosition = margin;
      contatoParts.forEach((part, index) => {
        if (index > 0) {
          doc.text(' | ', xPosition, yPosition);
          xPosition += doc.getTextWidth(' | ');
        }

        if (part.link) {
          const rgb = this.paletaSelecionada.rgb;
          doc.setTextColor(rgb[0], rgb[1], rgb[2]); // Cor da paleta para links
          doc.textWithLink(part.text, xPosition, yPosition, { url: part.link });
          xPosition += doc.getTextWidth(part.text);
          doc.setTextColor(100, 100, 100); // Voltar para cinza
        } else {
          doc.text(part.text, xPosition, yPosition);
          xPosition += doc.getTextWidth(part.text);
        }
      });

      yPosition += 6; // Reduzir espaço após linha de contato
    }

    addLine();
    addSpace(2); // Reduzir espaço após linha divisória

    // RESUMO PROFISSIONAL
    if (this.resumoProfissional) {
      addText('RESUMO PROFISSIONAL', 12, true, this.paletaSelecionada.rgb);
      addText(this.resumoProfissional, 10);
      addSpace(5);
    }

    // EXPERIÊNCIAS PROFISSIONAIS
    if (experienciasOrdenadas.length > 0) {
      addText(
        'EXPERIÊNCIAS PROFISSIONAIS',
        12,
        true,
        this.paletaSelecionada.rgb
      );
      addSpace(2);

      experienciasOrdenadas.forEach((exp) => {
        // Linha com cargo, empresa e período
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(
          this.paletaSelecionada.rgb[0],
          this.paletaSelecionada.rgb[1],
          this.paletaSelecionada.rgb[2]
        );

        let headerText = '';
        if (exp.cargo) headerText += exp.cargo;
        if (exp.empresa)
          headerText += `${headerText ? ' | ' : ''}${exp.empresa}`;
        if (exp.dataInicio) {
          const periodo = exp.dataFim
            ? `${this.formatarData(exp.dataInicio)} – ${this.formatarData(
                exp.dataFim
              )}`
            : `${this.formatarData(exp.dataInicio)} – Atual`;
          headerText += `${headerText ? ' | ' : ''}${periodo}`;
        }

        if (headerText) {
          const lines = doc.splitTextToSize(headerText, pageWidth - margin * 2);
          if (yPosition + lines.length * 10 * 0.35 > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(lines, margin, yPosition);
          yPosition += lines.length * 10 * 0.35 + 2;
        }

        // Descrição
        if (exp.descricao) {
          addText(exp.descricao, 9.5, false, [0, 0, 0], 1.6);
        }

        addSpace(5);
      });

      addSpace(3);
    }

    // FORMAÇÃO ACADÊMICA
    if (formacoesOrdenadas.length > 0) {
      addText('FORMAÇÃO ACADÊMICA', 12, true, this.paletaSelecionada.rgb);
      addSpace(2);

      formacoesOrdenadas.forEach((form) => {
        // Instituição em cor secundária e negrito
        if (form.instituicao) {
          addText(form.instituicao, 10, true, this.paletaSelecionada.rgb);
        }

        // Curso, período e status em uma linha
        let formDetails = '';
        if (form.curso) formDetails += form.curso;
        if (form.dataInicio) {
          const periodo = form.dataFim
            ? `${this.formatarData(form.dataInicio)} – ${this.formatarData(
                form.dataFim
              )}`
            : `${this.formatarData(form.dataInicio)} – Atual`;
          formDetails += `${formDetails ? ' | ' : ''}${periodo}`;
        }
        if (form.status)
          formDetails += `${formDetails ? ' | ' : ''}${form.status}`;

        if (formDetails) {
          addText(formDetails, 9.5, false, [0, 0, 0]);
        }

        addSpace(5);
      });

      addSpace(3);
    }

    // PROJETOS DE DESTAQUE
    if (this.projetos.length > 0) {
      addText('PROJETOS DE DESTAQUE', 12, true, this.paletaSelecionada.rgb);
      addSpace(2);

      this.projetos.forEach((proj) => {
        // Título do projeto em cor secundária
        if (proj.nome) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(
            this.paletaSelecionada.rgb[0],
            this.paletaSelecionada.rgb[1],
            this.paletaSelecionada.rgb[2]
          );

          let xPosition = margin;
          const nomeWidth = doc.getTextWidth(proj.nome);

          if (yPosition + 10 > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }

          doc.text(proj.nome, xPosition, yPosition);
          xPosition += nomeWidth;

          // Se tem link, adicionar "Acesse o projeto" clicável
          if (proj.link) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(' – ', xPosition, yPosition);
            xPosition += doc.getTextWidth(' – ');

            doc.setTextColor(
              this.paletaSelecionada.rgb[0],
              this.paletaSelecionada.rgb[1],
              this.paletaSelecionada.rgb[2]
            );
            doc.textWithLink('Acesse o projeto', xPosition, yPosition, {
              url: proj.link,
            });
          }

          yPosition += 8;
        }

        if (proj.descricao) {
          addText(proj.descricao, 9.5, false, [0, 0, 0], 1.6);
        }

        if (proj.tecnologias) {
          addText(`Stack: ${proj.tecnologias}`, 9.5, false, [85, 85, 85]);
        }

        addSpace(5);
      });

      addSpace(3);
    }

    // HABILIDADES E FERRAMENTAS
    if (this.habilidades.length > 0) {
      addText(
        'HABILIDADES E FERRAMENTAS',
        12,
        true,
        this.paletaSelecionada.rgb
      );
      addSpace(2);

      // Renderizar habilidades em 2 colunas
      const colWidth = (pageWidth - margin * 2 - 20) / 2;
      let currentCol = 0;
      let startY = yPosition;

      this.habilidades.forEach((habilidade, index) => {
        const xPos = margin + currentCol * (colWidth + 20);

        if (yPosition + 12 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          startY = margin;
          currentCol = 0;
        }

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        // Bullet point
        doc.setTextColor(
          this.paletaSelecionada.rgb[0],
          this.paletaSelecionada.rgb[1],
          this.paletaSelecionada.rgb[2]
        );
        doc.text('•', xPos, yPosition);

        // Habilidade
        doc.setTextColor(0, 0, 0);
        doc.text(habilidade, xPos + 8, yPosition);

        currentCol++;
        if (currentCol >= 2) {
          currentCol = 0;
          yPosition += 12;
        }
      });

      // Se terminou na primeira coluna, ajustar yPosition
      if (currentCol === 1) {
        yPosition += 12;
      }
    }

    // Salvar PDF
    const nomeArquivo = this.nome
      ? `Curriculo_${this.nome.replace(/\s+/g, '_')}.pdf`
      : 'Curriculo.pdf';

    doc.save(nomeArquivo);
  }
}
