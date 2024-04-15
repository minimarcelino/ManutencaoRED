[**🏠Retornar ao Início**](./../README.md)

# 📝 Manual do Sistema de Gerenciamento do Regime de Exercícios Domiciliares

## Escopo do sistema
O **Sistema de Gerenciamento do Regime de Exercícios Domiciliares (GRED)** tem como objetivo primordial automatizar e organizar os processos relacionados à concessão, acompanhamento e registro do regime de exercícios domiciliares para os estudantes, conforme as diretrizes do Regime de Exercícios Domiciliares constituída no Decreto-lei n° 1.044/1969. O GRED proporcionará maior eficiência, transparência e agilidade na administração deste regime, beneficiando tanto os estudantes quanto a instituição de ensino.

## Regras de negócio
O **Sistema de Gerenciamento do Regime de Exercícios Domiciliares (GRED)** possui quatro níveis de acesso com diferentes funcionalidades, cada um desempenhando um papel específico no processo de gerenciamento do Regime de Exercícios Domiciliares.

### Nível de Acesso CRA (Coordenadoria Registro Acadêmico)

- **Criação de Processo RED**: Somente o CRA tem permissão para criar um novo processo de Regime de Exercícios Domiciliares (RED) para um aluno. O CRA deve preencher todas as informações necessárias do aluno e do processo.
- **Visualização de Processo RED**: O CRA pode visualizar e acompanhar o processo RED ao longo de suas etapas.
- **Manutenção de Dados de Alunos**: O CRA pode atualizar informações pessoais e acadêmicas dos alunos, garantindo que os dados estejam corretos e atualizados.
- **Envio de E-mail para Coordenador**: Após a criação do processo RED, o sistema deve automatizar o envio de um e-mail para o coordenador, alertando sobre a criação do processo RED.
- **Recebimento de Relatório Final**: O CRA deve ser capaz de receber o relatório final do processo RED, que inclui os abonos de falta e outras informações relevantes.

### Nível de Acesso CSP (Coordenadoria Sociopedagógica)

- **Visualização de Processo RED**: O CSP pode visualizar e acompanhar o processo RED ao longo de suas etapas.
- **Associação de Disciplinas ao Processo RED**: O CSP pode associar disciplinas ao processo RED de um aluno, garantindo que as disciplinas corretas estejam vinculadas ao regime de exercícios domiciliares.
- **Manutenção de Cursos**: O CSP é responsável pela manutenção dos cursos oferecidos, assegurando que as informações estejam atualizadas.
- **Manutenção e Importação de Disciplinas**: O CSP pode adicionar, atualizar ou importar disciplinas, mantendo a lista de disciplinas atualizada.
- **Manutenção de Servidores e Docentes**: O CSP deve manter informações sobre servidores e dados dos docentes atualizados, incluindo atribuições de disciplinas.
- **Geração de Relatório de Faltas Abonadas**: O CSP pode gerar relatórios que mostram as faltas que serão abonadas com base nos Planos Especiais de Estudos (PEEs).

### Nível de Acesso Coordenador

- **Confirmação de Processos RED**: Após a criação do RED, o coordenador pode confirmar ou rejeitar o processo aberto pela CRA. Se confirmado, o servidor da CSP é notificado para dar prosseguimento ao processo.
- **Indicação de Professores**: O coordenador pode indicar o(s) professor(es) responsável(eis) por cada disciplina relacionada ao RED do aluno.
- **Envio de E-mails aos Professores**: O coordenador pode enviar e-mails aos professores, lembrando-os da necessidade de preencher os PEEs e informando sobre a criação de novos processos RED.
- **Visualização de Processos RED**: O coordenador pode visualizar todos os processos RED relacionados ao seu curso, incluindo informações como prazos de entrega e outras informações relevantes.
- **Manutenção e Importação de Disciplinas**: O coordenador pode adicionar, atualizar ou importar disciplinas, mantendo a lista de disciplinas atualizada.
- **Manutenção de Docentes**: O coordenador deve manter informações dos docentes atualizados, incluindo atribuições de disciplinas.

### Nível de Acesso Professor

- **Preenchimento do Plano Especial de Estudos (PEE)**: O professor é responsável por preencher o PEE com as atividades a serem desenvolvidas pelo aluno que está no regime de exercícios domiciliares.
- **Visualização de PEE:** O professor pode visualizar todos os PEEs nos quais é responsável.
- **Envio do PEE para o Aluno**: Após o preenchimento do PEE, o professor deve enviá-lo por e-mail para o aluno. Isso assegura que o aluno tenha conhecimento das atividades a serem realizadas durante o período de exercícios domiciliares.
- **Indicação da Porcentagem de Faltas Abonadas**: O professor deve indicar a porcentagem de faltas a serem abonadas de acordo com o PEE. Isso permite que o sistema calcule as faltas a serem abonadas com base nas atividades realizadas.
- **Finalização do PEE**: Após a avaliação das atividades desenvolvidas pelo aluno e a determinação da porcentagem de faltas a serem abonadas, o professor pode finalizar o PEE. Isso marca o fim do processo de planejamento do aluno para exercícios domiciliares.
- **Envio de E-mails ao coordenador**: Após a finalização do PEE, é enviado um e-mail ao coordenador responsável indicando a finalização deste PEE.
