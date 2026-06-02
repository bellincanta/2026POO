# Aula 07 — Classes abstratas e classes concretas em TypeScript

Este material apresenta o conceito de **classes abstratas** e **classes concretas** em **Orientação a Objetos com TypeScript**. A proposta da aula é mostrar, de forma gradual, quando uma classe pode ser instanciada diretamente, quando ela deve servir apenas como modelo/base para outras classes e como esse recurso se relaciona com **herança**, **sobrescrita de métodos**, **encapsulamento** e **polimorfismo**.

---

## Sumário

- [0) Revisão: classes, objetos e herança](#0-revisão-classes-objetos-e-herança)
- [1) O que é uma classe concreta?](#1-o-que-é-uma-classe-concreta)
- [2) O que é uma classe abstrata?](#2-o-que-é-uma-classe-abstrata)
- [3) Diferenças entre classe abstrata e classe concreta](#3-diferenças-entre-classe-abstrata-e-classe-concreta)
- [4) Sintaxe de classe abstrata em TypeScript](#4-sintaxe-de-classe-abstrata-em-typescript)
- [5) Métodos abstratos e métodos concretos](#5-métodos-abstratos-e-métodos-concretos)
- [6) Exemplo prático: animais](#6-exemplo-prático-animais)
- [7) Exemplo completo: formas de pagamento](#7-exemplo-completo-formas-de-pagamento)
- [8) Classe abstrata com atributos e métodos protegidos](#8-classe-abstrata-com-atributos-e-métodos-protegidos)
- [9) Quando usar classes abstratas?](#9-quando-usar-classes-abstratas)
- [10) Classe abstrata x interface](#10-classe-abstrata-x-interface)
- [11) Exemplo para executar em sala](#11-exemplo-para-executar-em-sala)
- [Resumo para estudo](#resumo-para-estudo)

---

## 0) Revisão: classes, objetos e herança

Antes de estudar classes abstratas e concretas, é importante lembrar alguns conceitos já vistos.

Uma **classe** é um modelo usado para criar objetos.

Um **objeto** é uma instância criada a partir de uma classe.

A **herança** permite criar uma nova classe com base em outra classe já existente.

### Exemplo de herança

```ts
class Pessoa {
  protected nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }

  public apresentar(): void {
    console.log(`Nome: ${this.nome}`);
  }
}

class Aluno extends Pessoa {
  private matricula: string;

  constructor(nome: string, matricula: string) {
    super(nome);
    this.matricula = matricula;
  }

  public exibirDados(): void {
    this.apresentar();
    console.log(`Matrícula: ${this.matricula}`);
  }
}

const aluno = new Aluno("Ana", "2026001");
aluno.exibirDados();

export {};
```

Nesse exemplo:

- `Pessoa` é a superclasse;
- `Aluno` é a subclasse;
- `Aluno` herda o atributo `nome` e o método `apresentar()`;
- `super(nome)` chama o construtor da superclasse.

As classes abstratas entram justamente nesse contexto: elas são muito usadas quando queremos criar uma **classe base** para outras classes.

---

## 1) O que é uma classe concreta?

Uma **classe concreta** é uma classe comum, que pode ser usada diretamente para criar objetos.

Em TypeScript, quando declaramos uma classe usando apenas `class`, normalmente estamos criando uma classe concreta.

### Exemplo

**Arquivo:** `src/01-classe-concreta.ts`

```ts
class Produto {
  private nome: string;
  private preco: number;

  constructor(nome: string, preco: number) {
    this.nome = nome;
    this.preco = preco;
  }

  public exibirDados(): void {
    console.log(`Produto: ${this.nome}`);
    console.log(`Preço: R$ ${this.preco.toFixed(2)}`);
  }
}

const produto = new Produto("Mouse", 89.9);
produto.exibirDados();

export {};
```

### O que observar?

A classe `Produto` é concreta porque:

- pode ser instanciada diretamente com `new Produto(...)`;
- possui implementação completa de seus atributos e métodos;
- representa um objeto específico do sistema.

### Saída esperada

```text
Produto: Mouse
Preço: R$ 89.90
```

---

## 2) O que é uma classe abstrata?

Uma **classe abstrata** é uma classe que serve como **modelo base** para outras classes.

Ela não deve ser instanciada diretamente.

Em TypeScript, usamos a palavra-chave `abstract` para declarar uma classe abstrata.

### Exemplo conceitual

Imagine uma classe `Animal`.

Todo animal pode ter:

- nome;
- idade;
- capacidade de emitir som.

Mas o som de cada animal é diferente:

- cachorro late;
- gato mia;
- vaca muge;
- pato grasna.

Nesse caso, faz sentido criar uma classe abstrata `Animal`, deixando que cada subclasse implemente o seu próprio som.

---

## 3) Diferenças entre classe abstrata e classe concreta

| Característica | Classe concreta | Classe abstrata |
|---|---|---|
| Pode ser instanciada diretamente? | Sim | Não |
| Pode ter atributos? | Sim | Sim |
| Pode ter métodos implementados? | Sim | Sim |
| Pode ter métodos abstratos? | Não | Sim |
| Serve como modelo/base para outras classes? | Pode servir | Esse é o objetivo principal |
| Usa a palavra-chave `abstract`? | Não | Sim |

### Exemplo de instanciação permitida

```ts
class Carro {
  public ligar(): void {
    console.log("Carro ligado.");
  }
}

const carro = new Carro();
carro.ligar();

export {};
```

### Exemplo de instanciação não permitida

```ts
abstract class Veiculo {
  public abstract mover(): void;
}

// const veiculo = new Veiculo(); // Erro: não é possível instanciar classe abstrata

export {};
```

---

## 4) Sintaxe de classe abstrata em TypeScript

A estrutura básica de uma classe abstrata é:

```ts
abstract class NomeDaClasse {
  // atributos

  // métodos concretos

  // métodos abstratos
}
```

### Exemplo simples

```ts
abstract class FormaGeometrica {
  public abstract calcularArea(): number;
}

class Quadrado extends FormaGeometrica {
  private lado: number;

  constructor(lado: number) {
    super();
    this.lado = lado;
  }

  public calcularArea(): number {
    return this.lado * this.lado;
  }
}

const quadrado = new Quadrado(5);
console.log(`Área: ${quadrado.calcularArea()}`);

export {};
```

### Explicação

- `FormaGeometrica` é uma classe abstrata;
- `calcularArea()` é um método abstrato;
- `Quadrado` é uma classe concreta;
- `Quadrado` é obrigada a implementar `calcularArea()`;
- `new Quadrado(5)` é permitido;
- `new FormaGeometrica()` não seria permitido.

---

## 5) Métodos abstratos e métodos concretos

Uma classe abstrata pode conter dois tipos principais de métodos:

### 5.1 Método concreto

É um método que possui corpo, ou seja, possui implementação.

```ts
public exibirMensagem(): void {
  console.log("Mensagem padrão.");
}
```

### 5.2 Método abstrato

É um método sem corpo, apenas com assinatura.

```ts
public abstract calcularArea(): number;
```

A classe abstrata define que esse método deve existir, mas deixa a implementação para as subclasses.

### Exemplo misturando método concreto e abstrato

```ts
abstract class Relatorio {
  public gerarCabecalho(): void {
    console.log("=== Relatório do Sistema ===");
  }

  public abstract gerarConteudo(): void;
}

class RelatorioAlunos extends Relatorio {
  public gerarConteudo(): void {
    console.log("Lista de alunos matriculados.");
  }
}

const relatorio = new RelatorioAlunos();
relatorio.gerarCabecalho();
relatorio.gerarConteudo();

export {};
```

### O que observar?

A classe `Relatorio` já sabe gerar o cabeçalho, mas não sabe qual será o conteúdo específico. Por isso, `gerarCabecalho()` é concreto e `gerarConteudo()` é abstrato.

---

## 6) Exemplo prático: animais

Este exemplo mostra uma classe abstrata `Animal` e duas classes concretas: `Cachorro` e `Gato`.

**Arquivo:** `src/02-classe-abstrata-animal.ts`

```ts
abstract class Animal {
  protected nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }

  public apresentar(): void {
    console.log(`Animal: ${this.nome}`);
  }

  public abstract emitirSom(): void;
}

class Cachorro extends Animal {
  public emitirSom(): void {
    console.log(`${this.nome} está latindo: au au!`);
  }
}

class Gato extends Animal {
  public emitirSom(): void {
    console.log(`${this.nome} está miando: miau!`);
  }
}

const cachorro = new Cachorro("Rex");
const gato = new Gato("Mingau");

cachorro.apresentar();
cachorro.emitirSom();

gato.apresentar();
gato.emitirSom();

export {};
```

### Saída esperada

```text
Animal: Rex
Rex está latindo: au au!
Animal: Mingau
Mingau está miando: miau!
```

### O que esse exemplo mostra?

- `Animal` é uma classe abstrata;
- `Cachorro` e `Gato` são classes concretas;
- `Animal` possui um método concreto chamado `apresentar()`;
- `Animal` possui um método abstrato chamado `emitirSom()`;
- cada subclasse implementa `emitirSom()` de uma forma diferente;
- o atributo `nome` é `protected`, pois pode ser acessado pelas subclasses.

---

## 7) Exemplo completo: formas de pagamento

Agora vamos analisar um exemplo mais próximo de um sistema real.

Imagine um sistema que aceita diferentes formas de pagamento:

- Pix;
- cartão de crédito;
- boleto.

Toda forma de pagamento possui algo em comum:

- valor;
- validação básica do valor;
- emissão de comprovante.

Mas cada forma de pagamento processa o pagamento de maneira diferente.

Nesse caso, podemos criar uma classe abstrata `FormaPagamento`.

**Arquivo:** `src/03-formas-pagamento.ts`

```ts
abstract class FormaPagamento {
  protected valor: number;

  constructor(valor: number) {
    if (valor <= 0) {
      throw new Error("O valor do pagamento deve ser maior que zero.");
    }

    this.valor = valor;
  }

  public exibirComprovante(): void {
    console.log("=== Comprovante de pagamento ===");
    console.log(`Valor: R$ ${this.valor.toFixed(2)}`);
  }

  public abstract processar(): void;
}

class PagamentoPix extends FormaPagamento {
  private chavePix: string;

  constructor(valor: number, chavePix: string) {
    super(valor);
    this.chavePix = chavePix;
  }

  public processar(): void {
    console.log(`Processando pagamento via Pix para a chave ${this.chavePix}.`);
    this.exibirComprovante();
  }
}

class PagamentoCartaoCredito extends FormaPagamento {
  private numeroCartao: string;

  constructor(valor: number, numeroCartao: string) {
    super(valor);
    this.numeroCartao = numeroCartao;
  }

  public processar(): void {
    const finalCartao = this.numeroCartao.slice(-4);
    console.log(`Processando pagamento no cartão final ${finalCartao}.`);
    this.exibirComprovante();
  }
}

class PagamentoBoleto extends FormaPagamento {
  private codigoBarras: string;

  constructor(valor: number, codigoBarras: string) {
    super(valor);
    this.codigoBarras = codigoBarras;
  }

  public processar(): void {
    console.log(`Gerando boleto com código ${this.codigoBarras}.`);
    this.exibirComprovante();
  }
}

const pagamentoPix = new PagamentoPix(150, "cliente@email.com");
const pagamentoCartao = new PagamentoCartaoCredito(250, "1234567812345678");
const pagamentoBoleto = new PagamentoBoleto(300, "00190000090345678900123456789123456789000030000");

pagamentoPix.processar();
console.log();
pagamentoCartao.processar();
console.log();
pagamentoBoleto.processar();

export {};
```

### O que esse exemplo mostra?

- `FormaPagamento` concentra o que é comum a todos os pagamentos;
- `processar()` é abstrato porque cada forma de pagamento tem uma regra própria;
- `exibirComprovante()` é concreto porque todas as formas de pagamento podem reaproveitar esse comportamento;
- `PagamentoPix`, `PagamentoCartaoCredito` e `PagamentoBoleto` são classes concretas;
- as subclasses são obrigadas a implementar `processar()`.

### Saída esperada

```text
Processando pagamento via Pix para a chave cliente@email.com.
=== Comprovante de pagamento ===
Valor: R$ 150.00

Processando pagamento no cartão final 5678.
=== Comprovante de pagamento ===
Valor: R$ 250.00

Gerando boleto com código 00190000090345678900123456789123456789000030000.
=== Comprovante de pagamento ===
Valor: R$ 300.00
```

---

## 8) Classe abstrata com atributos e métodos protegidos

O modificador `protected` é muito usado em classes abstratas.

Ele permite que a classe base proteja seus dados contra acesso externo, mas ainda permita que as subclasses acessem esses dados.

**Arquivo:** `src/04-pessoa-sistema.ts`

```ts
abstract class PessoaSistema {
  protected nome: string;
  protected email: string;

  constructor(nome: string, email: string) {
    this.nome = nome;
    this.email = email;
  }

  public apresentar(): void {
    console.log(`Nome: ${this.nome}`);
    console.log(`E-mail: ${this.email}`);
  }

  public abstract exibirPermissao(): void;
}

class AlunoSistema extends PessoaSistema {
  private curso: string;

  constructor(nome: string, email: string, curso: string) {
    super(nome, email);
    this.curso = curso;
  }

  public exibirPermissao(): void {
    console.log(`${this.nome} pode acessar as disciplinas do curso ${this.curso}.`);
  }
}

class ProfessorSistema extends PessoaSistema {
  private disciplina: string;

  constructor(nome: string, email: string, disciplina: string) {
    super(nome, email);
    this.disciplina = disciplina;
  }

  public exibirPermissao(): void {
    console.log(`${this.nome} pode lançar notas na disciplina ${this.disciplina}.`);
  }
}

const aluno = new AlunoSistema("Igor", "igor@email.com", "TADS");
const professor = new ProfessorSistema("Nelson", "nelson@email.com", "POO");

console.log("=== Aluno ===");
aluno.apresentar();
aluno.exibirPermissao();

console.log("\n=== Professor ===");
professor.apresentar();
professor.exibirPermissao();

export {};
```

### O que esse exemplo mostra?

- `PessoaSistema` é uma classe abstrata;
- `AlunoSistema` e `ProfessorSistema` são classes concretas;
- `nome` e `email` são `protected`;
- `apresentar()` é um método concreto reaproveitado pelas subclasses;
- `exibirPermissao()` é um método abstrato implementado de forma diferente em cada subclasse.

---

## 9) Quando usar classes abstratas?

Use classes abstratas quando:

- existir uma classe base que representa uma ideia geral;
- essa classe base não fizer sentido como objeto direto;
- várias subclasses compartilharem atributos e métodos;
- algumas operações precisarem ser obrigatórias nas subclasses;
- você quiser padronizar comportamentos sem definir todos os detalhes na superclasse.

### Exemplos em que faz sentido

- `Animal` como base para `Cachorro`, `Gato` e `Passaro`;
- `FormaPagamento` como base para `PagamentoPix`, `PagamentoCartao` e `PagamentoBoleto`;
- `Funcionario` como base para `Professor`, `TecnicoAdministrativo` e `Coordenador`;
- `FormaGeometrica` como base para `Quadrado`, `Retangulo` e `Circulo`.

### Exemplos em que pode não fazer sentido

Nem toda herança precisa de classe abstrata.

Se a classe base pode ser usada diretamente, ela pode ser concreta.

Por exemplo, uma classe `Produto` pode ser concreta se o sistema permite cadastrar produtos genéricos diretamente.

---

## 10) Classe abstrata x interface

Classes abstratas e interfaces podem parecer parecidas, mas possuem diferenças importantes.

### Classe abstrata

Uma classe abstrata pode ter:

- atributos;
- construtor;
- métodos concretos;
- métodos abstratos;
- modificadores de acesso como `public`, `private` e `protected`.

### Interface

Uma interface normalmente descreve um contrato de estrutura/comportamento.

Ela informa o que uma classe deve possuir, mas não é usada para armazenar estado como uma classe.

### Exemplo com interface

```ts
interface Imprimivel {
  imprimir(): void;
}

class Documento implements Imprimivel {
  public imprimir(): void {
    console.log("Imprimindo documento...");
  }
}

const documento = new Documento();
documento.imprimir();

export {};
```

### Regra prática para os alunos

Use **classe abstrata** quando houver código comum para reaproveitar.

Use **interface** quando quiser apenas definir um contrato que várias classes devem seguir.

---

## 11) Exemplo 


```ts
abstract class Funcionario {
  protected nome: string;
  protected salarioBase: number;

  constructor(nome: string, salarioBase: number) {
    this.nome = nome;
    this.salarioBase = salarioBase;
  }

  public exibirDados(): void {
    console.log(`Nome: ${this.nome}`);
    console.log(`Salário base: R$ ${this.salarioBase.toFixed(2)}`);
  }

  public abstract calcularSalarioFinal(): number;
}

class Professor extends Funcionario {
  private horasExtras: number;
  private valorHoraExtra: number;

  constructor(nome: string, salarioBase: number, horasExtras: number, valorHoraExtra: number) {
    super(nome, salarioBase);
    this.horasExtras = horasExtras;
    this.valorHoraExtra = valorHoraExtra;
  }

  public calcularSalarioFinal(): number {
    return this.salarioBase + this.horasExtras * this.valorHoraExtra;
  }
}

class Coordenador extends Funcionario {
  private gratificacao: number;

  constructor(nome: string, salarioBase: number, gratificacao: number) {
    super(nome, salarioBase);
    this.gratificacao = gratificacao;
  }

  public calcularSalarioFinal(): number {
    return this.salarioBase + this.gratificacao;
  }
}

const professor = new Professor("Ana", 4000, 10, 80);
const coordenador = new Coordenador("Carlos", 5000, 1200);

console.log("=== Professor ===");
professor.exibirDados();
console.log(`Salário final: R$ ${professor.calcularSalarioFinal().toFixed(2)}`);

console.log("\n=== Coordenador ===");
coordenador.exibirDados();
console.log(`Salário final: R$ ${coordenador.calcularSalarioFinal().toFixed(2)}`);

export {};
```

---


## Resumo para estudo

- Uma **classe concreta** é uma classe que pode ser instanciada diretamente.
- Uma **classe abstrata** serve como modelo para outras classes.
- Em TypeScript, usamos `abstract class` para criar classes abstratas.
- Classes abstratas **não podem ser instanciadas diretamente**.
- Uma classe abstrata pode ter atributos, construtor, métodos concretos e métodos abstratos.
- Um **método concreto** possui implementação.
- Um **método abstrato** possui apenas assinatura e deve ser implementado pelas subclasses concretas.
- Classes concretas que herdam de uma classe abstrata são obrigadas a implementar os métodos abstratos.
- O modificador `protected` é muito útil em herança, pois permite acesso na superclasse e nas subclasses.
- Use classe abstrata quando existir comportamento comum para reaproveitar e métodos obrigatórios para padronizar nas subclasses.
- Use interface quando quiser definir apenas um contrato de comportamento ou estrutura.
