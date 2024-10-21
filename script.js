
    class SimuladorMaquina {
      constructor() {
        this.registradores = new Array(16).fill(0); // 16 registradores de 8 bits
        this.memoria = new Array(256).fill(0);      // 256 células de memória de 8 bits
        this.contadorInstrucoes = 0;
        this.R = 0;
        
        this.operacoes = {
          0x1: this.loadMemoria.bind(this),
          0x2: this.loadImediato.bind(this),
          0x3: this.store.bind(this),
          0x4: this.move.bind(this),
          0x5: this.addCompleto.bind(this),
          0x6: this.addFlutuante.bind(this),
          0x7: this.or.bind(this),
          0x8: this.and.bind(this),
          0x9: this.exclusiveOr.bind(this),
          0xA: this.rotate.bind(this),
          0xB: this.jump.bind(this),
          0xC: this.halt.bind(this)
        };
      }

      loadValor(R, valor) {
        // Lógica para carregar o valor no registrador R
        this.registradores[R] = valor;
        this.mostrarResultado(`Carregado registrador R${R} com valor ${valor}`);
      }

      loadRegistrador(R, endereco) {
        // Lógica para carregar o registrador a partir da memória
        // Exemplo:
        this.registradores[R] = this.memoria[endereco];
        this.mostrarResultado(`Carregado registrador R${R} com valor da memória ${endereco}`);
      }


      addComplementoDeDois(S, T) {
        const resultado = (this.registradores[S] + this.registradores[T]) & 0xFF; // Somente os últimos 8 bits
        // Use S instead of R
        this.registradores[S] = resultado; // Store the result back into register S
        this.mostrarResultado(`ADD: Registrador R${S} = ${this.registradores[S]}`);
    }

      executarInstrucao(instrucaoHex) {
        const instrucao = parseInt(instrucaoHex, 16);
        const opcode = (instrucao & 0xF000) >> 12;
        const operandos = instrucao & 0x0FFF;

        if (this.operacoes[opcode]) {
          this.operacoes[opcode](operandos);
        } else {
          this.mostrarResultado(`Operação desconhecida: ${opcode.toString(16)}`);
        }
      }

      // LOAD RXY: Carrega o registrador R com o conteúdo da memória XY
      loadMemoria(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const XY = operandos & 0x00FF;
        this.registradores[R] = this.memoria[XY];
        this.mostrarResultado(`LOAD: Registrador R${R} carregado com ${this.registradores[R]} da memória ${XY}`);
      }

      // LOAD RXY: Carrega o registrador R com o valor imediato XY
      loadImediato(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const XY = operandos & 0x00FF;
        this.registradores[R] = XY;
        this.mostrarResultado(`LOAD imediato: Registrador R${R} carregado com valor ${XY}`);
      }

      // STORE RXY: Armazena o conteúdo do registrador R na memória XY
      store(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const XY = operandos & 0x00FF;
        this.memoria[XY] = this.registradores[R];
        this.mostrarResultado(`STORE: Registrador R${R} armazenado na memória ${XY}`);
      }

      // MOVE R,S: Move o conteúdo de R para S
      move(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const S = (operandos & 0x00F0) >> 4;
        this.registradores[S] = this.registradores[R];
        this.mostrarResultado(`MOVE: Registrador R${R} copiado para Registrador S${S}`);
      }

      // ADD R,S,T: Soma os conteúdos de S e T, coloca em R (complemento de dois)
      addCompleto(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const S = (operandos & 0x00F0) >> 4;
        const T = operandos & 0x000F;
        this.registradores[R] = (this.registradores[S] + this.registradores[T]) & 0xFF;
        this.mostrarResultado(`ADD: Soma de R${S} e R${T} resultando em R${R} = ${this.registradores[R]}`);
      }

      // ADD R,S,T: Soma com vírgula flutuante (simplificado aqui como adição normal)
      addFlutuante(operandos) {
        this.addCompleto(operandos);
      }

      // OR R,S,T: Faz OR lógico entre S e T, coloca em R
      or(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const S = (operandos & 0x00F0) >> 4;
        const T = operandos & 0x000F;
        this.registradores[R] = this.registradores[S] | this.registradores[T];
        this.mostrarResultado(`OR: R${S} OR R${T} resultando em R${R} = ${this.registradores[R]}`);
      }

      // AND R,S,T: Faz AND lógico entre S e T, coloca em R
      and(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const S = (operandos & 0x00F0) >> 4;
        const T = operandos & 0x000F;
        this.registradores[R] = this.registradores[S] & this.registradores[T];
        this.mostrarResultado(`AND: R${S} AND R${T} resultando em R${R} = ${this.registradores[R]}`);
      }

      // XOR R,S,T: Faz XOR lógico entre S e T, coloca em R
      exclusiveOr(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const S = (operandos & 0x00F0) >> 4;
        const T = operandos & 0x000F;
        this.registradores[R] = this.registradores[S] ^ this.registradores[T];
        this.mostrarResultado(`XOR: R${S} XOR R${T} resultando em R${R} = ${this.registradores[R]}`);
      }

      // ROTATE R0X: Rotaciona o registrador R X bits à direita
      rotate(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const X = operandos & 0x000F;
        this.registradores[R] = (this.registradores[R] >> X) | (this.registradores[R] << (8 - X)) & 0xFF;
        this.mostrarResultado(`ROTATE: Registrador R${R} rotacionado ${X} bits`);
      }

      // JUMP RX,Y: Salta para XY se R == 0
      jump(operandos) {
        const R = (operandos & 0x0F00) >> 8;
        const XY = operandos & 0x00FF;
        if (this.registradores[R] === 0) {
          this.contadorInstrucoes = XY;
          this.mostrarResultado(`JUMP: Pulando para o endereço ${XY} pois R${R} == 0`);
        } else {
          this.mostrarResultado(`JUMP: Nenhum salto, R${R} != 0`);
        }
      }

     // HALT: Para a execução
halt() {
  this.mostrarResultado('HALT: Execução parada.');
  this.executando = false; // Atribui false para indicar que a execução foi finalizada
}

// Método para exibir resultados na interface
mostrarResultado(mensagem) {
  const output = document.getElementById('output'); // Supondo que exista um elemento HTML com id 'output'
  const resultadoAtual = output.innerHTML;
  output.innerHTML = resultadoAtual + '<br>' + mensagem;
}

// Função principal de execução da instrução
executarInstrucao(instrucao) {
  const opcode = instrucao.substring(0, 1); // Código de operação
  const operando = instrucao.substring(1); // Campo de operando

  switch (opcode) {
    case '1':
      this.loadRegistrador(operando); // Chama o método LOAD
      break;
    case '2':
      this.loadValor(operando); // Chama o método LOAD com valor imediato
      break;
    case '3':
      this.store(operando); // Chama o método STORE
      break;
    case '4':
      this.move(operando); // Chama o método MOVE
      break;
    case '5':
        const S = (operandos & 0x0F00) >> 8; // Extract the S register
        const T = (operandos & 0x00F0) >> 4; // Extract the T register
        this.addComplementoDeDois(S, T); // Chama o método ADD complemento de dois
      break;
    case '6':
      this.addPontoFlutuante(operando); // Chama o método ADD ponto flutuante
      break;
    case '7':
      this.orLogico(operando); // Chama o método OR lógico
      break;
    case '8':
      this.andLogico(operando); // Chama o método AND lógico
      break;
    case '9':
      this.xorLogico(operando); // Chama o método EXCLUSIVE OR
      break;
    case 'A':
      this.rotateBits(operando); // Chama o método ROTATE
      break;
    case 'B':
      this.jumpCondicional(operando); // Chama o método JUMP condicional
      break;
    case 'C':
      this.halt(); // Chama o método HALT para parar a execução
      break;
    default:
      this.mostrarResultado('Opcode inválido: ' + opcode);
  }
}

// Exemplo de inicialização do programa
iniciarPrograma(codigo) {
  this.executando = true;
  const instrucoes = codigo.match(/.{1,4}/g); // Divide o código em instruções de 4 caracteres (2 bytes cada)
  
  instrucoes.forEach(instrucao => {
    if (this.executando) {
      this.executarInstrucao(instrucao); // Executa cada instrução
    }
  });
}

// Exemplo de uso
// HALT: Para a execução
halt() {
    this.mostrarResultado('HALT: Execução parada.');
    this.executando = false; // Atribui false para indicar que a execução foi finalizada
  }
  
  // Método para exibir resultados na interface
  mostrarResultado(mensagem) {
    const output = document.getElementById('output'); // Supondo que exista um elemento HTML com id 'output'
    const resultadoAtual = output.innerHTML;
    output.innerHTML = resultadoAtual + '<br>' + mensagem;
  }
  
  // Função principal de execução da instrução
  executarInstrucao(instrucao) {
    const opcode = instrucao.substring(0, 1); // Código de operação
    const operando = instrucao.substring(1); // Campo de operando
  
    switch (opcode) {
      case '1':
        this.loadRegistrador(operando); // Chama o método LOAD
        break;
      case '2':
        this.loadValor(operando); // Chama o método LOAD com valor imediato
        break;
      case '3':
        this.store(operando); // Chama o método STORE
        break;
      case '4':
        this.move(operando); // Chama o método MOVE
        break;
      case '5':
        this.addComplementoDeDois(operando); // Chama o método ADD complemento de dois
        break;
      case '6':
        this.addPontoFlutuante(operando); // Chama o método ADD ponto flutuante
        break;
      case '7':
        this.orLogico(operando); // Chama o método OR lógico
        break;
      case '8':
        this.andLogico(operando); // Chama o método AND lógico
        break;
      case '9':
        this.xorLogico(operando); // Chama o método EXCLUSIVE OR
        break;
      case 'A':
        this.rotateBits(operando); // Chama o método ROTATE
        break;
      case 'B':
        this.jumpCondicional(operando); // Chama o método JUMP condicional
        break;
      case 'C':
        this.halt(); // Chama o método HALT para parar a execução
        break;
      default:
        this.mostrarResultado('Opcode inválido: ' + opcode);
    }
  }
  
  // Exemplo de inicialização do programa
  iniciarPrograma(codigo) {
    this.executando = true;
    const instrucoes = codigo.match(/.{1,4}/g); // Divide o código em instruções de 4 caracteres (2 bytes cada)
    
    instrucoes.forEach(instrucao => {
      if (this.executando) {
        this.executarInstrucao(instrucao); // Executa cada instrução
      }
    });
  }
}

// Função para validar se o valor inserido é um hexadecimal de 2 dígitos
function isValidHex(value) {
  return /^[0-9A-Fa-f]{2}$/.test(value);
}

// Referências aos elementos
const inputAddress = document.getElementById('input1');
const inputValue = document.getElementById('input2');
const saveButton = document.getElementById('saveBtn');
const errorMessage = document.getElementById('error-message');

// Evento para o botão salvar
saveButton.addEventListener('click', () => {
  const address = inputAddress.value.trim();  // Remove espaços extras
  const value = inputValue.value.trim();

  // Validações
  if (!isValidHex(address)) {
    errorMessage.textContent = 'Please enter a valid hexadecimal address (00 to FF).';
    return;
  }
  
  if (!isValidHex(value)) {
    errorMessage.textContent = 'Please enter a valid 8-bit value (00 to FF).';
    return;
  }

  // Se for válido, continue com o armazenamento
  errorMessage.textContent = '';  // Limpa a mensagem de erro
  console.log(`Address: ${address}, Value: ${value}`);
  
  // Aqui você pode adicionar a lógica para salvar o valor na memória
  // Exemplo de um objeto simulando a memória:
  const memory = {};
  memory[address] = value;
  console.log('Memory:', memory);

  // Opcional: Limpar os campos após salvar
  inputAddress.value = '';
  inputValue.value = '';
});
