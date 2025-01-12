# Máquina Hipotética

Este projeto simula uma máquina hipotética com 16 registradores de propósito geral e 256 células de memória. Cada registrador e célula de memória podem armazenar valores binários, e as instruções são executadas sequencialmente para realizar operações aritméticas, lógicas e de controle.

## Tabela de Instruções

Abaixo estão descritas as instruções suportadas pela máquina hipotética. Cada instrução é composta por um código de operação e um operando, que especifica os registradores e os valores envolvidos na operação.

| Código de operação | Operando | Descrição |
|--------------------|----------|-----------|
| 1 | RXY | **LOAD**: Carrega o registrador R com o valor encontrado na posição de memória XY. |
| 2 | RXY | **LOAD**: Carrega o registrador R com o valor XY. Exemplo: `20A3` coloca `A3` no registrador 0. |
| 3 | RXY | **STORE**: Armazena o conteúdo do registrador R na posição de memória XY. Exemplo: `35B1` armazena o conteúdo do registrador 5 na posição `B1`. |
| 4 | 0RS | **MOVE**: Copia o conteúdo do registrador R para o registrador S. Exemplo: `40A4` copia o conteúdo do registrador A para o registrador 4. |
| 5 | RST | **ADD**: Soma os valores dos registradores S e T, em complemento de dois, e armazena o resultado no registrador R. Exemplo: `5726` soma os valores dos registradores 2 e 6 e armazena o resultado no registrador 7. |
| 6 | RST | **ADD (ponto flutuante)**: Soma os valores dos registradores S e T em notação de ponto flutuante e armazena o resultado no registrador R. Exemplo: `634E` soma os valores dos registradores 4 e E em ponto flutuante e armazena o resultado no registrador 3. |
| 7 | RST | **OR**: Realiza a operação lógica OR entre os registradores S e T e armazena o resultado no registrador R. Exemplo: `7CB4` coloca no registrador C o resultado da operação OR entre os registradores B e 4. |
| 8 | RST | **AND**: Realiza a operação lógica AND entre os registradores S e T e armazena o resultado no registrador R. Exemplo: `8045` coloca no registrador 0 o resultado da operação AND entre os registradores 4 e 5. |
| 9 | RST | **XOR**: Realiza a operação lógica XOR entre os registradores S e T e armazena o resultado no registrador R. Exemplo: `95F3` coloca no registrador 5 o resultado da operação XOR entre os registradores F e 3. |
| A | R0X | **ROTATE**: Gira o conteúdo do registrador R por X bits à direita, com rotação circular. Exemplo: `A403` gira o conteúdo do registrador 4 em 3 bits à direita. |
| B | RXY | **JUMP**: Se o conteúdo do registrador R for igual ao conteúdo do registrador 0, a execução salta para a posição de memória XY. Exemplo: `B43C` compara os registradores 4 e 0 e, se forem iguais, o contador de instruções é alterado para `3C`. |
| C | 000 | **HALT**: Interrompe a execução do programa. Exemplo: `C000` para a execução. |
