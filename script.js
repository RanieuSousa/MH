class SimuladorMaquina {
  constructor() {
    this.registradores = new Array(16).fill(0); 
    this.memoria = new Array(256).fill(0);     
    this.contadorInstrucoes = 0;
    this.executando = false;

    this.OPCODES = {
      LOAD_MEMORIA: 0x1,
      LOAD_IMEDIATO: 0x2,
      STORE: 0x3,
      MOVE: 0x4,
      ADD_COMPLETO: 0x5,
      ADD_FLUTUANTE: 0x6,
      OR: 0x7,
      AND: 0x8,
      XOR: 0x9,
      ROTATE: 0xA,
      JUMP: 0xB,
      HALT: 0xC
    };

    this.operacoes = {
      [this.OPCODES.LOAD_MEMORIA]: this.loadMemoria.bind(this),
      [this.OPCODES.LOAD_IMEDIATO]: this.loadImediato.bind(this),
      [this.OPCODES.STORE]: this.store.bind(this),
      [this.OPCODES.MOVE]: this.move.bind(this),
      [this.OPCODES.ADD_COMPLETO]: this.addCompleto.bind(this),
      [this.OPCODES.ADD_FLUTUANTE]: this.addFlutuante.bind(this),
      [this.OPCODES.OR]: this.or.bind(this),
      [this.OPCODES.AND]: this.and.bind(this),
      [this.OPCODES.XOR]: this.exclusiveOr.bind(this),
      [this.OPCODES.ROTATE]: this.rotate.bind(this),
      [this.OPCODES.JUMP]: this.jump.bind(this),
      [this.OPCODES.HALT]: this.halt.bind(this)
    };
  }

  extrairOperandos(operandos) {
    return {
      R: (operandos & 0x0F00) >> 8,
      S: (operandos & 0x00F0) >> 4,
      T: operandos & 0x000F,
      XY: operandos & 0x00FF
    };
  }

  mostrarResultado(mensagem) {
    const output = document.getElementById('output'); 
    output.innerHTML += `<br>${mensagem}`;
  }

  loadValor(R, valor) {
    this.registradores[R] = valor;
    this.mostrarResultado(`Carregado registrador R${R} com valor ${valor}`);
    console.log(`R${R}: ${this.registradores[R]}`); 
    this.atualizarTabelaRegistradores(); 
  }

  loadRegistrador(R, endereco) {
    this.registradores[R] = this.memoria[endereco];
    this.mostrarResultado(`Carregado registrador R${R} com valor da memória ${endereco}`);
    this.atualizarTabelaRegistradores();
  }

  addComplementoDeDois(S, T) {
    const resultado = (this.registradores[S] + this.registradores[T]) & 0xFF;
    this.registradores[S] = resultado;
    this.mostrarResultado(`ADD: Registrador R${S} = ${resultado}`);
    this.atualizarTabelaRegistradores(); 
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

  loadMemoria(operandos) {
    const { R, XY } = this.extrairOperandos(operandos);
  
    const enderecoMemoriaHex = XY.toString(16).toUpperCase(); 
    const valorMemoria = localStorage.getItem(enderecoMemoriaHex);
  
    console.log(`Tentando acessar a memória no endereço: ${enderecoMemoriaHex}`);
    console.log(`Valor na memória no endereço ${enderecoMemoriaHex}: ${valorMemoria}`);
  
    if (valorMemoria !== null) {
      this.registradores[R] = parseInt(valorMemoria, 16); 
      console.log(`LOAD: Registrador R${R} carregado com ${this.registradores[R]} da memória ${enderecoMemoriaHex}`);
      this.mostrarResultado(`LOAD: Registrador R${R} carregado com ${this.registradores[R]} da memória ${enderecoMemoriaHex}`);
    } else {
      console.log(`Endereço de memória ${enderecoMemoriaHex} não possui valor válido.`);
      this.mostrarResultado(`Erro: Endereço de memória ${enderecoMemoriaHex} não possui valor válido.`);
    }
  
    console.log(`R${R}: ${this.registradores[R]}`); 
    this.atualizarTabelaRegistradores(); 
  }

  loadImediato(operandos) {
    const { R, XY } = this.extrairOperandos(operandos);
    this.registradores[R] = XY;
    this.mostrarResultado(`LOAD imediato: Registrador R${R} carregado com valor ${XY}`);
    this.atualizarTabelaRegistradores(); 
  }

  store(operandos) {
    const { R, XY } = this.extrairOperandos(operandos);
    this.memoria[XY] = this.registradores[R];
    this.mostrarResultado(`STORE: Registrador R${R} armazenado na memória ${XY}`);
    console.log(`Memória[${XY}]: ${this.memoria[XY]}`); 
    this.atualizarTabelaRegistradores(); 
  }

  move(operandos) {
    const { R, S } = this.extrairOperandos(operandos);
    this.registradores[S] = this.registradores[R];
    this.mostrarResultado(`MOVE: Registrador R${R} copiado para Registrador S${S}`);
    this.atualizarTabelaRegistradores(); 
  }

  addCompleto(operandos) {
    const { R, S, T } = this.extrairOperandos(operandos);
    this.registradores[R] = (this.registradores[S] + this.registradores[T]) & 0xFF;
    this.mostrarResultado(`ADD: Soma de R${S} e R${T} resultando em R${R} = ${this.registradores[R]}`);
    this.atualizarTabelaRegistradores(); 
  }

  addFlutuante(operandos) {
    this.addCompleto(operandos);
  }

  or(operandos) {
    const { R, S, T } = this.extrairOperandos(operandos);
    this.registradores[R] = this.registradores[S] | this.registradores[T];
    this.mostrarResultado(`OR: R${S} OR R${T} resultando em R${R} = ${this.registradores[R]}`);
    this.atualizarTabelaRegistradores(); 
  }

  and(operandos) {
    const { R, S, T } = this.extrairOperandos(operandos);
    this.registradores[R] = this.registradores[S] & this.registradores[T];
    this.mostrarResultado(`AND: R${S} AND R${T} resultando em R${R} = ${this.registradores[R]}`);
    this.atualizarTabelaRegistradores();
  }

  exclusiveOr(operandos) {
    const { R, S, T } = this.extrairOperandos(operandos);
    this.registradores[R] = this.registradores[S] ^ this.registradores[T];
    this.mostrarResultado(`XOR: R${S} XOR R${T} resultando em R${R} = ${this.registradores[R]}`);
    this.atualizarTabelaRegistradores();
  }

  rotate(operandos) {
    const { R, X } = this.extrairOperandos(operandos);
    this.registradores[R] = (this.registradores[R] >> X) | (this.registradores[R] << (8 - X)) & 0xFF;
    this.mostrarResultado(`ROTATE: Registrador R${R} rotacionado ${X} bits`);
    this.atualizarTabelaRegistradores(); 
  }

  jump(operandos) {
    const { R, XY } = this.extrairOperandos(operandos);
    if (this.registradores[R] === 0) {
      this.contadorInstrucoes = XY;
      this.mostrarResultado(`JUMP: Pulando para o endereço ${XY} pois R${R} == 0`);
    } else {
      this.mostrarResultado(`JUMP: Nenhum salto, R${R} != 0`);
    }
  }

  halt() {
    this.mostrarResultado('HALT: Execução parada.');
    this.executando = false;
  }

  atualizarTabelaRegistradores() {
    const tabela = document.getElementById('tabela-registradores'); 
    tabela.innerHTML = ''; 

    this.registradores.forEach((valor, index) => {
      const linha = document.createElement('tr');
      linha.innerHTML = `<td>R${index}</td><td>${valor}</td>`;
      tabela.appendChild(linha);
    });
  }

  iniciarPrograma(codigo) {
    this.executando = true;
    const instrucoes = codigo.match(/.{1,4}/g); 

    instrucoes.forEach(instrucao => {
      if (this.executando) {
        this.executarInstrucao(instrucao); 
      }
    });
  }
}


const simulador = new SimuladorMaquina();
