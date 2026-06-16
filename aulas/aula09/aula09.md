# Aula — Threads na prática, com Orientação a Objetos (Java e TypeScript)

## Sumário

- **1** — Processo, thread, concorrência e paralelismo
- **2** — Relembrando orientação a objetos com a analogia da cozinha

---

# 1. Processo, thread, concorrência e paralelismo

Antes de qualquer linha de programação, precisamos de uma imagem mental. Vamos usar **uma cozinha de restaurante** durante toda a aula. Guarde bem esta cena, porque vamos voltar a ela o tempo todo.

## 1.1 Três palavras: programa, processo e thread

Imagine três coisas diferentes:

| Na cozinha | Na computação | O que é |
|---|---|---|
| A **receita** escrita no papel | **Programa** | Um conjunto de instruções *paradas*, guardadas. Ainda não está acontecendo nada. |
| A **cozinha aberta e funcionando** (com fogão ligado, ingredientes na bancada) | **Processo** | A receita *em execução*. Tem recursos próprios: memória, arquivos abertos, etc. |
| Um **cozinheiro** seguindo os passos da receita, um de cada vez | **Thread** | Uma *linha de execução* dentro do processo. É quem realmente "faz", passo a passo. |

A frase para levar para casa:

> **Programa** é a receita. **Processo** é a cozinha funcionando. **Thread** é o cozinheiro que executa os passos.

Um processo sempre tem **pelo menos uma** thread (sempre há pelo menos um cozinheiro). Essa primeira thread é a **thread principal** (a *main*).

## 1.2 Um cozinheiro só (programa sequencial)

Num programa simples, existe só um cozinheiro. Ele faz uma tarefa, depois a próxima, depois a próxima:

```text
Cozinheiro único:
  fritar hambúrguer 1  ->  fritar hambúrguer 2  ->  montar salada 1  ->  montar salada 2  ->  fim
```

Tudo em **fila**. Enquanto ele frita o hambúrguer, a salada espera. É simples e previsível — e é assim que quase todo programa começa.

## 1.3 Vários cozinheiros (programa com várias threads)

Agora imagine o restaurante lotado. Um cozinheiro só não dá conta. Contratamos mais:

```text
Cozinheiro A:  fritar hambúrgueres
Cozinheiro B:  montar saladas
Cozinheiro C:  preparar sobremesas
```

Os três trabalham **ao mesmo tempo**. O prato fica pronto muito mais rápido. Cada cozinheiro é **uma thread**. Criar uma thread é como **escalar mais um cozinheiro** para uma tarefa.

> **Por que isso importa de verdade?** Computadores modernos têm vários *núcleos* de processador — pense em cada núcleo como uma bancada de cozinha onde um cozinheiro pode trabalhar de verdade ao mesmo tempo que os outros. Se você usa um cozinheiro só, as outras bancadas ficam vazias e o cliente espera à toa.

## 1.4 Concorrência × paralelismo (a confusão clássica)

Estas duas palavras parecem sinônimos, mas não são. A cozinha resolve a confusão na hora:

**Concorrência = um cozinheiro revezando entre tarefas.**
Ele tem várias panelas no fogão. Mexe a panela 1, dá uma olhada na panela 2, volta pra 1, checa o forno... Ele *nunca* faz duas coisas no mesmo instante — ele **alterna rápido** entre elas. De longe, parece que tudo anda junto.

```text
Concorrência (1 cozinheiro, alternando):
tempo ->  [panela1] [panela2] [panela1] [forno] [panela2] [panela1] ...
```

**Paralelismo = vários cozinheiros, cada um na sua bancada.**
Agora são três pessoas, três bancadas. Elas realmente fazem coisas **no mesmo instante**.

```text
Paralelismo (3 cozinheiros, ao mesmo tempo):
tempo ->  A: [panela1][panela1][panela1]
          B: [panela2][panela2][panela2]
          C: [forno  ][forno  ][forno  ]
```

Resumo:

- **Concorrência** é sobre *organização*: dar a impressão (e a estrutura) de várias tarefas progredindo juntas, mesmo com um executor só.
- **Paralelismo** é sobre *execução simultânea de verdade*, com vários executores (núcleos).

Você pode ter concorrência sem paralelismo (1 cozinheiro alternando) e paralelismo é sempre também uma forma de concorrência (vários cozinheiros).

Guarde esta distinção: ela será **a chave** para entender por que Java e TypeScript fazem threads de formas tão diferentes.

---

# 2. Relembrando orientação a objetos (com a mesma cozinha)

Esta parte existe porque o conceito de thread **depende** de entender objeto, classe e interface. Vamos revisar bem devagar, sempre voltando à cozinha. Se a turma travar aqui, threads não vão fazer sentido depois.

## 2.1 Classe × objeto

- **Classe** = a **receita** (o molde, a planta). Descreve *como* algo é, mas não é a coisa em si. A receita do hambúrguer não se come.
- **Objeto** = o **prato pronto** feito a partir da receita. É a coisa concreta, que existe na bancada. De uma receita você faz **vários** pratos (vários objetos).

```text
Classe "Hamburguer" (a receita)
        |
        |  new Hamburguer()   <- faz um prato concreto
        v
Objeto: um hambúrguer específico na bancada
```

Em código, criar um objeto é o `new`: `new Hamburguer()` é "fazer um hambúrguer seguindo a receita".

## 2.2 Atributo × método

Todo objeto tem:

- **Atributos** = suas **características** (os dados). Ex.: o `nome` de um cozinheiro, a quantidade de pratos prontos.
- **Métodos** = suas **ações** (o que ele sabe fazer). Ex.: `cozinhar()`, `parar()`.

```text
Objeto "Cozinheiro Ana"
  atributos:  nome = "Ana"
  métodos:    cozinhar(),  parar()
```

## 2.3 Encapsulamento

Numa cozinha profissional, o cliente **não entra** para mexer nas panelas. Ele pede pelo balcão, e a cozinha decide como fazer. Isso é **encapsulamento**: os dados internos (`private`) ficam protegidos, e o mundo de fora só interage por métodos **públicos** (o balcão).

- `private nome` → ninguém de fora mexe direto.
- `public cozinhar()` → o balcão pelo qual se pede a ação.

Encapsular **reduz bagunça**: você muda o interior da cozinha sem quebrar quem pede no balcão.

## 2.4 Interface = um contrato

Esta é a peça que conecta tudo. Uma **interface** é um **contrato**: uma lista de obrigações que quem assina precisa cumprir, *sem dizer como*.

Imagine que o restaurante exige: **"todo funcionário da cozinha precisa saber `trabalhar()`"**. Esse é o contrato. Não importa se é cozinheiro, confeiteiro ou churrasqueiro — se ele assina o contrato, ele *promete* ter um método `trabalhar()`.

```text
Interface "Funcionario" (contrato)
   exige:  trabalhar()

Cozinheiro    assina Funcionario -> obrigado a ter trabalhar()
Confeiteiro   assina Funcionario -> obrigado a ter trabalhar()
```

A vantagem: o **gerente** pode dizer "funcionário, trabalhe!" para qualquer um que assinou o contrato, sem saber os detalhes de cada função. Ele confia no contrato.

## 2.5 A ponte para threads (leia com atenção)

Agora a ideia mais importante da aula inteira. Em Java, threads são feitas com **dois papéis separados**:

| Papel na cozinha | Em Java | É um... |
|---|---|---|
| **O que fazer** (a tarefa, a comanda) | `Runnable` | **contrato/interface**: exige o método `run()` |
| **Quem executa** (o cozinheiro) | `Thread` | **objeto** que pega uma tarefa e a executa |

Repare na beleza disso, que é **orientação a objetos pura**:

> A tarefa (`Runnable`) **não sabe** correr sozinha. O executor (`Thread`) **não sabe** o que fazer. Você junta os dois: entrega a tarefa ao cozinheiro e manda começar. **Separação de responsabilidades.**

- `Runnable` = a comanda escrita: "monte 5 saladas". Só descreve a tarefa.
- `Thread` = o cozinheiro contratado que vai *executar* aquela comanda numa linha de execução própria.


---