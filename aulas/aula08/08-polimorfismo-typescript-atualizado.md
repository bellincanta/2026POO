# Aula 08 — Polimorfismo em TypeScript

## 1. Conceito de polimorfismo

A palavra **polimorfismo** significa “muitas formas”.

Na Programação Orientada a Objetos, polimorfismo é a capacidade de diferentes objetos responderem de formas diferentes a uma mesma mensagem ou chamada de método.

Em outras palavras:

> Objetos diferentes podem ser tratados por um mesmo tipo base, mas executar comportamentos específicos de acordo com sua própria classe.

Exemplo conceitual:

- um `Cachorro` faz som latindo;
- um `Gato` faz som miando;
- uma `Vaca` faz som mugindo.

Todos são `Animal`, mas cada um executa o método `emitirSom()` de uma forma diferente.

---

## 2. Exemplo 01 — Polimorfismo com herança

### Arquivo


```ts
class Animal {
  protected nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }

  public emitirSom(): void {
    console.log(`${this.nome} emitiu um som.`);
  }
}

class Cachorro extends Animal {
  public emitirSom(): void {
    console.log(`${this.nome} latiu: Au au!`);
  }
}

class Gato extends Animal {
  public emitirSom(): void {
    console.log(`${this.nome} miou: Miau!`);
  }
}

class Vaca extends Animal {
  public emitirSom(): void {
    console.log(`${this.nome} mugiu: Muuuu!`);
  }
}

const animal1 = new Cachorro("Rex");
const animal2 = new Gato("Mimi");
const animal3 = new Vaca("Mimosa");

animal1.emitirSom();
animal2.emitirSom();
animal3.emitirSom();

export {};
```

### Explicação

Neste exemplo, todas as classes filhas herdam de `Animal`.

A classe `Animal` possui o método `emitirSom()`.

As classes `Cachorro`, `Gato` e `Vaca` sobrescrevem esse método, ou seja, cada uma cria sua própria versão de `emitirSom()`.

O mesmo método é chamado:

```ts
emitirSom()
```

Mas o resultado muda de acordo com o objeto.

Isso é polimorfismo.

---

## 3. Exemplo 02 — Lista com objetos polimórficos

No exemplo anterior, cada objeto foi chamado separadamente.

Agora vamos criar uma lista de animais.

### Arquivo

```ts
class AnimalPolimorfico {
  protected nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }

  public emitirSom(): void {
    console.log(`${this.nome} emitiu um som.`);
  }
}

class CachorroPolimorfico extends AnimalPolimorfico {
  public emitirSom(): void {
    console.log(`${this.nome} latiu: Au au!`);
  }
}

class GatoPolimorfico extends AnimalPolimorfico {
  public emitirSom(): void {
    console.log(`${this.nome} miou: Miau!`);
  }
}

class VacaPolimorfica extends AnimalPolimorfico {
  public emitirSom(): void {
    console.log(`${this.nome} mugiu: Muuuu!`);
  }
}

const animais: AnimalPolimorfico[] = [
  new CachorroPolimorfico("Rex"),
  new GatoPolimorfico("Mimi"),
  new VacaPolimorfica("Mimosa"),
];

for (const animal of animais) {
  animal.emitirSom();
}

export {};
```

### Explicação

Observe esta linha:

```ts
const animais: AnimalPolimorfico[] = [
```

A lista foi declarada como uma lista de `AnimalPolimorfico`.

Porém, dentro dela foram colocados objetos de classes diferentes:

```ts
new CachorroPolimorfico("Rex")
new GatoPolimorfico("Mimi")
new VacaPolimorfica("Mimosa")
```

Isso é possível porque todas essas classes herdam de `AnimalPolimorfico`.

Quando o laço executa:

```ts
animal.emitirSom();
```

O TypeScript identifica qual é o objeto real em tempo de execução e chama o método correspondente.

---

## 4. Exemplo 03 — Polimorfismo com classe abstrata

Classes abstratas são muito úteis para trabalhar com polimorfismo, pois permitem definir um método obrigatório para as classes filhas.

### Arquivo

```ts
abstract class FormaGeometrica {
  public abstract calcularArea(): number;

  public exibirArea(): void {
    console.log(`Área calculada: ${this.calcularArea()}`);
  }
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

class Retangulo extends FormaGeometrica {
  private largura: number;
  private altura: number;

  constructor(largura: number, altura: number) {
    super();
    this.largura = largura;
    this.altura = altura;
  }

  public calcularArea(): number {
    return this.largura * this.altura;
  }
}

class Circulo extends FormaGeometrica {
  private raio: number;

  constructor(raio: number) {
    super();
    this.raio = raio;
  }

  public calcularArea(): number {
    return Math.PI * this.raio * this.raio;
  }
}

const formas: FormaGeometrica[] = [
  new Quadrado(5),
  new Retangulo(4, 8),
  new Circulo(3),
];

for (const forma of formas) {
  forma.exibirArea();
}

export {};
```

### Explicação

A classe abstrata `FormaGeometrica` obriga todas as classes filhas a implementarem o método:

```ts
calcularArea()
```

Cada forma geométrica calcula sua área de uma forma diferente:

- `Quadrado`: lado × lado;
- `Retangulo`: largura × altura;
- `Circulo`: π × raio².

Mesmo assim, todas podem ser armazenadas em uma lista do tipo:

```ts
FormaGeometrica[]
```

Isso permite tratar todas as formas de maneira comum.

---

## 5. Exemplo 04 — Polimorfismo com interfaces

Além de classes abstratas, também podemos usar interfaces para aplicar polimorfismo.

Uma interface define um contrato.

Ou seja, ela informa quais métodos uma classe deve possuir.

### Arquivo


```ts
interface Pagavel {
  calcularPagamento(): number;
}

class FuncionarioCLT implements Pagavel {
  private salarioMensal: number;

  constructor(salarioMensal: number) {
    this.salarioMensal = salarioMensal;
  }

  public calcularPagamento(): number {
    return this.salarioMensal;
  }
}

class FuncionarioHorista implements Pagavel {
  private valorHora: number;
  private horasTrabalhadas: number;

  constructor(valorHora: number, horasTrabalhadas: number) {
    this.valorHora = valorHora;
    this.horasTrabalhadas = horasTrabalhadas;
  }

  public calcularPagamento(): number {
    return this.valorHora * this.horasTrabalhadas;
  }
}

class Estagiario implements Pagavel {
  private bolsa: number;

  constructor(bolsa: number) {
    this.bolsa = bolsa;
  }

  public calcularPagamento(): number {
    return this.bolsa;
  }
}

const pagamentos: Pagavel[] = [
  new FuncionarioCLT(3000),
  new FuncionarioHorista(50, 80),
  new Estagiario(1200),
];

for (const pessoa of pagamentos) {
  console.log(`Pagamento: R$ ${pessoa.calcularPagamento().toFixed(2)}`);
}

export {};
```

### Explicação

A interface `Pagavel` exige que toda classe tenha o método:

```ts
calcularPagamento()
```

As classes `FuncionarioCLT`, `FuncionarioHorista` e `Estagiario` implementam esse método de formas diferentes.

Mesmo sendo classes diferentes, todas podem ser tratadas como `Pagavel`.

---

## 6. Exemplo 05 — Polimorfismo em um sistema simples

Agora vamos aplicar o conceito em um exemplo mais próximo de um sistema.

Imagine um sistema de vendas que possui diferentes formas de pagamento.

### Arquivo


```ts
abstract class FormaPagamento {
  protected valor: number;

  constructor(valor: number) {
    this.valor = valor;
  }

  public abstract pagar(): void;
}

class PagamentoPix extends FormaPagamento {
  public pagar(): void {
    console.log(`Pagamento via PIX no valor de R$ ${this.valor.toFixed(2)} realizado com sucesso.`);
  }
}

class PagamentoCartaoCredito extends FormaPagamento {
  private parcelas: number;

  constructor(valor: number, parcelas: number) {
    super(valor);
    this.parcelas = parcelas;
  }

  public pagar(): void {
    console.log(
      `Pagamento no cartão de crédito em ${this.parcelas}x de R$ ${(this.valor / this.parcelas).toFixed(2)}.`
    );
  }
}

class PagamentoBoleto extends FormaPagamento {
  public pagar(): void {
    console.log(`Boleto gerado no valor de R$ ${this.valor.toFixed(2)}.`);
  }
}

const formasPagamento: FormaPagamento[] = [
  new PagamentoPix(150),
  new PagamentoCartaoCredito(600, 3),
  new PagamentoBoleto(220),
];

for (const pagamento of formasPagamento) {
  pagamento.pagar();
}

export {};
```

### Explicação

Todas as formas de pagamento herdam de `FormaPagamento`.

Cada uma implementa o método `pagar()` de forma específica.

O sistema não precisa saber exatamente se o pagamento é PIX, cartão ou boleto.

Ele apenas chama:

```ts
pagamento.pagar();
```

O comportamento correto será executado automaticamente.

---


## 7. Exemplo 06 — Estudo de caso: empréstimos com polimorfismo

Neste exemplo, vamos analisar um pequeno sistema de empréstimos.

A ideia principal é mostrar que um vetor do tipo `Emprestimo[]` pode armazenar tanto objetos da classe `Emprestimo` quanto objetos da classe `EmprestimoTA`.

Isso acontece porque `EmprestimoTA` herda de `Emprestimo`.

Além disso, cada objeto muda seu próprio estado interno ao longo da execução, pois o método `proximaParcela()` altera os atributos internos do objeto.

---

### Estrutura dos arquivos

```txt
Emprestimo/
├── Emprestimo.ts
├── EmprestimoTA.ts
├── ConjuntoEmprestimos.ts
├── ConjuntoEmprestimosPoli.ts
└── tsconfig.json
```

---

### Arquivo

`Emprestimo.ts`

```ts
export class Emprestimo {
  private n: number;
  private j: number;
  private corrente: number;
  private p: number;

  constructor(s: number, n: number, j: number) {
    this.n = n;
    this.j = j;
    this.corrente = 1;
    this.p = s;
  }

  public proximaParcela(): number {
    let retorno = this.p;
    this.corrente++;
    if (this.corrente <= this.n) {
      this.p = this.p + (this.p * (this.j / 100));
    } else {
      this.p = 0;
    }
    return retorno;
  }
}
```

### Explicação da classe `Emprestimo`

A classe `Emprestimo` representa um empréstimo comum.

Ela possui os seguintes atributos:

| Atributo | Função |
|---|---|
| `n` | quantidade de parcelas |
| `j` | taxa de juros |
| `corrente` | controla qual parcela está sendo processada |
| `p` | valor da próxima parcela |

O método principal é:

```ts
public proximaParcela(): number
```

Esse método retorna o valor da parcela atual e altera o estado interno do objeto para preparar a próxima parcela.

Portanto, o mesmo objeto `Emprestimo` muda de estado a cada chamada do método `proximaParcela()`.

---

### Arquivo

`EmprestimoTA.ts`

```ts
import { Emprestimo } from './Emprestimo';

export class EmprestimoTA extends Emprestimo {
  private ta: number;

  constructor(s: number, n: number, j: number, ta: number) {
    super(s, n, j);
    this.ta = ta;
  }

  public getTa(): number {
    return this.ta;
  }

  public proximaParcela(): number {
    let pp = super.proximaParcela();
    if (pp > 0) {
      pp += this.ta;
    }
    return pp;
  }
}
```

### Explicação da classe `EmprestimoTA`

A classe `EmprestimoTA` herda de `Emprestimo`.

```ts
export class EmprestimoTA extends Emprestimo
```

Isso significa que `EmprestimoTA` reaproveita os atributos e comportamentos da classe `Emprestimo`.

No entanto, ela sobrescreve o método:

```ts
public proximaParcela(): number
```

Dentro desse método, primeiro é chamado o comportamento original da classe pai:

```ts
let pp = super.proximaParcela();
```

Depois, caso exista uma parcela válida, é acrescentada uma taxa adicional:

```ts
pp += this.ta;
```

Aqui temos polimorfismo, pois o mesmo método `proximaParcela()` possui comportamentos diferentes em `Emprestimo` e em `EmprestimoTA`.

---

### Arquivo

`ConjuntoEmprestimos.ts`

```ts
import { Emprestimo } from './Emprestimo';
import { EmprestimoTA } from './EmprestimoTA';

export class ConjuntoEmprestimos {
  private vEmprestimos: Emprestimo[];
  private corrente: number = -1;

  constructor(quantidade: number) {
    this.vEmprestimos = new Array<Emprestimo>(quantidade);
  }

  public adicionaEmprestimo(emp: Emprestimo): boolean {
    let resultado = false;
    if (this.corrente + 1 < this.vEmprestimos.length) {
      this.corrente++;
      this.vEmprestimos[this.corrente] = emp;
      resultado = true;
    }
    return resultado;
  }

  public proximasParcelas(): boolean {
    let status = false;
    for (let e = 0; e < this.vEmprestimos.length; e++) {
      const p = this.vEmprestimos[e].proximaParcela();
      if (p > 0) {
        status = true;
        const tipo = this.vEmprestimos[e] instanceof EmprestimoTA ? 'EmprestimoTA' : 'Emprestimo';
        console.log(`${tipo} ${e + 1}: ${p}`);
      }
    }
    return status;
  }
}
```

### Explicação da classe `ConjuntoEmprestimos`

Esta classe armazena vários empréstimos em um vetor:

```ts
private vEmprestimos: Emprestimo[];
```

Mesmo o vetor sendo do tipo `Emprestimo[]`, ele poderá receber objetos da classe `EmprestimoTA`, porque `EmprestimoTA` é filha de `Emprestimo`.

O método abaixo recebe qualquer objeto que seja do tipo `Emprestimo` ou de uma classe filha de `Emprestimo`:

```ts
public adicionaEmprestimo(emp: Emprestimo): boolean
```

Este é um dos pontos mais importantes do polimorfismo.

O programa não precisa criar dois vetores diferentes, um para `Emprestimo` e outro para `EmprestimoTA`.

Ele trata todos como `Emprestimo`.

---

### Arquivo

`ConjuntoEmprestimosPoli.ts`

```ts
import { ConjuntoEmprestimos } from './ConjuntoEmprestimos';
import { Emprestimo } from './Emprestimo';
import { EmprestimoTA } from './EmprestimoTA';

class ConjuntoEmprestimosPoli {
  public static main(): void {
    const ce = new ConjuntoEmprestimos(5);

    ce.adicionaEmprestimo(new Emprestimo(200, 3, 1));
    ce.adicionaEmprestimo(new EmprestimoTA(500, 4, 2, 15));
    ce.adicionaEmprestimo(new Emprestimo(300, 2, 1));
    ce.adicionaEmprestimo(new Emprestimo(450, 3, 2));
    ce.adicionaEmprestimo(new EmprestimoTA(700, 2, 3, 10));

    let status: boolean;
    do {
      status = ce.proximasParcelas();
    } while (status);
  }
}

// Executa o programa
ConjuntoEmprestimosPoli.main();
```

### Explicação do programa principal

Neste trecho, é criado um conjunto com capacidade para cinco empréstimos:

```ts
const ce = new ConjuntoEmprestimos(5);
```

Depois são adicionados objetos de duas classes diferentes:

```ts
new Emprestimo(200, 3, 1)
new EmprestimoTA(500, 4, 2, 15)
```

A classe `ConjuntoEmprestimos` recebe todos eles como `Emprestimo`.

Quando o método `proximasParcelas()` é chamado, cada objeto executa sua própria versão de `proximaParcela()`.

Se o objeto for um `Emprestimo`, executa o cálculo comum.

Se o objeto for um `EmprestimoTA`, executa o cálculo com taxa adicional.

---

### Onde aparece a herança?

A herança aparece nesta linha:

```ts
export class EmprestimoTA extends Emprestimo
```

Isso indica que `EmprestimoTA` é uma especialização de `Emprestimo`.

---

### Onde aparece o polimorfismo?

O polimorfismo aparece principalmente em três pontos.

Primeiro, no vetor:

```ts
private vEmprestimos: Emprestimo[];
```

Esse vetor pode armazenar objetos `Emprestimo` e `EmprestimoTA`.

Segundo, no método:

```ts
public adicionaEmprestimo(emp: Emprestimo): boolean
```

Ele recebe objetos da classe base ou de suas subclasses.

Terceiro, na chamada:

```ts
const p = this.vEmprestimos[e].proximaParcela();
```

O mesmo método é chamado para todos os objetos, mas o comportamento muda dependendo da classe real do objeto.

---

### Onde aparece a mudança de estado do objeto?

A mudança de estado aparece dentro da classe `Emprestimo`.

Observe:

```ts
this.corrente++;
```

e:

```ts
this.p = this.p + (this.p * (this.j / 100));
```

Cada vez que `proximaParcela()` é chamado, o próprio objeto atualiza seus atributos internos.

Assim, o objeto não fica sempre igual.

Ele guarda sua situação atual e muda conforme o programa é executado.

---

### Resumo do estudo de caso

Neste exemplo, temos:

| Conceito | Onde aparece |
|---|---|
| Classe | `Emprestimo`, `EmprestimoTA`, `ConjuntoEmprestimos` |
| Objeto | `new Emprestimo(...)`, `new EmprestimoTA(...)` |
| Encapsulamento | atributos `private` |
| Herança | `EmprestimoTA extends Emprestimo` |
| Sobrescrita | método `proximaParcela()` em `EmprestimoTA` |
| Polimorfismo | vetor `Emprestimo[]` armazenando objetos diferentes |
| Mudança de estado | atualização de `corrente` e `p` |

---

## 8. Diferença entre herança e polimorfismo

Herança e polimorfismo são conceitos relacionados, mas não são a mesma coisa.

| Conceito | Explicação |
|---|---|
| Herança | Permite que uma classe filha reaproveite atributos e métodos de uma classe pai. |
| Polimorfismo | Permite que objetos diferentes sejam tratados pelo mesmo tipo base, executando comportamentos diferentes. |

Exemplo:

```ts
class Animal {
  public emitirSom(): void {
    console.log("Som genérico");
  }
}

class Cachorro extends Animal {
  public emitirSom(): void {
    console.log("Au au");
  }
}
```

A relação `Cachorro extends Animal` representa herança.

A chamada `emitirSom()` com comportamento diferente representa polimorfismo.

---


## 9. Observação importante sobre nomes duplicados

Como o TypeScript pode acusar erro de identificador duplicado quando várias classes possuem o mesmo nome em arquivos diferentes, cada arquivo desta aula termina com:

```ts
export {};
```

Esse comando faz com que o arquivo seja tratado como um módulo, evitando conflito global de nomes.

Outra alternativa é usar nomes diferentes para as classes em cada exemplo, como foi feito em alguns arquivos desta aula.

---

## 12. Síntese da aula

Nesta aula, estudamos o conceito de polimorfismo.

Vimos que polimorfismo permite que objetos diferentes sejam tratados por um mesmo tipo base.

Também vimos que o mesmo método pode ter comportamentos diferentes dependendo da classe do objeto.

Esse conceito é muito importante para criar sistemas mais flexíveis, organizados e fáceis de manter.

Em TypeScript, podemos aplicar polimorfismo usando:

- herança;
- sobrescrita de métodos;
- classes abstratas;
- interfaces;
- listas com tipos base.

---
