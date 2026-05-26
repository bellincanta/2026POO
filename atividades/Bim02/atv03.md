# Atividade: Extensão do Sistema de Empréstimos com POO

## Objetivo da Atividade

Aplicar os conceitos de **Herança**, **Sobreposição de Métodos** e **Polimorfismo** em TypeScript para estender um sistema de gerenciamento de empréstimos bancários. 

---

## Material do Projeto

### **Baixe o Projeto Base Aqui:**

- **[Emprestimo.zip](Emprestimo.zip)** - Projeto base com classes Emprestimo e EmprestimoTA

**Conteúdo do ZIP:**
- `Emprestimo.ts` - Classe base (não modifique)
- `EmprestimoTA.ts` - Exemplo de herança (estude)
- `ConjuntoEmprestimos.ts` - Gerenciador (não modifique)
- `ConjuntoEmprestimosPoli.ts` - Programa principal
- `tsconfig.json` - Configuração TypeScript

---


## Estrutura Atual do Projeto

### Classes Existentes:

**Emprestimo (Classe Base)**
- `s` (saldo): valor inicial do empréstimo
- `n` (parcelas): número total de parcelas
- `j` (juros): percentual de juros
- Método: `proximaParcela()`: calcula próxima parcela com juros

**EmprestimoTA (Subclasse)**
- Herda de `Emprestimo`
- Adiciona `ta` (taxa adicional): valor fixo somado a cada parcela
- Sobrescreve `proximaParcela()`: adiciona a taxa ao valor base

---

## Tarefas 

### **Tarefa 1: Criar EmprestimoComDesconto**

Crie uma nova classe que estende `Emprestimo` com um **desconto progressivo**.

**Requisitos:**
- Receber no construtor: `(saldo, parcelas, juros, percentualDesconto)`
- O desconto deve ser aplicado na **última parcela** apenas
- Adicionar método getter `getPercentualDesconto(): number`
- Sobrescrever `proximaParcela()` para aplicar o desconto quando necessário

**Fórmula:**
```
Se é a última parcela:
  parcela = parcela - (parcela * percentualDesconto / 100)
```


---

### **Tarefa 2: Criar EmprestimoEducacional**

Crie uma subclasse para empréstimos com **juros reduzidos** ou **taxa zero** por período.

**Requisitos:**
- Receber no construtor: `(saldo, parcelas, juros, periodoIsencao)`
- Durante `periodoIsencao` primeiras parcelas: **sem juros**
- Após `periodoIsencao`: com juros normais
- Adicionar método getter `getPeriodoIsencao(): number`
- Sobrescrever `proximaParcela()`

---

### **Tarefa 3: Criar EmprestimoComJurosProgressivo**

Crie uma subclasse com **juros que aumentam ao longo do tempo**.

**Requisitos:**
- Receber no construtor: `(saldo, parcelas, jurosInicial, acrescimoJuros)`
- Juros aumentam a cada parcela: `juros = juros + acrescimoJuros`
- Adicionar método getter `getAcrescimoJuros(): number`
- Sobrescrever `proximaParcela()`


---

### **Tarefa 4: Criar EmprestimoMoradia**

Crie uma subclasse especializada para **financiamento imobiliário**.

**Requisitos:**
- Receber no construtor: `(saldo, parcelas, juros, temSeguroMoradia)`
- Se parcelas > 120 (10 anos): reduzir 15% dos juros
- Se `temSeguroMoradia`: adicionar 10 reais por parcela (seguro)
- Adicionar método getter `temSeguro(): boolean`
- Sobrescrever `proximaParcela()` para aplicar as regras acima

**Fórmula:**
```
jurosAjustado = (parcelas > 120) ? juros * 0.85 : juros

Se temSeguroMoradia:
  parcela = parcela + 10 (seguro)
```

---

### **Tarefa 5: Criar EmprestimoVeiculo**

Crie uma subclasse para **financiamento de veículos** com cálculo diferenciado.

**Requisitos:**
- Receber no construtor: `(saldo, parcelas, juros, tipo)` onde tipo é 'novo' ou 'usado'
- Veículo novo: juros normais
- Veículo usado: adiciona 1% aos juros (risco maior)
- Se parcelas > 60: adicionar 2% de taxa administrativa
- Adicionar método getter `getTipo(): string`
- Sobrescrever `proximaParcela()` com lógica diferenciada

**Fórmula:**
```
Se tipo === 'usado':
  jurosAjustado = juros + 1

Se parcelas > 60:
  parcela = parcela + (parcela * 0.02)  // taxa administrativa
```

---

### **Tarefa 6: Criar EmprestimoComFiador**

Crie uma subclasse que **reduz juros com a presença de fiador**.

**Requisitos:**
- Receber no construtor: `(saldo, parcelas, juros, temFiador)`
- Com fiador: reduzir 20% dos juros (risco menor)
- Sem fiador: adicionar 5% de taxa de risco
- Adicionar método getter `verificarFiador(): boolean`
- Sobrescrever `proximaParcela()`

**Fórmula:**
```
Se temFiador:
  jurosAjustado = juros * 0.80  // 20% desconto

Se NÃO temFiador:
  jurosAjustado = juros * 1.05  // +5% taxa de risco
```

---
