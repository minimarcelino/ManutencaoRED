[**🏠Retornar ao Início**](./../../README.md)

# DOCUMENTAÇÃO DO SISTEMA

# SUMÁRIO
- [DOCUMENTAÇÃO DO SISTEMA](#documentação-do-sistema)
- [SUMÁRIO](#sumário)
- [1. ESCOPO DO SISTEMA](#1-escopo-do-sistema)
- [2. HISTÓRIAS DE USUÁRIO](#2-histórias-de-usuário)
  - [História de usuário 1](#história-de-usuário-1)
  - [História de usuário 2](#história-de-usuário-2)
  - [História de Usuário 3](#história-de-usuário-3)
  - [História de Usuário 4](#história-de-usuário-4)
  - [História de Usuário 5](#história-de-usuário-5)
  - [História de Usuário 6](#história-de-usuário-6)
  - [História de Usuário 7](#história-de-usuário-7)
  - [História de Usuário 8](#história-de-usuário-8)
  - [História de Usuário 9](#história-de-usuário-9)
  - [História de Usuário 10](#história-de-usuário-10)
  - [História de Usuário 11](#história-de-usuário-11)
  - [História de Usuário 12](#história-de-usuário-12)
  - [História de Usuário 13](#história-de-usuário-13)
  - [História de Usuário 14](#história-de-usuário-14)
  - [História de Usuário 15](#história-de-usuário-15)
  - [História de Usuário 16](#história-de-usuário-16)
- [3. REQUISITOS NÃO FUNCIONAIS](#3-requisitos-não-funcionais)
- [4. ARQUITETURA DE IMPLANTAÇÃO DO SISTEMA](#4-arquitetura-de-implantação-do-sistema)
- [5. ARQUITETURA LÓGICA DO SISTEMA](#5-arquitetura-lógica-do-sistema)
- [6. DIAGRAMA DE CLASSES](#6-diagrama-de-classes)
- [7. MODELO LÓGICO DO BANCO DE DADOS](#7-modelo-lógico-do-banco-de-dados)
- [Anexo 1 - PROTÓTIPO](#anexo-1---protótipo)

# 1. ESCOPO DO SISTEMA

O Sistema de Gerenciamento do Regime de Exercícios Domiciliares (GRED) tem como objetivo primordial automatizar e organizar os processos relacionados à concessão, acompanhamento e registro do regime de exercícios domiciliares para os estudantes, conforme as diretrizes do Regime de Exercícios Domiciliares constituída no Decreto-lei n° 1.044/1969. O GRED proporcionará maior eficiência, transparência e agilidade na administração deste regime, beneficiando tanto os estudantes quanto a instituição de ensino.

No nível de acesso CRA, estão disponíveis a criação do processo de RED (Regime de Exercícios Domiciliares) do aluno, a manutenção de dados dos alunos e o envio do e-mail para coordenador alertando sobre a criação do processo, além de receber o relatório final do processo com os abonos de falta.

No nível de acesso CSP, estão disponíveis a visualização do processo, associação da(s) disciplina(s) ao(s) ao processo RED do aluno, a manutenção dos cursos, manutenção e importação das disciplinas, a manutenção de servidores e importação dos dados dos docentes, e a geração de um relatório das faltas que serão abonadas, facilitando alimentar e acompanhar o processo da melhor forma possível. Não é permitido fazer alterações nos Planos Especiais de Estudos, somente associar a(s) disciplina(s) ao(s) aluno(s) e gerar um relatório das faltas que serão abonadas.

Para o nível de acesso do professor, estão disponíveis funcionalidades para visualização de todos os PEEs no qual é responsável, preenchimento dos PEE com as atividades a serem desenvolvidas e o envio do PEE por e-mail para o aluno, após receber as atividades desenvolvidas pelo aluno, o docente poderá indicar a porcentagem de faltas a serem abonadas de acordo com o PEE e finalizar o PEE. Após a avaliação haverá o envio de e-mail para o coordenador.

No nível de acesso do coordenador, estão as funcionalidades  de manutenção e importação das disciplinas, a manutenção de servidores e importação dos dados dos docentes, a indicação do(s) professor(es) de cada uma das disciplinas relacionadas ao RED do alunos, visualizar todos os processos RED relacionados ao seu curso, envio de e-mail(s) para o(s) professor(es) sobre a necessidade de preenchimento dos PEEs, visualização da situação do processo RED do aluno e seus respectivos PEEs,, incluindo prazos de entrega e outras informações relevantes. Após a criação do RED, o coordenador é notificado e pode confirmar ou rejeitar o processo aberto pela CRA, caso confirmado o servidor da CSP é avisado por e-mail para dar prosseguimento ao processo.


# 2. HISTÓRIAS DE USUÁRIO

## História de usuário 1

|                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Como CRA, eu quero criar o processo de RED para um aluno, para garantir que o estudante tenha o devido acompanhamento durante seu período de afastamento.      |
|                                                                                                                                                                |
| Como CRA, eu quero criar o processo de RED para um aluno, para garantir que o estudante tenha o devido acompanhamento durante seu período de afastamento.      |
|                                                                                                                                                                |
| **Detalhes adicionais:** A criação correta do processo de RED é crucial para assegurar que o aluno tenha o suporte adequado durante seu afastamento acadêmico. |
|                                                                                                                                                                |
| **Critérios de aceitação:**<br>O sistema deve permitir à CRA criar um novo processo de RED para um aluno, com informações detalhadas sobre o início do afastamento e a duração prevista. <br>●	A CRA deve poder registrar informações adicionais relevantes, como o motivo do afastamento e outras observações necessárias para o processo. <br>●	A CRA poderá indicar um aluno já existente ou cadastrar um novo aluno durante a criação do processo. <br>●	O sistema deve enviar um e-mail ao coordenador para que o mesmo possa ser alertado da criação do processo de RED do aluno. |
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve a criação de um processo específico para cada aluno, exigindo uma interface bem elaborada.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para projeto, implementação e testes da funcionalidade, considerando a interação com disciplinas e informações detalhadas do processo de RED.|
||

## História de usuário 2  

|      |
|---|
|Como CSP, eu quero poder visualizar o processo de RED de um aluno, para compreender e acompanhar o plano de estudos do estudante durante seu período de afastamento.|
||
|**Detalhes adicionais:** A visualização correta do processo de RED é essencial para que o CSP possa fornecer suporte eficaz ao aluno durante o período de afastamento.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir à CSP visualizar os detalhes do processo de RED de um aluno específico.<br>●	A visualização deve incluir informações sobre as disciplinas associadas ao processo de RED, o início do afastamento, a duração prevista e outros dados relevantes.<br>●	Deve ser possível acessar informações detalhadas sobre as disciplinas incluídas no plano de estudos durante o período de RED.<br>●	A interface de visualização deve ser intuitiva e de fácil compreensão.|
||
|**Nível de complexidade e justificativa:** Média. A funcionalidade envolve principalmente a apresentação de informações já registradas no sistema, sem a necessidade de interações complexas.|
||
|**Estimativa de tempo:** Aproximadamente 6 horas para implementação da funcionalidade de visualização do processo de RED, incluindo a integração com as disciplinas associadas.|
 
## História de Usuário 3

|     |
| --- |
|Como servidor da CRA, eu quero poder gerar e visualizar o relatório de abono de faltas de um dos processos RED finalizados.|
||
|**Detalhes adicionais:** O relatório do(s) abono(s) da(s) falta(s) é fundamental para manter um registro organizado e preciso da(s) falta(s) do(s) aluno(s) que foram justificadas e aprovadas.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir à CRA gerar um relatório contendo as faltas abonadas de um processo RED de um aluno específico.<br>●	O relatório deve incluir detalhes sobre as faltas abonadas.<br>●	Deve ser possível pesquisar os processos RED pelo nome do aluno.<br>●	O relatório deve ser apresentado de forma clara e de fácil compreensão.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve a criação de um relatório organizado e informativo a partir das faltas abonadas.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para projeto, implementação e testes da funcionalidade, incluindo a elaboração do relatório.|
 
## História de Usuário 4

|     |
| --- |
|Como CSP, eu quero poder associar as disciplinas ao processo RED aberto para um aluno, para garantir que as disciplinas sejam atribuídas corretamente ao processo.|
||
|**Detalhes adicionais:** A associação eficiente das disciplinas a cada aluno é fundamental para que os docentes possam oferecer planos especiais de estudos ao aluno.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir à CSP associar uma ou mais disciplinas a um processo de um aluno específico.<br>●	Deve ser possível associar disciplinas para cada período letivo, respeitando a grade curricular do aluno.<br>●	A associação deve incluir detalhes relevantes sobre cada disciplina, como código, nome e carga horária.<br>●	O CSP deve ter a capacidade de revisar e modificar a associação de disciplinas até o momento de enviar o processo ao coordenador.<br>●	O sistema deve enviar um e-mail ao coordenador para que o mesmo possa ser alertado da associação das disciplinas ao processo de RED e continuidade ao RED|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve a manipulação e gerenciamento das associações entre disciplinas e alunos, exigindo uma interface bem projetada.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para implementar a funcionalidade de associação de disciplinas, incluindo a interface e as interações necessárias.|
 
## História de Usuário 5

|     |
| --- |
|Como Coordenador, eu quero associar o(s) professor(es) à(s) disciplina(s) de cada aluno, solicitando a elaboração do plano RED, para garantir a continuidade dos estudos do aluno durante o período de afastamento.|
||
|**Detalhes adicionais:** A correta associação do(s) professor(es) e a elaboração do plano RED são cruciais para manter o progresso acadêmico do aluno durante seu afastamento.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir que o coordenador associe um professor a cada disciplina de um aluno.<br>●	Após a associação, o sistema deve enviar uma notificação ao professor solicitando a elaboração do PEE para a respectiva disciplina.<br>●	Deve ser possível visualizar o status das solicitações de elaboração do PEE para cada disciplina.<br>●	O sistema deve enviar um e-mail para o professor para que o mesmo possa ser alertado do plano RED do aluno.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve interações com diferentes usuários (coordenador e professor) e a sincronização eficaz das informações para garantir a continuidade dos estudos do aluno.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para projeto, implementação e testes da funcionalidade, considerando a interação com notificações e o gerenciamento das associações.|
 
## História de Usuário 6

|     |
| --- |
|Como Coordenador, eu quero visualizar a situação do plano RED de cada aluno, apresentando detalhes de cada disciplina, prazos de entrega, etc., para acompanhar o progresso e garantir o cumprimento dos planos estabelecidos.|
||
|**Detalhes adicionais:** O acompanhamento detalhado do plano RED é crucial para garantir que os alunos estejam cumprindo os prazos e seguindo o plano de estudos definido durante o período de afastamento.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir ao coordenador acessar uma visão consolidada de todos os alunos com seus respectivos planos RED.<br>●	A visão deve apresentar detalhes de cada disciplina, incluindo prazos de entrega das atividades.<br>●	O sistema deve permitir que o coordenador visualize o status de cada plano RED (atendido ou não) para cada disciplina.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve a apresentação de informações consolidadas de múltiplos alunos e suas disciplinas, exigindo uma interface bem projetada e interações eficientes.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para projetar e implementar a interface de visualização do plano RED, incluindo os detalhes de cada disciplina e os prazos de entrega.|
 
## História de Usuário 7

|     |
| --- |
|Como CSP, eu quero ser capaz de manter as disciplinas e importar informações do Sistema Unificado de Administração Pública (SUAP), para garantir a integração e atualização correta das disciplinas no sistema.|
||
|**Detalhes adicionais:** A integração com o SUAP é essencial para manter as informações das disciplinas atualizadas, garantindo precisão e consistência no sistema.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir à CSP adicionar, editar e remover disciplinas de forma fácil e intuitiva.<br>●	Deve existir a funcionalidade de importar automaticamente as informações das disciplinas do SUAP para o sistema local.<br>●	A importação deve incluir detalhes relevantes das disciplinas, como nome, código, carga horária, entre outros.<br>●	As informações importadas devem ser atualizadas regularmente para manter a integridade dos dados.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve a integração com um sistema externo (SUAP) e a manipulação eficiente das disciplinas no sistema local.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para implementação, incluindo o desenvolvimento da funcionalidade de manutenção das disciplinas e a integração com o SUAP.|
 
## História de Usuário 8

|     |
| --- |
|Como Professor, eu quero gerenciar o Plano Especial de Estudos dos alunos, podendo preencher as informações e finalizar o plano após conferência, enviando um e-mail para garantir que o aluno receba um plano adequado para o período de afastamento.|
||
|**Detalhes adicionais:** O plano PEE é fundamental para garantir que o aluno possa continuar seus estudos de maneira adequada durante o período de afastamento, atendendo suas necessidades de saúde.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir ao professor acessar e visualizar os planos PEE associados aos seus alunos.<br>●	O professor deve ser capaz de preencher um plano PEE para um aluno e após finalizar o preenchimento enviar um e-mail para o aluno com as informações necessárias para o desenvolvimento do plano.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve interações com planos específicos de cada aluno e requer a capacidade de criação, edição e finalização desses planos, além do envio do e-mail para o aluno alertando sobre a finalização do RED.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para projeto, implementação e testes da funcionalidade, considerando a interação com os planos PEE e a interface do professor.|
 
## História de Usuário 9

|     |
| --- |
|Como Professor, após receber as tarefas desenvolvidas pelo aluno de acordo com o especificado no plano, eu quero avaliar o plano PEE do aluno, indicando o percentual de faltas a serem abonadas pelo aluno e finalizando o plano especial de estudos.|
||
|**Detalhes adicionais:** Avaliar adequadamente as atividades propostas no PEE para assegurar que o aluno tenha as faltas abonadas, garantindo que o plano esteja alinhado com os objetivos acadêmicos e seja eficaz para o aluno durante seu período de afastamento.|
||
|**Critérios de aceitação:** <br>●	O sistema deve permitir ao professor acessar os planos PEE associados a cada aluno que esteja sob sua supervisão.<br>●	O professor deve ser capaz de avaliar cada plano PEE, indicando o percentual de abono das faltas de acordo com as atividades realizadas pelo aluno.<br>●	Ao avaliar um plano PEE, o sistema deve enviar um e-mail ao coordenador informando a conclusão do PEE.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve interações com planos específicos de cada aluno, exigindo uma interface clara para a avaliação, além da utilização do envio de um e-mail para o coordenador.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para implementar a funcionalidade, incluindo a integração de notificações e a interface de avaliação.|
 
## História de Usuário 10

|     |
| --- |
|Como CRA, quero manter os dados dos alunos, para garantir a atualização correta dos alunos no sistema.|
||
|**Detalhes adicionais:** Manter os dados dos alunos é essencial para fornecer informações atualizadas e precisas, facilitando a administração acadêmica e garantindo que os registros estejam sempre corretos.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir à CRA adicionar um novo aluno, inserindo informações essenciais.<br>●	O CRA deve poder atualizar os dados de um aluno já registrado no sistema, para refletir mudanças em suas informações acadêmicas ou pessoais.<br>●	Deve ser possível visualizar os detalhes de um aluno, incluindo todas as informações relevantes registradas.<br>●	O sistema deve oferecer a funcionalidade de desativar ou remover um aluno, caso ele não esteja mais associado à instituição.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve a criação, atualização e visualização de registros de alunos, exigindo uma interface bem elaborada.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para projeto, implementação e testes da funcionalidade, incluindo a interface de manutenção de dados de alunos.|
 
## História de Usuário 11

|     |
| --- |
|Como CSP, quero manter os dados dos cursos, para garantir a atualização correta dos cursos no sistema.|
||
|**Detalhes adicionais:** O objetivo de manter os dados dos cursos é garantir que todas as informações sobre os cursos estejam atualizadas e corretas no sistema.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir à CSP ser capaz de visualizar e editar todos os dados dos cursos.<br>●	 O sistema deve permitir à CSP ser capaz de criar novos cursos e excluir cursos existentes.|
||
|**Nível de complexidade e justificativa:** Médio. Ela requer a criação de uma interface de usuário para que a CSP possa visualizar e editar os dados dos cursos, além de armazenar e gerenciar esses dados.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para implementar a funcionalidade, incluindo a integração de notificações e a interface de avaliação.|
 
## História de Usuário 12

|     |
| --- |
|Como CSP, quero fazer manter dados dos servidores e importar as informações dos docentes, para garantir a integração e atualização correta dos docentes no sistema.|
||
|**Detalhes adicionais:** Manter dados atualizados e precisos dos docentes é fundamental para garantir a eficiência da gestão acadêmica e a correta atribuição de disciplinas.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir à CSP adicionar um novo docente, inserindo informações essenciais.<br>●	O CSP deve poder atualizar os dados de um docente já registrado no sistema, para refletir mudanças em suas informações acadêmicas ou pessoais.<br>●	Deve ser possível importar automaticamente as informações dos docentes de um sistema externo.<br>●	A importação deve incluir detalhes relevantes sobre cada docente, como áreas de especialização, disciplinas que leciona, entre outros.<br>●	O sistema deve oferecer a funcionalidade de desativar ou remover um docente, caso ele não esteja mais associado à instituição.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve a criação, atualização e integração de registros dos docentes, exigindo uma interface bem elaborada.|
||
|**Estimativa de tempo:** Aproximadamente 10 horas para projeto, implementação e testes da funcionalidade, incluindo a interface de manutenção de dados dos docentes e a integração para importação de informações.|
 
## História de Usuário 13

|     |
| --- |
|Como CSP, quero gerar um relatório de faltas que serão ou não abonadas, para garantir o acompanhamento da frequência do aluno.|
||
|**Detalhes adicionais:** Um relatório de faltas é essencial para que a CRA possa visualizar quais atividades o aluno desenvolveu, bem como considerar quais atividades serão utilizadas para abonar as faltas.|
||
|**Critérios de aceitação:**<br>●	O relatório deve conter todas as informações solicitadas.<br>●	O relatório deve ser gerado com base nos dados das atividades feitas do aluno.<br>●	O CSP deve ter acesso ao relatório.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve a criação de um relatório organizado e informativo a partir das faltas abonadas.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para a elaboração do relatório.|
 
## História de Usuário 14

|     |
| --- |
|Como Coordenador, eu quero visualizar todos os PEE relacionados a cada curso, apresentando detalhes dos alunos, para acompanhar o progresso e garantir o cumprimento dos planos estabelecidos.|
||
|**Detalhes adicionais:** Ter uma visão consolidada dos PEE relacionados a cada curso é crucial para o coordenador garantir que os planos de dispensa estejam sendo seguidos de acordo com as normas e necessidades acadêmicas.|
||
|**Critérios de aceitação:**<br>●	O sistema deve permitir ao coordenador visualizar uma lista de todos os PEE relacionados a um curso específico.<br>●	A lista deve incluir detalhes sobre cada aluno com PEE ativo, como nome, disciplinas envolvidas, prazos e status.<br>●	Deve ser possível acessar informações mais detalhadas de cada plano PEE, incluindo o plano de estudo.<br>●	O sistema deve fornecer opções de filtragem para facilitar a visualização dos planos PEE por curso, período ou outro critério relevante.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve apresentar informações de diferentes entidades (alunos, RED, cursos) de forma organizada e eficaz.|
||
|**Estimativa de tempo:** Aproximadamente 8 horas para implementação da funcionalidade.|
 
## História de Usuário 15

|     |
| --- |
|Como Coordenador, eu quero ser notificado e poder confirmar ou rejeitar o processo aberto pela CRA, para monitorar o progresso e garantir que o plano esteja de acordo.|
||
|**Detalhes adicionais:** É fundamental o coordenador ser notificado para que assim ele esteja por dentro de todos os processos que forem abertos.|
||
|**Critérios de aceitação:**<br>●	O coordenador deve ser notificado por e-mail sempre que um processo for aberto pela CRA.<br>●	O coordenador deve poder confirmar ou rejeitar o processo.<br>●	O coordenador deve poder monitorar o progresso do processo.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve notificar o coordenador e permitir confirmar ou rejeitar o processo aberto pela CRA para garantir que o processo esteja de acordo com os requisitos do negócio.|
||
|**Estimativa de tempo:** Aproximadamente 6 horas para implementação da funcionalidade.|

## História de Usuário 16

|     |
| --- |
|Como Coordenador, eu quero manter dados dos docentes e importar suas informações, para garantir a integração e atualização dos docentes no sistema.|
||
|**Detalhes adicionais:** Manter os dados dos docentes atualizados e precisos é fundamental para garantir a eficiência da gestão acadêmica e a correta atribuição de disciplinas.|
||
|**Critérios de aceitação:**<br>● O sistema deve permitir ao Coordenador adicionar um novo docente, inserindo informações essenciais como nome, matrícula, área de atuação, entre outros.<br>● O Coordenador deve poder atualizar os dados de um docente já registrado no sistema, para refletir mudanças em suas informações acadêmicas ou pessoais.<br>● Deve ser possível importar automaticamente as informações dos docentes de um sistema externo.<br>● A importação deve incluir detalhes relevantes sobre cada docente, como áreas de especialização, disciplinas que leciona, entre outros.<br>● O sistema deve oferecer a funcionalidade de desativar ou remover um docente, caso ele não esteja mais associado à instituição.|
||
|**Nível de complexidade e justificativa:** Médio. A funcionalidade envolve a criação, atualização e integração de registros dos docentes, exigindo uma interface bem elaborada.|
||
|**Estimativa de tempo:** Aproximadamente 10 horas para projeto, implementação e testes da funcionalidade, incluindo a interface de manutenção de dados dos docentes e a integração para importação de informações.|


# 3. REQUISITOS NÃO FUNCIONAIS

**Tecnologias propostas**
- Linguagens de programação: **Angular com Typescript**.
- Banco de dados relacional para armazenar dados: **MySQL**.
  - Sistema Operacional utilizado para implementação: **Linux**.
- Servidor web (**Nginx**) para gerenciar solicitações e respostas.
- Ferramentas de envio de E-mail, como **nodemailer**.

# 4. ARQUITETURA DE IMPLANTAÇÃO DO SISTEMA

![Arquitetura-Implantacao](./Arquivos/Imagens/Arquitetura%20de%20Implantação%20do%20Sistema.png)

# 5. ARQUITETURA LÓGICA DO SISTEMA

![Arquiterura-Logica](./Arquivos/Imagens/Arquitetura%20Lógica%20do%20Sistema%20-gRED.svg)

No diagrama fornecido, a arquitetura lógica do sistema é dividida em duas partes: back-end e front-end. O back-end é a parte do sistema responsável por processar os dados e fornecer os serviços necessários para o front-end. Ele é composto pelos seguintes componentes: Services, Controllers, Routes e o Database.

Os Services são os componentes responsáveis por implementar as funcionalidades do sistema. Os Controllers são os componentes responsáveis por receber as solicitações do front-end e enviá-las aos Services. As Routes são as regras que determinam qual Service deve ser chamado para atender a uma determinada solicitação. Por fim, o Database é o repositório de dados do sistema, sendo acessado através do Schema Prisma, que é uma ferramenta de mapeamento objeto-relacional (ORM) que permite a interação com o banco de dados de uma maneira mais fácil.

O front-end por sua vez, é a parte do sistema responsável pela interação com o usuário. Ele é composto pelos seguintes componentes: os Services e a View.

Os Services se comunicam com o back-end para buscar dados e fornecê-los à visualização. A View é o componente responsável por renderizar a interface gráfica do usuário.

A comunicação entre o back-end e o front-end é feita através do Middleware, uma camada intermediária entre o back-end e o front-end, que pode ser usado para fornecer serviços comuns aos dois lados do sistema, como autenticação, autorização e segurança.


# 6. DIAGRAMA DE CLASSES

![Diagrama-Classes](./Arquivos/Imagens/Diagrama%20de%20Classe%20-%20gRED.svg)

# 7. MODELO LÓGICO DO BANCO DE DADOS

![Modelo-Logico-Dados](./Arquivos/Imagens/Modelo%20de%20Dados%20-%20RED.svg)

# Anexo 1 - PROTÓTIPO

[Protótipo](./Arquivos/Protótipo%20-%20gRED.pdf)


